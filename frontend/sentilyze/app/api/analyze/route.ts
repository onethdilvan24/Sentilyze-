import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

type OverallSentiment = "Bullish" | "Bearish" | "Neutral";
type Signal = "BUY" | "SELL" | "HOLD";
type ArticleSentiment = "Positive" | "Negative" | "Neutral";

interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  sourceName: string;
}

interface OpenAIAnalysisPayload {
  overallSentiment: OverallSentiment;
  signal: Signal;
  confidence: number;
  aiScore: number;
  summary: string;
  articleAnalyses: Array<{
    index: number;
    sentiment: ArticleSentiment;
    impactScore: number;
  }>;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newsApiKey = process.env.NEWSAPI_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    const placeholderNews =
      !newsApiKey ||
      newsApiKey === "YOUR_NEWSAPI_KEY" ||
      newsApiKey.toLowerCase().startsWith("your_");
    const placeholderOpenAI =
      !openaiApiKey ||
      openaiApiKey === "YOUR_OPENAI_API_KEY" ||
      openaiApiKey.toLowerCase().startsWith("your_");

    if (placeholderNews || placeholderOpenAI) {
      const missing: string[] = [];
      if (placeholderNews) missing.push("NEWSAPI_KEY");
      if (placeholderOpenAI) missing.push("OPENAI_API_KEY");
      return NextResponse.json(
        {
          error: `Add real API keys in .env.local (still placeholder or empty): ${missing.join(", ")}. Restart dev server after saving.`,
        },
        { status: 500 },
      );
    }

    const body = await req.json();
    const rawSymbol = typeof body.symbol === "string" ? body.symbol.trim() : "";

    if (!rawSymbol || rawSymbol.length > 64) {
      return NextResponse.json(
        { error: "Enter a valid market symbol or keyword (1–64 characters)." },
        { status: 400 },
      );
    }

    const articles = await fetchNewsArticles(rawSymbol, newsApiKey);

    if (articles.length === 0) {
      return NextResponse.json(
        {
          error:
            "No recent news articles found for this search. Try a different symbol or broader keyword.",
        },
        { status: 404 },
      );
    }

    const analysis = await analyzeWithOpenAI(rawSymbol, articles, openaiApiKey);

    const newsItems = articles.map((article, idx) => {
      const row = analysis.articleAnalyses.find((a) => a.index === idx + 1);
      return {
        title: article.title,
        source: article.sourceName,
        sentiment: row?.sentiment ?? ("Neutral" as ArticleSentiment),
        impactScore: Math.min(10, Math.max(1, row?.impactScore ?? 5)),
        url: article.url,
        publishedAt: article.publishedAt,
      };
    });

    const responsePayload = {
      symbol: rawSymbol.toUpperCase(),
      timestamp: new Date().toISOString(),
      overallSentiment: analysis.overallSentiment,
      signal: analysis.signal,
      confidence: clamp(analysis.confidence, 0, 100),
      aiScore: clamp(analysis.aiScore, 0, 100),
      summary: analysis.summary,
      newsItems,
    };

