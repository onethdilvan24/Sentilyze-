"use client";

import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  RefreshCw,
  Zap,
  AlertCircle,
  Clock,
  BarChart3,
  LineChart,
  Activity,
  Target,
  Newspaper,
  Twitter,
  Menu,
  X,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

type Signal = "BUY" | "SELL" | "HOLD";
type Impact = "Positive" | "Negative" | "Neutral";

export default function AnalysisPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<Signal | "all">("all");
  const [selectedAssetType, setSelectedAssetType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("24h");

  const analyses = [
    {
      id: 1,
      asset: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      currentPrice: "$182.45",
      priceChange: 2.3,
      signal: "BUY" as Signal,
      sentiment: "Bullish",
      confidence: 92.5,
      aiScore: 87,
      timestamp: "5 min ago",
      reasoning:
        "Strong positive sentiment following Q1 earnings beat. Social media mentions up 45% with 78% positive sentiment.",
      keyFactors: [
        { factor: "Earnings Beat", impact: "Positive" as Impact, weight: 35 },
        {
          factor: "Social Sentiment",
          impact: "Positive" as Impact,
          weight: 25,
        },
        {
          factor: "Technical Indicators",
          impact: "Positive" as Impact,
          weight: 20,
        },
        { factor: "News Coverage", impact: "Positive" as Impact, weight: 20 },
      ],
      sources: { total: 47, news: 12, social: 28, financial: 7 },
      sentiment_breakdown: { bullish: 72, neutral: 18, bearish: 10 },
      trending: true,
      volumeChange: 23.5,
    },
  ];

  const sentimentStats = {
    totalAnalyses: analyses.length,
    bullishCount: analyses.filter((a) => a.sentiment === "Bullish").length,
    bearishCount: analyses.filter((a) => a.sentiment === "Bearish").length,
    neutralCount: analyses.filter((a) => a.sentiment === "Neutral").length,
    avgConfidence: (
      analyses.reduce((acc, a) => acc + a.confidence, 0) / analyses.length
    ).toFixed(1),
    trendingAssets: analyses.filter((a) => a.trending).length,
  };

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

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((analysis) => {
      const matchesFilter =
        selectedFilter === "all" || analysis.signal === selectedFilter;
      const matchesType =
        selectedAssetType === "all" || analysis.type === selectedAssetType;
      const matchesSearch =
        analysis.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        analysis.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesType && matchesSearch;
    });
  }, [selectedFilter, selectedAssetType, searchQuery, analyses]);

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
                  AI-powered market analysis
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/5 rounded-lg flex gap-2">
                <Download size={16} />
                Export
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex gap-2">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {filteredAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-zinc-950/80 border border-white/10 rounded-xl"
            >
              <div className="p-5 border-b border-white/5">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{analysis.asset}</h3>
                    <p className="text-gray-400">{analysis.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{analysis.currentPrice}</div>
                    <div
                      className={`flex items-center gap-1 ${
                        analysis.priceChange >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {analysis.priceChange >= 0 ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                      {analysis.priceChange}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <span
                    className={`px-3 py-1 border rounded-lg ${getSignalColor(
                      analysis.signal,
                    )}`}
                  >
                    {analysis.signal}
                  </span>
                  <span className="text-cyan-400">
                    AI Score: {analysis.aiScore}/100
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-gray-400">
                    <Clock size={14} />
                    {analysis.timestamp}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-300">{analysis.reasoning}</p>

                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {analysis.keyFactors.map((f, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-white/5 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getImpactColor(
                            f.impact,
                          )}`}
                        />
                        {f.factor}
                      </div>
                      <span className="text-gray-400">{f.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 bg-white/5 border-t flex justify-between">
                <button className="text-cyan-400 flex gap-2">
                  <ExternalLink size={16} />
                  View Details
                </button>
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1.5 rounded-lg">
                  Set Alert
                </button>
              </div>
            </div>
          ))}

          {filteredAnalyses.length === 0 && (
            <div className="text-center p-12 border rounded-xl">
              <AlertCircle className="mx-auto mb-3" />
              No results found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
