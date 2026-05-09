"use client";

import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  RefreshCw,
  Zap,
  AlertCircle,
  Clock,
  Activity,
  Target,
  Newspaper,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

type Signal = "BUY" | "SELL" | "HOLD";
type Impact = "Positive" | "Negative" | "Neutral";
type OverallSentiment = "Bullish" | "Bearish" | "Neutral";

interface AnalysisApiResponse {
  symbol: string;
  timestamp: string;
  overallSentiment: OverallSentiment;
  signal: Signal;
  confidence: number;
  aiScore: number;
  summary: string;
  newsItems: Array<{
    title: string;
    source: string;
    sentiment: Impact;
    impactScore: number;
    url: string;
    publishedAt: string;
  }>;
}

export default function AnalysisPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<Impact | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [marketInput, setMarketInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisApiResponse | null>(null);

  const handleAnalyze = async () => {
    const symbol = marketInput.trim();
    if (!symbol) {
      setError("Enter a market symbol or keyword.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAnalysisResult(null);
        setError(
          typeof data.error === "string"
            ? data.error
            : `Analysis failed (${res.status}).`,
        );
        return;
      }

      setAnalysisResult(data as AnalysisApiResponse);
    } catch (e) {
      setAnalysisResult(null);
      setError(
        e instanceof Error ? e.message : "Network error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = useMemo(() => {
    if (!analysisResult?.newsItems) return [];
    return analysisResult.newsItems.filter((item) => {
      const matchesFilter =
        selectedFilter === "all" || item.sentiment === selectedFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [analysisResult, selectedFilter, searchQuery]);

  const getSignalColor = (signal: Signal) => {
    switch (signal) {
      case "BUY":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "SELL":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "HOLD":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }
  };

  const getImpactColor = (impact: Impact) => {
    switch (impact) {
      case "Positive":
        return "bg-emerald-400";
      case "Negative":
        return "bg-red-400";
      case "Neutral":
        return "bg-amber-400";
    }
  };

  const sentimentLabel = (s: OverallSentiment) => {
    switch (s) {
      case "Bullish":
        return "text-emerald-400";
      case "Bearish":
        return "text-red-400";
      default:
        return "text-amber-400";
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage="analysis"
      />

      <main className="flex-1 overflow-auto">
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
                <h1 className="text-2xl font-bold">Sentiment Analysis</h1>
                <p className="text-sm text-gray-400">
                  AI-powered market analysis from latest news
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={!analysisResult || loading}
                className="px-4 py-2 bg-white/5 rounded-lg flex gap-2 disabled:opacity-40"
              >
                <Download size={16} />
                Export
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !marketInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {loading ? "Analyzing…" : "Refresh"}
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Market Input Section */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-3">
              Enter Market to Analyze
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={marketInput}
                onChange={(e) => setMarketInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
                disabled={loading}
                placeholder="Enter market symbol (e.g., AAPL, BTC, EUR/USD)"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !marketInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin shrink-0" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Zap size={18} className="shrink-0" />
                    Start Analyze
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Fetches recent headlines from NewsAPI and scores impact with
              OpenAI (headlines only—minimal tokens).
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium">Analysis failed</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Aggregate result */}
          {analysisResult && (
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{analysisResult.symbol}</h3>
                    <p className={`text-sm font-medium ${sentimentLabel(analysisResult.overallSentiment)}`}>
                      Overall: {analysisResult.overallSentiment}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <span className="flex items-center justify-end gap-1">
                      <Clock size={14} />
                      {formatTime(analysisResult.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <span
                    className={`px-3 py-1 border rounded-lg font-medium ${getSignalColor(
                      analysisResult.signal,
                    )}`}
                  >
                    {analysisResult.signal}
                  </span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Activity size={14} />
                    AI Score: {analysisResult.aiScore}/100
                  </span>
                  <span className="text-gray-400">
                    Confidence: {analysisResult.confidence}%
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="px-5 py-3 bg-white/5 border-t flex flex-wrap gap-4 justify-between items-center">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Newspaper size={16} />
                  {analysisResult.newsItems.length} articles analyzed
                </span>
              </div>
            </div>
          )}

          {/* Filters for news list */}
          {analysisResult && analysisResult.newsItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {(["all", "Positive", "Negative", "Neutral"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        selectedFilter === f
                          ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {f === "all" ? "All headlines" : f}
                    </button>
                  ),
                )}
              </div>
              <input
                type="search"
                placeholder="Filter headlines…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm max-w-xs w-full sm:w-64"
              />
            </div>
          )}

          {/* Per-article cards */}
          <div className="space-y-4">
            {filteredNews.map((article, idx) => (
              <div
                key={`${article.url}-${idx}`}
                className="bg-zinc-950/80 border border-white/10 rounded-xl"
              >
                <div className="p-5 border-b border-white/5">
                  <div className="flex justify-between gap-4 flex-col sm:flex-row">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {article.source} · {formatTime(article.publishedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-start shrink-0">
                      <span
                        className={`px-3 py-1 border rounded-lg text-sm ${article.sentiment === "Positive" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : article.sentiment === "Negative" ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-amber-400 border-amber-500/30 bg-amber-500/10"}`}
                      >
                        {article.sentiment}
                      </span>
                      <span className="text-sm text-gray-400 px-2 py-1 border border-white/10 rounded-lg">
                        Impact {article.impactScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getImpactColor(article.sentiment)}`}
                    />
                    <span className="text-sm text-gray-400">
                      Headline-level sentiment
                    </span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 flex gap-2 text-sm hover:underline"
                  >
                    <ExternalLink size={16} />
                    Read article
                  </a>
                </div>
              </div>
            ))}
          </div>

          {!loading && !analysisResult && !error && (
            <div className="text-center p-12 border border-white/10 border-dashed rounded-xl text-gray-500">
              <Target className="mx-auto mb-3 opacity-50" size={40} />
              <p className="font-medium text-gray-400">
                Enter a symbol and run analysis
              </p>
              <p className="text-sm mt-1">
                Results combine NewsAPI headlines with a single batched OpenAI
                request.
              </p>
            </div>
          )}

          {analysisResult && filteredNews.length === 0 && (
            <div className="text-center p-12 border rounded-xl">
              <AlertCircle className="mx-auto mb-3" />
              No headlines match your filters
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