    // Persist analysis to Supabase. Failures are logged, never break the response.
    try {
      const supabase = await createSupabaseServerClient();
      const user = await currentUser();
      const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
      const displayName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : (user?.firstName ?? user?.username ?? null);

      await supabase.from("profiles").upsert(
        {
          clerk_user_id: userId,
          email,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_user_id" },
      );

      const { data: inserted, error: analysisErr } = await supabase
        .from("analyses")
        .insert({
          clerk_user_id: userId,
          symbol: responsePayload.symbol,
          overall_sentiment: responsePayload.overallSentiment,
          signal: responsePayload.signal,
          confidence: responsePayload.confidence,
          ai_score: responsePayload.aiScore,
          summary: responsePayload.summary,
        })
        .select("id")
        .single();

      if (analysisErr) throw analysisErr;

      if (inserted?.id && newsItems.length > 0) {
        const { error: newsErr } = await supabase
          .from("analysis_news_items")
          .insert(
            newsItems.map((n) => ({
              analysis_id: inserted.id,
              title: n.title,
              source: n.source,
              sentiment: n.sentiment,
              impact_score: n.impactScore,
              url: n.url,
              published_at: n.publishedAt,
            })),
          );
        if (newsErr) throw newsErr;
      }
    } catch (persistErr) {
      console.warn("[api/analyze] supabase persist failed", persistErr);
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("[api/analyze]", err);
    const message =
      err instanceof Error ? err.message : "Unexpected error during analysis.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function fetchNewsArticles(
  symbol: string,
  apiKey: string,
): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    q: symbol,
    sortBy: "publishedAt",
    language: "en",
    pageSize: "10",
    apiKey,
  });

  const res = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`,
    { next: { revalidate: 0 } },
  );

  const data = (await res.json()) as {
    status: string;
    totalResults?: number;
    articles?: Array<{
      title: string | null;
      description: string | null;
      url: string | null;
      publishedAt: string | null;
      source?: { name?: string | null };
    }>;
    message?: string;
    code?: string;
  };

  if (!res.ok || data.status !== "ok" || !data.articles) {
    throw new Error(
      data.message ??
        `NewsAPI error${data.code ? ` (${data.code})` : ""}`,
    );
  }

  return data.articles
    .filter((a) => a.title && a.url)
    .slice(0, 10)
    .map((a) => ({
      title: a.title as string,
      description: a.description,
      url: a.url as string,
      publishedAt: a.publishedAt ?? new Date().toISOString(),
      sourceName: a.source?.name?.trim() || "Unknown",
    }));
}

function buildPrompt(symbol: string, articles: NewsArticle[]): string {
  const lines = articles.map((a, i) => {
    const desc = (a.description ?? "").slice(0, 280);
    return `${i + 1}. ${a.title}\n   ${desc}`;
  });

  return `You analyze headlines for potential impact on the market asset or topic: "${symbol}".

For EACH numbered headline (1-${articles.length}), judge likely short-term market impact for "${symbol}":
- sentiment: "Positive", "Negative", or "Neutral"
- impactScore: integer 1-10 (how strong the expected impact is)

Then provide an aggregate assessment:
- overallSentiment: "Bullish", "Bearish", or "Neutral"
- signal: "BUY", "SELL", or "HOLD" (trading-style stance based only on this news set)
- confidence: number 0-100
- aiScore: number 0-100 (overall conviction quality of the news-based view)
- summary: 2-4 sentences in plain English

Headlines:
${lines.join("\n\n")}

Respond with JSON only, matching this shape:
{
  "overallSentiment": "Bullish" | "Bearish" | "Neutral",
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": number,
  "aiScore": number,
  "summary": string,
  "articleAnalyses": [
    { "index": number, "sentiment": "Positive" | "Negative" | "Neutral", "impactScore": number }
  ]
}

Use index 1 through ${articles.length} matching the headline numbers above.`;
}

async function analyzeWithOpenAI(
  symbol: string,
  articles: NewsArticle[],
  apiKey: string,
): Promise<OpenAIAnalysisPayload> {
  const prompt = buildPrompt(symbol, articles);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a concise financial news analyst. Output valid JSON only. Base judgments only on the provided headlines and snippets.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const completion = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(
      completion.error?.message ?? `OpenAI HTTP error (${res.status}).`,
    );
  }

  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse OpenAI JSON response.");
  }

  const payload = parsed as Partial<OpenAIAnalysisPayload>;
  if (
    !payload.overallSentiment ||
    !payload.signal ||
    typeof payload.summary !== "string" ||
    !Array.isArray(payload.articleAnalyses)
  ) {
    throw new Error("OpenAI response missing required fields.");
  }

  return {
    overallSentiment: payload.overallSentiment,
    signal: payload.signal,
    confidence: Number(payload.confidence) || 0,
    aiScore: Number(payload.aiScore) || 0,
    summary: payload.summary,
    articleAnalyses: payload.articleAnalyses.map((a) => ({
      index: Number(a.index),
      sentiment: a.sentiment,
      impactScore: Number(a.impactScore) || 5,
    })),
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}
