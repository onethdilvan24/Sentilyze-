import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 1),
    100,
  );
  const sinceParam = url.searchParams.get("since");

  const supabase = await createClient();
  let query = supabase
    .from("analyses")
    .select(
      "id, symbol, overall_sentiment, signal, confidence, ai_score, summary, created_at, analysis_news_items(id, title, source, sentiment, impact_score, url, published_at)",
    )
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (sinceParam) {
    const since = new Date(sinceParam);
    if (!isNaN(since.getTime())) {
      query = query.gte("created_at", since.toISOString());
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("[api/analyses GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ analyses: data ?? [] });
}
