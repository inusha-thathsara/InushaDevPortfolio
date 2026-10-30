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

    // Intercept YouTube requests to prevent cross-origin SPA errors and provide native embed experience
    const isYouTube = parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be");
    if (isYouTube) {
      let videoId = parsedUrl.searchParams.get("v");
      if (!videoId) {
        const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
        if (pathParts[0] === "embed" || pathParts[0] === "v" || pathParts[0] === "shorts") {
          videoId = pathParts[1];
        } else if (parsedUrl.hostname.includes("youtu.be")) {
          videoId = pathParts[0];
        }
      }

      if (videoId) {
        return NextResponse.redirect(`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`);
      }

      // Return clean CyberTube Media Portal with 0 CORS errors
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>CyberTube Stream Portal</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                background: #060913;
                color: #e2e8f0;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 24px;
              }
              .container { max-width: 880px; width: 100%; display: flex; flex-direction: column; gap: 20px; }
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 12px;
              }
              .logo { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 15px; color: #ff0055; }
              .ext-btn {
                background: rgba(255,255,255,0.08);
                color: #38bdf8;
                border: 1px solid rgba(56,189,248,0.3);
                padding: 6px 12px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 11px;
                font-weight: bold;
                transition: all 0.15s;
              }
              .ext-btn:hover { background: rgba(56,189,248,0.2); }
              .player-wrap {
                width: 100%;
                aspect-ratio: 16 / 9;
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.15);
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
              }
              iframe { width: 100%; height: 100%; border: none; }
              .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
              .card {
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 10px;
                padding: 12px;
                cursor: pointer;
                text-decoration: none;
                color: #cbd5e1;
                font-size: 11px;
                transition: all 0.15s;
              }
              .card:hover {
                background: rgba(255,255,255,0.08);
                border-color: #00f5d4;
                color: #fff;
              }
              .badge { display: inline-block; font-size: 9px; padding: 2px 6px; border-radius: 4px; background: rgba(0,245,212,0.15); color: #00f5d4; margin-bottom: 6px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">▶ CYBERTUBE // EMBEDDED STREAM</div>
                <a class="ext-btn" href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">Open Full YouTube ↗</a>
              </div>
              <div class="player-wrap">
                <iframe src="https://www.youtube-nocookie.com/embed/4xDzrJKXOOY?autoplay=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              <div class="grid">
                <a class="card" href="/api/proxy?url=https://www.youtube.com/watch?v=4xDzrJKXOOY">
                  <span class="badge">CHILL / CODE</span>
                  <div><strong>Cyberpunk Synthwave Radio</strong></div>
                  <div style="color: #64748b; margin-top: 4px;">24/7 Lofi Ambient Coding Beats</div>
                </a>
                <a class="card" href="/api/proxy?url=https://www.youtube.com/watch?v=T83USwG68n8">
                  <span class="badge">KEYNOTE</span>
                  <div><strong>Next.js Architecture Keynote</strong></div>
                  <div style="color: #64748b; margin-top: 4px;">Modern Full-Stack Web Development</div>
                </a>
                <a class="card" href="/api/proxy?url=https://www.youtube.com/watch?v=kCc8FmEb1nY">
                  <span class="badge">AI AGENTS</span>
                  <div><strong>Autonomous Coding Agents</strong></div>
                  <div style="color: #64748b; margin-top: 4px;">Deep Dive into Agentic Systems</div>
                </a>
                <a class="card" href="/api/proxy?url=https://www.youtube.com/watch?v=m0L-8s47sV4">
                  <span class="badge">SECURITY</span>
                  <div><strong>Cyber Security & Ethical Hacking</strong></div>
                  <div style="color: #64748b; margin-top: 4px;">Web Application Defense Architecture</div>
                </a>
              </div>
            </div>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-CyberNet-Proxy": "1",
          },
        }
      );
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

      // Neutralize window.top frame buster scripts safely
      html = html.replace(/top\.location/g, "window.location");
      html = html.replace(/window\.top/g, "window.self");

      // Strip meta CSP or X-Frame headers inside HTML meta tags
      html = html.replace(/<meta[^>]*http-equiv=["']?(content-security-policy|x-frame-options)["']?[^>]*>/gi, "");

      // Strip known tracking scripts that trigger CORS blocks
      html = html.replace(/<script[^>]*(?:googleads|doubleclick|googletagmanager|google-analytics|adservice)[^>]*>[\s\S]*?<\/script>/gi, "");

      // Inject robust client shim to prevent SecurityError and unhandled rejection noise
      const clientShim = `
        <script>
          (function() {
            try {
              var _push = history.pushState.bind(history);
              var _replace = history.replaceState.bind(history);
              history.pushState = function(s, t, u) { try { return _push(s, t, u); } catch(e){} };
              history.replaceState = function(s, t, u) { try { return _replace(s, t, u); } catch(e){} };
            } catch(e) {}
            window.addEventListener('unhandledrejection', function(e) {
              if (e && e.reason && typeof e.reason.message === 'string' && (e.reason.message.includes('Failed to fetch') || e.reason.message.includes('NetworkError'))) {
                e.preventDefault();
              }
            });
          })();
        </script>
      `;

      if (/<head>/i.test(html)) {
        html = html.replace(/<head>/i, `<head>${baseTag}${clientShim}`);
      } else {
        html = `${baseTag}${clientShim}${html}`;
      }

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
