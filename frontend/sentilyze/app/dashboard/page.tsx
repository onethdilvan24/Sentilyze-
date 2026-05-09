"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Search,
  Settings,
  LayoutDashboard,
  Target,
  Newspaper,
  BarChart3,
  Users,
  Zap,
  ChevronDown,
  Activity,
  DollarSign,
  Percent,
  AlertCircle,
  ExternalLink,
  Filter,
  Calendar,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { useUser, UserButton } from "@clerk/nextjs";

type DashSignal = "BUY" | "SELL" | "HOLD";
type DashSentiment = "Bullish" | "Bearish" | "Neutral";

export default function SentilyzeDashboard() {
  const { user, isLoaded } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  // Get user's display name and initials
  const displayName = user?.firstName || user?.username || "User";
  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName
    ? user.firstName.substring(0, 2)
    : user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "U";

  // Sample data
  const sentimentOverview = {
    totalSignals: 1247,
    signalChange: 12.5,
    bullishSignals: 634,
    bullishChange: 18.2,
    bearishSignals: 421,
    bearishChange: -5.3,
    neutralSignals: 192,
    neutralChange: 3.1,
    accuracy: 87.4,
    accuracyChange: 2.1,
  };

  const topSignals = [
    {
      id: 1,
      asset: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      signal: "BUY",
      sentiment: "Bullish",
      confidence: 92.5,
      price: "$182.45",
      change: 2.3,
      sources: 47,
      trend: "up",
    },
    {
      id: 2,
      asset: "BTC/USD",
      name: "Bitcoin",
      type: "Crypto",
      signal: "HOLD",
      sentiment: "Neutral",
      confidence: 78.2,
      price: "$43,250",
      change: 0.8,
      sources: 89,
      trend: "neutral",
    },
    {
      id: 3,
      asset: "TSLA",
      name: "Tesla Inc.",
      type: "Stock",
      signal: "SELL",
      sentiment: "Bearish",
      confidence: 85.7,
      price: "$238.72",
      change: -3.2,
      sources: 62,
      trend: "down",
    },
    {
      id: 4,
      asset: "EUR/USD",
      name: "Euro/US Dollar",
      type: "Forex",
      signal: "BUY",
      sentiment: "Bullish",
      confidence: 81.3,
      price: "1.0876",
      change: 1.5,
      sources: 34,
      trend: "up",
    },
    {
      id: 5,
      asset: "NVDA",
      name: "NVIDIA Corp.",
      type: "Stock",
      signal: "BUY",
      sentiment: "Bullish",
      confidence: 94.1,
      price: "$495.32",
      change: 4.7,
      sources: 71,
      trend: "up",
    },
  ];

  const recentNews = [
    {
      id: 1,
      title: "Fed Signals Potential Rate Cuts in Q2 2026",
      source: "Bloomberg",
      sentiment: "Bullish",
      impact: "High",
      time: "15 min ago",
      affectedAssets: ["SPY", "DIA", "QQQ"],
    },
    {
      id: 2,
      title: "Apple Announces Record Q1 Revenue",
      source: "CNBC",
      sentiment: "Bullish",
      impact: "Medium",
      time: "1 hour ago",
      affectedAssets: ["AAPL"],
    },
    {
      id: 3,
      title: "Bitcoin ETF Sees Major Institutional Inflows",
      source: "CoinDesk",
      sentiment: "Bullish",
      impact: "High",
      time: "2 hours ago",
      affectedAssets: ["BTC", "ETH"],
    },
    {
      id: 4,
      title: "Tesla Recalls 50K Vehicles Due to Software Issue",
      source: "Reuters",
      sentiment: "Bearish",
      impact: "Medium",
      time: "3 hours ago",
      affectedAssets: ["TSLA"],
    },
  ];

  const trendingAssets = [
    { asset: "NVDA", mentions: 2847, change: 45.2, sentiment: "Bullish" },
    { asset: "AAPL", mentions: 2134, change: 23.1, sentiment: "Bullish" },
    { asset: "BTC", mentions: 1923, change: 12.7, sentiment: "Neutral" },
    { asset: "TSLA", mentions: 1756, change: -8.4, sentiment: "Bearish" },
    { asset: "MSFT", mentions: 1542, change: 18.9, sentiment: "Bullish" },
  ];

  const performanceMetrics = [
    { label: "Win Rate", value: "78.4%", change: 3.2, period: "Last 30 days" },
    {
      label: "Avg Confidence",
      value: "84.7%",
      change: 1.8,
      period: "Last 30 days",
    },
    {
      label: "Signal Speed",
      value: "2.3s",
      change: -12.5,
      period: "Avg response time",
    },
    {
      label: "Data Sources",
      value: "247",
      change: 8.7,
      period: "Active sources",
    },
  ];

  const getSignalColor = (signal: DashSignal | string) => {
    switch (signal) {
      case "BUY":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "SELL":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "HOLD":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getSentimentColor = (sentiment: DashSentiment | string) => {
    switch (sentiment) {
      case "Bullish":
        return "text-emerald-400";
      case "Bearish":
        return "text-red-400";
      case "Neutral":
        return "text-amber-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        .gradient-text {
          background: linear-gradient(135deg, #00f5ff 0%, #00a6ff 50%, #7b2cbf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Sidebar */}
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <div>
                <h1 className="text-2xl font-bold">
                  Welcome Back{isLoaded && user ? `, ${displayName}` : ""}!
                </h1>
                <p className="text-sm text-gray-400">
                  Here's what's happening with your signals today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 w-64"
                />
              </div>

              <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Total Signals</span>
                <Target className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {sentimentOverview.totalSignals.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">
                      +{sentimentOverview.signalChange}%
                    </span>
                    <span className="text-gray-500">vs last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Bullish Signals</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {sentimentOverview.bullishSignals}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">
                      +{sentimentOverview.bullishChange}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-red-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Bearish Signals</span>
                <TrendingDown className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {sentimentOverview.bearishSignals}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                    <span className="text-red-400">
                      {sentimentOverview.bearishChange}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Neutral Signals</span>
                <Minus className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-400">
                    {sentimentOverview.neutralSignals}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">
                      +{sentimentOverview.neutralChange}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-cyan-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Accuracy Rate</span>
                <Percent className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {sentimentOverview.accuracy}%
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">
                      +{sentimentOverview.accuracyChange}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Signals */}
            <div className="lg:col-span-2 bg-zinc-950/80 border border-white/10 rounded-xl">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Top Trading Signals</h2>
                    <p className="text-sm text-gray-400">
                      AI-powered recommendations based on sentiment analysis
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                      <Filter className="w-3 h-3 inline mr-1" />
                      Filter
                    </button>
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="1h">1 Hour</option>
                      <option value="24h">24 Hours</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {topSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center font-bold">
                          {signal.asset.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{signal.asset}</h3>
                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">
                              {signal.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{signal.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold">{signal.price}</div>
                        <div
                          className={`flex items-center gap-1 text-xs ${signal.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {signal.change >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {signal.change >= 0 ? "+" : ""}
                          {signal.change}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-lg border ${getSignalColor(signal.signal)}`}
                        >
                          {signal.signal}
                        </span>
                        <span
                          className={`text-xs font-medium ${getSentimentColor(signal.sentiment)}`}
                        >
                          {signal.sentiment}
                        </span>
                        <span className="text-xs text-gray-400">
                          {signal.sources} sources
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400">Confidence:</div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                              style={{ width: `${signal.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-cyan-400">
                            {signal.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10">
                <button className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  View All Signals →
                </button>
              </div>
            </div>

            {/* Trending Assets */}
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl">
              <div className="p-5 border-b border-white/10">
                <h2 className="text-lg font-bold">Trending Assets</h2>
                <p className="text-sm text-gray-400">
                  Most mentioned in last 24h
                </p>
              </div>

              <div className="p-5 space-y-4">
                {trendingAssets.map((asset, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-gray-500">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold">{asset.asset}</div>
                        <div className="text-xs text-gray-400">
                          {asset.mentions.toLocaleString()} mentions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${asset.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {asset.change >= 0 ? "+" : ""}
                        {asset.change}%
                      </div>
                      <div
                        className={`text-xs ${getSentimentColor(asset.sentiment)}`}
                      >
                        {asset.sentiment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent News & Performance */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent News */}
            <div className="lg:col-span-2 bg-zinc-950/80 border border-white/10 rounded-xl">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      Recent News & Analysis
                    </h2>
                    <p className="text-sm text-gray-400">
                      Latest market-moving news
                    </p>
                  </div>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                    View All →
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-5 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm group-hover:text-cyan-400 transition-colors flex-1">
                        {news.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getSentimentColor(news.sentiment)} bg-current bg-opacity-10`}
                      >
                        {news.sentiment}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${news.impact === "High" ? "text-red-400 bg-red-500/10" : "text-amber-400 bg-amber-500/10"}`}
                      >
                        {news.impact} Impact
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        {news.affectedAssets.map((asset, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-white/5 rounded font-mono"
                          >
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl">
              <div className="p-5 border-b border-white/10">
                <h2 className="text-lg font-bold">Performance</h2>
                <p className="text-sm text-gray-400">Your trading metrics</p>
              </div>

              <div className="p-5 space-y-4">
                {performanceMetrics.map((metric, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {metric.label}
                      </span>
                      <span
                        className={`text-xs ${metric.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {metric.change >= 0 ? "+" : ""}
                        {metric.change}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500">{metric.period}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
