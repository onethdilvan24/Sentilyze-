"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Filter,
  Search,
  Menu,
  X,
  Newspaper,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

type Sentiment = "Bullish" | "Bearish" | "Neutral";
type Source = "Analysis" | "Watchlist";

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

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: Source;
  sourceName: string;
  sentiment: Sentiment;
  sentimentScore: number;
  relatedAssets: string[];
  timestamp: string;
  url: string;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return iso;
  const diffSec = Math.max(1, Math.round((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const m = Math.round(diffSec / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function mapRow(row: NewsRow): NewsItem {
  const sentiment: Sentiment =
    row.sentiment === "Positive"
      ? "Bullish"
      : row.sentiment === "Negative"
        ? "Bearish"
        : "Neutral";
  const score = Math.max(1, Math.min(10, row.impact_score ?? 5)) * 10;
  return {
    id: row.id,
    title: row.title,
    summary: "",
    source: row.origin === "analysis" ? "Analysis" : "Watchlist",
    sourceName: row.source,
    sentiment,
    sentimentScore:
      sentiment === "Bullish" ? 60 + Math.round(score / 5) : sentiment === "Bearish" ? 40 - Math.round(score / 5) : 50,
    relatedAssets: row.symbol ? [row.symbol] : [],
    timestamp: relativeTime(row.published_at),
    url: row.url,
  };
}

export default function NewsFeedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | "all">("all");
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/news-feed?limit=50", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : `Failed (${res.status}).`,
        );
      }
      setRows((data.items ?? []) as NewsRow[]);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const newsItems: NewsItem[] = useMemo(() => rows.map(mapRow), [rows]);

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "Bullish":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Bearish":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Neutral":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }
  };

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "Bullish":
        return <TrendingUp size={14} />;
      case "Bearish":
        return <TrendingDown size={14} />;
      case "Neutral":
        return <div className="w-3.5 h-0.5 bg-amber-400 rounded" />;
    }
  };

  const filteredNews = newsItems.filter((item) => {
    const matchesSource = selectedSource === "all" || item.source === selectedSource;
    const matchesSentiment =
      selectedSentiment === "all" || item.sentiment === selectedSentiment;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.sourceName.toLowerCase().includes(q) ||
      item.relatedAssets.some((asset) => asset.toLowerCase().includes(q));
    return matchesSource && matchesSentiment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage="news"
      />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <div>
                <h1 className="text-2xl font-bold">News Feed</h1>
                <p className="text-sm text-gray-400">
                  Real-time market news & sentiment
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadNews}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Refresh
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search news, assets, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedSource}
                  onChange={(e) =>
                    setSelectedSource(e.target.value as Source | "all")
                  }
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="all">All Sources</option>
                  <option value="Analysis">From My Analyses</option>
                  <option value="Watchlist">Watchlist Cache</option>
                </select>
              </div>

              {/* Sentiment Filter */}
              <select
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value as Sentiment | "all")}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="all">All Sentiment</option>
                <option value="Bullish">Bullish</option>
                <option value="Bearish">Bearish</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg">
                        <Newspaper size={14} />
                        {item.sourceName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.timestamp}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-sm font-medium ${getSentimentColor(item.sentiment)}`}
                    >
                      {getSentimentIcon(item.sentiment)}
                      {item.sentiment}
                      <span className="text-xs opacity-70">({item.sentimentScore}%)</span>
                    </span>
                  </div>

                  {/* Title */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-lg font-semibold mb-2 hover:text-cyan-400 transition-colors"
                  >
                    {item.title}
                  </a>

                  {/* Related Assets */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.relatedAssets.map((asset) => (
                      <span
                        key={asset}
                        className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs font-medium"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-xs text-gray-500">
                      Origin: {item.source === "Analysis" ? "Your analysis" : "Watchlist cache"}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors text-sm"
                    >
                      <ExternalLink size={14} />
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {loading && rows.length === 0 && (
              <div className="text-center py-12 bg-zinc-950/80 border border-white/10 rounded-xl">
                <Loader2 className="mx-auto mb-3 text-gray-500 animate-spin" size={32} />
                <p className="text-gray-400 text-sm">Loading news…</p>
              </div>
            )}

            {loadError && (
              <div className="text-center py-12 bg-zinc-950/80 border border-red-500/30 rounded-xl">
                <AlertCircle className="mx-auto mb-3 text-red-400" size={32} />
                <h3 className="text-lg font-semibold mb-1">Couldn&apos;t load news</h3>
                <p className="text-gray-400 text-sm">{loadError}</p>
              </div>
            )}

            {!loading && !loadError && filteredNews.length === 0 && (
              <div className="text-center py-12 bg-zinc-950/80 border border-white/10 rounded-xl">
                <Newspaper className="mx-auto mb-3 text-gray-500" size={48} />
                <h3 className="text-lg font-semibold mb-1">No news found</h3>
                <p className="text-gray-400 text-sm">
                  {newsItems.length === 0
                    ? "Run an analysis or add symbols to your watchlist to populate this feed."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
