import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url query parameter", { status: 400 });
  }

  try {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch {
      return new NextResponse("Invalid URL provided", { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return new NextResponse("Protocol not supported", { status: 400 });
    }

    // Auto-rewrite DuckDuckGo client-side SPA to DuckDuckGo HTML version for full iframe compatibility
    let fetchUrl = parsedUrl.toString();
    const isDuckDuckGo = parsedUrl.hostname.includes("duckduckgo.com");
    const queryParam = parsedUrl.searchParams.get("q");

    if (isDuckDuckGo && queryParam) {
      fetchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(queryParam)}`;
    }

    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 CyberNet/2.5",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type") || "text/html";

    // If it's HTML, inject base tag and strip frame-busters
    if (contentType.toLowerCase().includes("text/html")) {
      let html = await response.text();

      // Compute base url for relative asset resolution
      const baseHref = `${parsedUrl.origin}${parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf("/") + 1) || "/"}`;
      const baseTag = `<base href="${baseHref}">`;

      if (/<head>/i.test(html)) {
        html = html.replace(/<head>/i, `<head>${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      // Neutralize window.top frame buster scripts safely
      html = html.replace(/top\.location/g, "window.location");
      html = html.replace(/window\.top/g, "window.self");

      // Strip meta CSP or X-Frame headers inside HTML meta tags
      html = html.replace(/<meta[^>]*http-equiv=["']?(content-security-policy|x-frame-options)["']?[^>]*>/gi, "");

      // If from DuckDuckGo, unwrap uddg links directly to proxy target
      if (isDuckDuckGo) {
        html = html.replace(/href="[^"]*uddg=([^"&]+)[^"]*"/g, (match, encodedUrl) => {
          try {
            const decoded = decodeURIComponent(encodedUrl);
            return `href="/api/proxy?url=${encodeURIComponent(decoded)}" target="_self"`;
          } catch {
            return match;
          }
        });
      }

      const headers = new Headers();
      headers.set("Content-Type", contentType);
      headers.set("Access-Control-Allow-Origin", "*");
      // Explicitly omit X-Frame-Options & CSP frame-ancestors
      headers.set("X-CyberNet-Proxy", "1");

      return new NextResponse(html, {
        status: response.status,
        headers,
      });
    }

    // Binary / raw stream for assets (images, css, fonts)
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              background: #080b14;
              color: #cbd5e1;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 24px;
              box-sizing: border-box;
              text-align: center;
            }
            .card {
              background: rgba(255, 255, 255, 0.04);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              padding: 32px 24px;
              max-width: 480px;
              width: 100%;
              backdrop-filter: blur(10px);
            }
            h2 { color: #f43f5e; margin-top: 0; font-size: 18px; }
            p { font-size: 13px; color: #94a3b8; line-height: 1.6; }
            .url { word-break: break-all; font-family: monospace; color: #38bdf8; font-size: 12px; }
            .btn {
              display: inline-block;
              margin-top: 20px;
              background: #00f5d4;
              color: #0b0f19;
              padding: 10px 20px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              font-size: 12px;
              transition: transform 0.15s;
            }
            .btn:hover { transform: scale(1.04); }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🛡️ CyberNet Proxy Notice</h2>
            <p>Direct proxy retrieval failed for target endpoint:</p>
            <p class="url">${targetUrl}</p>
            <p style="font-size: 11px; color: #64748b;">${error?.message || "Host unreachable or blocking proxy client"}</p>
            <a class="btn" href="${targetUrl}" target="_blank" rel="noopener noreferrer">Open In External Browser Tab ↗</a>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
