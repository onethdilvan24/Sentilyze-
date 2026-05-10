import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

interface NewsRow {
  id: string;
  title: string;
  source: string;
  sentiment: string | null;
  impact_score: number | null;
  url: string;
  published_at: string;
  symbol: string;
  origin: "analysis" | "cache";
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? "30", 10) || 30, 1),
    100,
  );

  const supabase = await createClient();

  const { data: watchlist } = await supabase
    .from("watchlist_items")
    .select("symbol")
    .eq("clerk_user_id", userId);

  const symbols = (watchlist ?? []).map((w) => w.symbol);

  const { data: analysisNews } = await supabase
    .from("analysis_news_items")
    .select(
      "id, title, source, sentiment, impact_score, url, published_at, analysis:analyses!inner(symbol, clerk_user_id)",
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  const fromAnalyses: NewsRow[] = (analysisNews ?? []).map((row) => {
    const analysis = (row as unknown as { analysis: { symbol: string } }).analysis;
    return {
      id: row.id,
      title: row.title,
      source: row.source,
      sentiment: row.sentiment,
      impact_score: row.impact_score,
      url: row.url,
      published_at: row.published_at,
      symbol: analysis?.symbol ?? "",
      origin: "analysis",
    };
  });

  let fromCache: NewsRow[] = [];
  if (symbols.length > 0) {
    const { data: cacheRows } = await supabase
      .from("news_cache")
      .select("id, title, source, url, published_at, symbol")
      .in("symbol", symbols)
      .order("published_at", { ascending: false })
      .limit(limit);

    fromCache = (cacheRows ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      source: row.source,
      sentiment: null,
      impact_score: null,
      url: row.url,
      published_at: row.published_at,
      symbol: row.symbol,
      origin: "cache",
    }));
  }

  const seen = new Set<string>();
  const merged = [...fromAnalyses, ...fromCache]
    .filter((row) => {
      if (seen.has(row.url)) return false;
      seen.add(row.url);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )
    .slice(0, limit);

  return NextResponse.json({ items: merged, watchlistSymbols: symbols });
}
