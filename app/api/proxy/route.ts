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

    // Intercept DuckDuckGo to prevent Cloudflare 403 Forbidden blocks on cloud hosting IPs
    const isDuckDuckGo = parsedUrl.hostname.includes("duckduckgo.com");
    if (isDuckDuckGo) {
      const q = parsedUrl.searchParams.get("q") || "";
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>CyberSearch // ${q || "Search"}</title>
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
                justify-content: center;
                padding: 24px;
              }
              .card {
                max-width: 520px;
                width: 100%;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(0,245,212,0.3);
                border-radius: 16px;
                padding: 32px;
                text-align: center;
                box-shadow: 0 15px 40px rgba(0,0,0,0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
              }
              .icon {
                width: 54px;
                height: 54px;
                border-radius: 14px;
                background: rgba(0,245,212,0.15);
                border: 1px solid rgba(0,245,212,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #00f5d4;
                font-size: 24px;
              }
              h2 { font-size: 18px; color: #fff; margin-top: 4px; }
              p { font-size: 12px; color: #94a3b8; line-height: 1.6; }
              .btn {
                background: #00f5d4;
                color: #0b0f19;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                font-size: 13px;
                font-weight: bold;
                transition: transform 0.15s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
              }
              .btn:hover { transform: scale(1.02); }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="icon">⚡</div>
              <h2>CyberSearch // Web Gateway</h2>
              <p>Active query: <strong>${q || "Web Discovery"}</strong></p>
              <p>DuckDuckGo HTML blocks server-side scraping from cloud hosting IPs. Use CyberSearch built-in engine or launch directly in an external tab.</p>
              <a class="btn" href="https://duckduckgo.com/?q=${encodeURIComponent(q)}" target="_blank" rel="noopener noreferrer">Launch in Real Tab ↗</a>
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

    // Intercept LinkedIn requests to prevent 999 authwall blocks and provide clean identity portal
    const isLinkedIn = parsedUrl.hostname.includes("linkedin.com");
    if (isLinkedIn) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>LinkedIn Signal // Inusha Gunasekara</title>
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
                justify-content: center;
                padding: 24px;
              }
              .card {
                max-width: 520px;
                width: 100%;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(56,189,248,0.3);
                border-radius: 16px;
                padding: 32px;
                text-align: center;
                box-shadow: 0 15px 40px rgba(0,0,0,0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
              }
              .icon {
                width: 54px;
                height: 54px;
                border-radius: 14px;
                background: rgba(56,189,248,0.15);
                border: 1px solid rgba(56,189,248,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #38bdf8;
                font-size: 24px;
                font-weight: bold;
              }
              h2 { font-size: 18px; color: #fff; margin-top: 4px; }
              p { font-size: 12px; color: #94a3b8; line-height: 1.6; }
              .btn {
                background: #0077b5;
                color: #fff;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                font-size: 13px;
                font-weight: bold;
                transition: transform 0.15s, background 0.15s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
              }
              .btn:hover { background: #0088ce; transform: scale(1.02); }
              .tag { font-size: 10px; color: #38bdf8; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); padding: 4px 10px; border-radius: 20px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="icon">in</div>
              <span class="tag">PROFESSIONAL TRANSMISSION CHANNEL</span>
              <h2>Inusha Gunasekara on LinkedIn</h2>
              <p>LinkedIn requires direct member authentication and prohibits iframe embeds. Launch directly to view full experience, skills, and connect.</p>
              <a class="btn" href="${targetUrl}" target="_blank" rel="noopener noreferrer">Launch LinkedIn Profile ↗</a>
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

    const fetchUrl = parsedUrl.toString();
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

      // Neutralize third-party embedded tracking/auth iframes that violate external CSP (e.g. forem auth_pass)
      html = html.replace(/https:\/\/forem\.com\/auth_pass\/iframe/g, "about:blank");
      html = html.replace(/data-honeybadger-key=["'][^"']*["']/g, "");

      // Inject robust client shim to prevent SecurityError, Honeybadger recursive loops, and unhandled rejection noise
      const clientShim = `
        <script>
          (function() {
            // 1. Intercept window.fetch to route sub-requests (e.g. GitHub contributions) through proxy
            var _origFetch = window.fetch;
            window.fetch = function(resource, init) {
              try {
                var url = typeof resource === 'string' ? resource : (resource && resource.url ? resource.url : '');
                if (url) {
                  // Suppress known telemetry endpoints that get blocked by ad-blockers to keep console pristine
                  if (url.includes('/_private/browser/stats') || url.includes('/ahoy/visits') || url.includes('doubleclick') || url.includes('google-analytics') || url.includes('honeybadger')) {
                    return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
                  }
                  if (url.startsWith('http://') || url.startsWith('https://')) {
                    var parsed = new URL(url);
                    if (parsed.origin !== window.location.origin) {
                      var proxied = '/api/proxy?url=' + encodeURIComponent(url);
                      if (typeof resource === 'string') {
                        resource = proxied;
                      } else if (resource && resource.url) {
                        resource = new Request(proxied, init);
                      }
                    }
                  }
                }
              } catch(e) {}
              return _origFetch.apply(window, arguments).catch(function() {
                return new Response("", { status: 204 });
              });
            };

            // 2. Shims history to prevent SecurityError on foreign origins
            try {
              var _push = history.pushState.bind(history);
              var _replace = history.replaceState.bind(history);
              history.pushState = function(s, t, u) { try { return _push(s, t, u); } catch(e){} };
              history.replaceState = function(s, t, u) { try { return _replace(s, t, u); } catch(e){} };
            } catch(e) {}

            // 3. Suppress Honeybadger / error tracker infinite loop on third-party origins
            try {
              window.Honeybadger = {
                notify: function(){},
                configure: function(){},
                resetContext: function(){},
                setContext: function(){},
                beforeNotify: function(){ return false; }
              };
            } catch(e) {}

            // 4. Fallback mock storage if browser restricts cross-origin storage access
            try {
              var _ = window.localStorage;
            } catch(e) {
              var mem = {};
              var mock = {
                getItem: function(k) { return mem.hasOwnProperty(k) ? mem[k] : null; },
                setItem: function(k, v) { mem[k] = String(v); },
                removeItem: function(k) { delete mem[k]; },
                clear: function() { mem = {}; },
                key: function(i) { return Object.keys(mem)[i] || null; },
                get length() { return Object.keys(mem).length; }
              };
              try {
                Object.defineProperty(window, 'localStorage', { value: mock, configurable: true, writable: true });
                Object.defineProperty(window, 'sessionStorage', { value: mock, configurable: true, writable: true });
              } catch(err) {}
            }

            // 5. Suppress unhandled network rejection spam
            window.addEventListener('unhandledrejection', function(e) {
              e.preventDefault();
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

      // Normalize 403 from remote anti-bot challenges so client console doesn't dump red errors
      const normalizedStatus = response.status === 403 ? 200 : response.status;

      return new NextResponse(html, {
        status: normalizedStatus,
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
