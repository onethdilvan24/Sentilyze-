"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Bell,
  BellOff,
  Search,
  Filter,
  MoreVertical,
  Star,
  StarOff,
  ExternalLink,
  RefreshCw,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Target,
  Activity,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Folder,
  Edit2,
  Copy,
  Share2,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

type Signal = "BUY" | "SELL" | "HOLD";
type Sentiment = "Bullish" | "Bearish" | "Neutral";
type AssetType = "Stock" | "Crypto" | "Forex" | "Commodity";

interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  type: AssetType;
  price: string;
  priceChange: number;
  sentiment: Sentiment;
  sentimentScore: number;
  signal: Signal;
  confidence: number;
  volume: string;
  volumeChange: number;
  sources: number;
  lastUpdated: string;
  alertEnabled: boolean;
  isFavorite: boolean;
  group: string;
  sparklineData: number[];
}

interface WatchlistGroup {
  id: string;
  name: string;
  color: string;
}

export default function WatchlistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all");
  const [selectedSignal, setSelectedSignal] = useState<Signal | "all">("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("symbol");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");

  const groups: WatchlistGroup[] = [
    { id: "tech", name: "Tech Stocks", color: "cyan" },
    { id: "crypto", name: "Crypto", color: "purple" },
    { id: "forex", name: "Forex", color: "emerald" },
    { id: "high-priority", name: "High Priority", color: "amber" },
  ];

  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([
    {
      id: 1,
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      price: "$182.45",
      priceChange: 2.34,
      sentiment: "Bullish",
      sentimentScore: 87,
      signal: "BUY",
      confidence: 92.5,
      volume: "52.3M",
      volumeChange: 15.2,
      sources: 47,
      lastUpdated: "2 min ago",
      alertEnabled: true,
      isFavorite: true,
      group: "tech",
      sparklineData: [45, 52, 49, 63, 58, 72, 68, 75, 82, 78],
    },
    {
      id: 2,
      symbol: "BTC",
      name: "Bitcoin",
      type: "Crypto",
      price: "$43,250",
      priceChange: -1.25,
      sentiment: "Neutral",
      sentimentScore: 52,
      signal: "HOLD",
      confidence: 78.2,
      volume: "28.5B",
      volumeChange: -5.3,
      sources: 89,
      lastUpdated: "1 min ago",
      alertEnabled: true,
      isFavorite: true,
      group: "crypto",
      sparklineData: [72, 68, 75, 70, 65, 62, 58, 63, 60, 55],
    },
    {
      id: 3,
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "Stock",
      price: "$238.72",
      priceChange: -3.18,
      sentiment: "Bearish",
      sentimentScore: 32,
      signal: "SELL",
      confidence: 85.7,
      volume: "98.2M",
      volumeChange: 42.1,
      sources: 62,
      lastUpdated: "5 min ago",
      alertEnabled: false,
      isFavorite: false,
      group: "tech",
      sparklineData: [85, 82, 78, 72, 68, 62, 58, 52, 48, 45],
    },
    {
      id: 4,
      symbol: "EUR/USD",
      name: "Euro/US Dollar",
      type: "Forex",
      price: "1.0876",
      priceChange: 0.45,
      sentiment: "Bullish",
      sentimentScore: 71,
      signal: "BUY",
      confidence: 81.3,
      volume: "1.2T",
      volumeChange: 8.7,
      sources: 34,
      lastUpdated: "30 sec ago",
      alertEnabled: true,
      isFavorite: false,
      group: "forex",
      sparklineData: [42, 45, 48, 52, 55, 58, 62, 65, 68, 72],
    },
    {
      id: 5,
      symbol: "ETH",
      name: "Ethereum",
      type: "Crypto",
      price: "$2,285",
      priceChange: 4.52,
      sentiment: "Bullish",
      sentimentScore: 82,
      signal: "BUY",
      confidence: 88.4,
      volume: "12.8B",
      volumeChange: 22.3,
      sources: 76,
      lastUpdated: "1 min ago",
      alertEnabled: true,
      isFavorite: true,
      group: "crypto",
      sparklineData: [52, 55, 58, 62, 68, 72, 78, 82, 85, 88],
    },
    {
      id: 6,
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      type: "Stock",
      price: "$875.32",
      priceChange: 5.67,
      sentiment: "Bullish",
      sentimentScore: 91,
      signal: "BUY",
      confidence: 94.2,
      volume: "45.6M",
      volumeChange: 28.4,
      sources: 58,
      lastUpdated: "3 min ago",
      alertEnabled: true,
      isFavorite: true,
      group: "high-priority",
      sparklineData: [62, 68, 72, 78, 82, 85, 88, 92, 95, 98],
    },
    {
      id: 7,
      symbol: "GBP/USD",
      name: "British Pound/US Dollar",
      type: "Forex",
      price: "1.2654",
      priceChange: -0.32,
      sentiment: "Neutral",
      sentimentScore: 48,
      signal: "HOLD",
      confidence: 72.1,
      volume: "890B",
      volumeChange: -2.1,
      sources: 28,
      lastUpdated: "2 min ago",
      alertEnabled: false,
      isFavorite: false,
      group: "forex",
      sparklineData: [55, 52, 58, 54, 50, 52, 48, 50, 46, 48],
    },
    {
      id: 8,
      symbol: "SOL",
      name: "Solana",
      type: "Crypto",
      price: "$98.45",
      priceChange: 8.92,
      sentiment: "Bullish",
      sentimentScore: 88,
      signal: "BUY",
      confidence: 86.5,
      volume: "2.4B",
      volumeChange: 45.2,
      sources: 52,
      lastUpdated: "1 min ago",
      alertEnabled: true,
      isFavorite: false,
      group: "crypto",
      sparklineData: [45, 52, 58, 65, 72, 78, 82, 88, 92, 95],
    },
  ]);

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

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "Bullish":
        return "text-emerald-400";
      case "Bearish":
        return "text-red-400";
      case "Neutral":
        return "text-amber-400";
    }
  };

  const getTypeColor = (type: AssetType) => {
    switch (type) {
      case "Stock":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Crypto":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Forex":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Commodity":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  const toggleAlert = (id: number) => {
    setWatchlistItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item
      )
    );
  };

  const toggleFavorite = (id: number) => {
    setWatchlistItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setWatchlistItems((items) => items.filter((item) => item.id !== id));
  };

  const filteredItems = watchlistItems
    .filter((item) => {
      const matchesSearch =
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesSignal = selectedSignal === "all" || item.signal === selectedSignal;
      const matchesGroup = selectedGroup === "all" || item.group === selectedGroup;
      return matchesSearch && matchesType && matchesSignal && matchesGroup;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "priceChange":
          comparison = a.priceChange - b.priceChange;
          break;
        case "sentiment":
          comparison = a.sentimentScore - b.sentimentScore;
          break;
        case "confidence":
          comparison = a.confidence - b.confidence;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const stats = {
    total: watchlistItems.length,
    bullish: watchlistItems.filter((i) => i.sentiment === "Bullish").length,
    bearish: watchlistItems.filter((i) => i.sentiment === "Bearish").length,
    alertsActive: watchlistItems.filter((i) => i.alertEnabled).length,
  };

  const MiniSparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 24;
    const width = 60;
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? "#34d399" : "#f87171"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage="watchlist"
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
                <h1 className="text-2xl font-bold">Watchlist</h1>
                <p className="text-sm text-gray-400">
                  Track your favorite assets
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors">
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <Plus size={16} />
                Add Asset
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Activity size={14} />
                Total Assets
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <TrendingUp size={14} className="text-emerald-400" />
                Bullish
              </div>
              <div className="text-2xl font-bold text-emerald-400">{stats.bullish}</div>
            </div>
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <TrendingDown size={14} className="text-red-400" />
                Bearish
              </div>
              <div className="text-2xl font-bold text-red-400">{stats.bearish}</div>
            </div>
            <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Bell size={14} className="text-cyan-400" />
                Active Alerts
              </div>
              <div className="text-2xl font-bold text-cyan-400">{stats.alertsActive}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Group Filter */}
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="all">All Groups</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AssetType | "all")}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="all">All Types</option>
                <option value="Stock">Stocks</option>
                <option value="Crypto">Crypto</option>
                <option value="Forex">Forex</option>
                <option value="Commodity">Commodities</option>
              </select>

              {/* Signal Filter */}
              <select
                value={selectedSignal}
                onChange={(e) => setSelectedSignal(e.target.value as Signal | "all")}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="all">All Signals</option>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
                <option value="HOLD">Hold</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="symbol-asc">Symbol A-Z</option>
                <option value="symbol-desc">Symbol Z-A</option>
                <option value="priceChange-desc">Top Gainers</option>
                <option value="priceChange-asc">Top Losers</option>
                <option value="sentiment-desc">Highest Sentiment</option>
                <option value="confidence-desc">Highest Confidence</option>
              </select>
            </div>
          </div>

          {/* Watchlist Table */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm text-gray-400 font-medium">
              <div className="col-span-3">Asset</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Chart</div>
              <div className="col-span-2">Sentiment</div>
              <div className="col-span-2">Signal</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="lg:grid lg:grid-cols-12 gap-4 items-center">
                    {/* Asset Info */}
                    <div className="col-span-3 flex items-center gap-3 mb-3 lg:mb-0">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1 rounded transition-colors ${
                          item.isFavorite
                            ? "text-amber-400"
                            : "text-gray-500 hover:text-amber-400"
                        }`}
                      >
                        {item.isFavorite ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.symbol}</span>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">{item.name}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 mb-3 lg:mb-0">
                      <div className="font-semibold">{item.price}</div>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          item.priceChange >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {item.priceChange >= 0 ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        {item.priceChange >= 0 ? "+" : ""}
                        {item.priceChange.toFixed(2)}%
                      </div>
                    </div>

                    {/* Sparkline */}
                    <div className="col-span-1 hidden lg:block">
                      <MiniSparkline data={item.sparklineData} positive={item.priceChange >= 0} />
                    </div>

                    {/* Sentiment */}
                    <div className="col-span-2 mb-3 lg:mb-0">
                      <div className={`font-medium ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment}
                      </div>
                      <div className="text-sm text-gray-400">
                        Score: {item.sentimentScore}% • {item.sources} sources
                      </div>
                    </div>

                    {/* Signal */}
                    <div className="col-span-2 mb-3 lg:mb-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${getSignalColor(item.signal)}`}
                      >
                        {item.signal === "BUY" && <TrendingUp size={14} />}
                        {item.signal === "SELL" && <TrendingDown size={14} />}
                        {item.signal === "HOLD" && <Activity size={14} />}
                        {item.signal}
                      </span>
                      <div className="text-sm text-gray-400 mt-1">
                        {item.confidence}% confidence
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleAlert(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.alertEnabled
                            ? "text-cyan-400 bg-cyan-500/10"
                            : "text-gray-400 hover:text-cyan-400 hover:bg-white/5"
                        }`}
                        title={item.alertEnabled ? "Disable alerts" : "Enable alerts"}
                      >
                        {item.alertEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                      </button>
                      <button
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Analyze"
                      >
                        <Target size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="View details"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile: Last Updated */}
                  <div className="lg:hidden flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Clock size={12} />
                    Updated {item.lastUpdated}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto mb-3 text-gray-500" size={48} />
                <h3 className="text-lg font-semibold mb-1">No assets found</h3>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters or add new assets to your watchlist
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Add Asset to Watchlist</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Symbol or Name
                  </label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g., AAPL, BTC, EUR/USD"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Add to Group
                  </label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50">
                    <option value="">No group</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Add asset logic
                      setShowAddModal(false);
                      setNewSymbol("");
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    Add Asset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
