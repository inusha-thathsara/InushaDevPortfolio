import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface SearchResultItem {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  category?: string;
  badge?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ query: "", results: [] });
  }

  const results: SearchResultItem[] = [];
  const lowerQ = query.toLowerCase();

  // 1. Direct Instant Matching for known popular services & Inusha's profiles
  if (lowerQ.includes("inusha") || lowerQ.includes("thathsara") || lowerQ.includes("author") || lowerQ.includes("portfolio")) {
    results.push({
      title: "Malawige Inusha Thathsara Gunasekara - GitHub Profile",
      url: "https://github.com/inusha-thathsara",
      displayUrl: "github.com/inusha-thathsara",
      snippet: "AI Systems Engineer · University of Moratuwa. Over 55+ open-source repositories across agentic AI, LLM tooling, and full-stack cloud infrastructure.",
      category: "Operator",
      badge: "VERIFIED TWIN",
    });
    results.push({
      title: "Inusha Gunasekara - LinkedIn",
      url: "https://linkedin.com/in/inusha-gunasekara-9996632a5",
      displayUrl: "linkedin.com/in/inusha-gunasekara",
      snippet: "Connect with Inusha on LinkedIn. Experience in AI engineering, machine learning pipelines, and software architecture.",
      category: "Operator",
      badge: "LINKEDIN",
    });
  }

  if (lowerQ.includes("youtube") || lowerQ.includes("yt") || lowerQ.includes("video")) {
    results.push({
      title: "YouTube - Broadcast Yourself",
      url: "https://www.youtube.com",
      displayUrl: "www.youtube.com",
      snippet: "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.",
      category: "Media",
      badge: "STREAMING",
    });
  }

  if (lowerQ.includes("github") || lowerQ.includes("git")) {
    results.push({
      title: "GitHub: Let's build from here",
      url: "https://github.com",
      displayUrl: "github.com",
      snippet: "GitHub is where over 100 million developers shape the future of software, together. Explore open source, code repositories, and collaboration.",
      category: "Developer",
      badge: "CODE HUB",
    });
  }

  if (lowerQ.includes("wikipedia") || lowerQ.includes("wiki")) {
    results.push({
      title: "Wikipedia, the free encyclopedia",
      url: "https://en.m.wikipedia.org",
      displayUrl: "en.m.wikipedia.org",
      snippet: "Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.",
      category: "Knowledge",
      badge: "ENCYCLOPEDIA",
    });
  }

  // 2. Fetch live web results via DuckDuckGo HTML Engine
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(ddgUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 CyberNet/2.5",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const html = await response.text();

      const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g;
      const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/g;

      const titleMatches = [...html.matchAll(titleRegex)];
      const snippetMatches = [...html.matchAll(snippetRegex)];

      for (let i = 0; i < titleMatches.length && results.length < 15; i++) {
        const rawUrl = titleMatches[i][1];
        let cleanUrl = rawUrl;

        // Unwrap DuckDuckGo redirect wrapper (uddg parameter)
        if (rawUrl.includes("uddg=")) {
          const uMatch = rawUrl.match(/uddg=([^&]+)/);
          if (uMatch) {
            cleanUrl = decodeURIComponent(uMatch[1]);
          }
        } else if (rawUrl.startsWith("//")) {
          cleanUrl = `https:${rawUrl}`;
        }

        const rawTitle = titleMatches[i][2].replace(/<[^>]+>/g, "").trim();
        const rawSnippet = snippetMatches[i]
          ? snippetMatches[i][1].replace(/<[^>]+>/g, "").trim()
          : "";

        // Avoid adding duplicates
        if (!results.some((r) => r.url.toLowerCase() === cleanUrl.toLowerCase())) {
          try {
            const parsed = new URL(cleanUrl);
            results.push({
              title: rawTitle || cleanUrl,
              url: cleanUrl,
              displayUrl: parsed.hostname.replace("www.", "") + (parsed.pathname !== "/" ? parsed.pathname.substring(0, 20) : ""),
              snippet: rawSnippet || `Live web destination on ${parsed.hostname}. Click to visit.`,
              category: "Web",
            });
          } catch {
            // invalid URL format, skip
          }
        }
      }
    }
  } catch (err) {
    console.warn("Live search fetch error:", err);
  }

  // 3. Fallback: Wikipedia OpenSearch API if results are sparse
  if (results.length < 3) {
    try {
      const wikiRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&namespace=0&format=json`,
        { headers: { "User-Agent": "CyberNetBrowser/2.5" } }
      );
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const titles = wikiData[1] || [];
        const snippets = wikiData[2] || [];
        const urls = wikiData[3] || [];

        for (let i = 0; i < titles.length; i++) {
          const u = urls[i];
          if (u && !results.some((r) => r.url === u)) {
            results.push({
              title: titles[i],
              url: u.replace("en.wikipedia.org", "en.m.wikipedia.org"), // mobile version is embed friendly
              displayUrl: "en.m.wikipedia.org",
              snippet: snippets[i] || `Encyclopedia entry for ${titles[i]}`,
              category: "Wikipedia",
              badge: "WIKI",
            });
          }
        }
      }
    } catch {}
  }

  return NextResponse.json({
    query,
    resultsCount: results.length,
    results,
  });
}
