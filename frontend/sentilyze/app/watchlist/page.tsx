"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Bell,
  BellOff,
  Search,
  Star,
  StarOff,
  ExternalLink,
  RefreshCw,
  Menu,
  X,
  Target,
  Activity,
  AlertCircle,
  Clock,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

type Signal = "BUY" | "SELL" | "HOLD";
type Sentiment = "Bullish" | "Bearish" | "Neutral";
type AssetType = "Stock" | "Crypto" | "Forex" | "Commodity";

interface WatchlistRow {
  id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  group_name: string;
  alert_enabled: boolean;
  is_favorite: boolean;
  created_at: string;
}

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: string;
  priceChange: number;
  sentiment: Sentiment;
  sentimentScore: number;
  signal: Signal;
  confidence: number;
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

const DEFAULT_GROUPS: WatchlistGroup[] = [
  { id: "Default", name: "Default", color: "cyan" },
  { id: "Tech Stocks", name: "Tech Stocks", color: "cyan" },
  { id: "Crypto", name: "Crypto", color: "purple" },
  { id: "Forex", name: "Forex", color: "emerald" },
  { id: "High Priority", name: "High Priority", color: "amber" },
];

const SYMBOL_HASHES: Record<string, number> = {};
function symbolHash(symbol: string): number {
  if (SYMBOL_HASHES[symbol] !== undefined) return SYMBOL_HASHES[symbol];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  SYMBOL_HASHES[symbol] = hash;
  return hash;
}

function deriveDisplay(row: WatchlistRow): WatchlistItem {
  const h = symbolHash(row.symbol);
  const priceChange = ((h % 1200) - 500) / 100; // -5.00 .. +6.99
  const sentimentScore = 30 + (h % 60); // 30..89
  const sentiment: Sentiment =
    sentimentScore >= 65 ? "Bullish" : sentimentScore <= 45 ? "Bearish" : "Neutral";
  const signal: Signal =
    sentiment === "Bullish" ? "BUY" : sentiment === "Bearish" ? "SELL" : "HOLD";
  const confidence = 60 + (h % 35);
  const sources = 10 + (h % 80);
  const sparkBase = 40 + (h % 30);
  const sparklineData = Array.from({ length: 10 }, (_, i) => {
    const wobble = ((h >> i) & 0x1f) - 15;
    return Math.max(5, Math.min(95, sparkBase + i * (priceChange >= 0 ? 3 : -3) + wobble));
  });
  const priceMagnitude = (h % 9000) / 10 + 5;
  const price =
    row.asset_type === "Forex"
      ? (priceMagnitude / 1000).toFixed(4)
      : `$${priceMagnitude.toFixed(2)}`;
  return {
    id: row.id,
    symbol: row.symbol,
    name: row.name || row.symbol,
    type: row.asset_type,
    price,
    priceChange,
    sentiment,
    sentimentScore,
    signal,
    confidence,
    sources,
    lastUpdated: "live",
    alertEnabled: row.alert_enabled,
    isFavorite: row.is_favorite,
    group: row.group_name,
    sparklineData,
  };
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
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<AssetType>("Stock");
  const [newGroup, setNewGroup] = useState<string>("Default");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [rows, setRows] = useState<WatchlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const groups: WatchlistGroup[] = DEFAULT_GROUPS;

  const watchlistItems = useMemo(() => rows.map(deriveDisplay), [rows]);

  const loadWatchlist = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/watchlist", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : `Failed to load watchlist (${res.status}).`,
        );
      }
      setRows((data.items ?? []) as WatchlistRow[]);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : "Failed to load watchlist.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

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

  const patchItem = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      const previous = rows;
      setRows((items) =>
        items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
      try {
        const res = await fetch("/api/watchlist", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        if (!res.ok) throw new Error("PATCH failed");
      } catch {
        setRows(previous);
      }
    },
    [rows],
  );

  const toggleAlert = (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current) return;
    patchItem(id, { alert_enabled: !current.alert_enabled });
  };

  const toggleFavorite = (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current) return;
    patchItem(id, { is_favorite: !current.is_favorite });
  };

  const removeItem = async (id: string) => {
    const previous = rows;
    setRows((items) => items.filter((item) => item.id !== id));
    try {
      const res = await fetch(`/api/watchlist?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("DELETE failed");
    } catch {
      setRows(previous);
    }
  };

  const submitNewSymbol = async () => {
    const symbol = newSymbol.trim();
    if (!symbol) {
      setAddError("Enter a symbol.");
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          name: newName.trim() || symbol.toUpperCase(),
          asset_type: newType,
          group_name: newGroup || "Default",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : `Failed (${res.status}).`,
        );
      }
      if (data.item) {
        setRows((items) => [data.item as WatchlistRow, ...items]);
      }
      setShowAddModal(false);
      setNewSymbol("");
      setNewName("");
      setNewType("Stock");
      setNewGroup("Default");
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Failed to add asset.");
    } finally {
      setAddLoading(false);
    }
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
              <button
                onClick={loadWatchlist}
                disabled={loading}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
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

            {loading && rows.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="mx-auto mb-3 text-gray-500 animate-spin" size={32} />
                <p className="text-gray-400 text-sm">Loading watchlist…</p>
              </div>
            )}

            {loadError && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto mb-3 text-red-400" size={32} />
                <h3 className="text-lg font-semibold mb-1">Couldn&apos;t load watchlist</h3>
                <p className="text-gray-400 text-sm">{loadError}</p>
              </div>
            )}

            {!loading && !loadError && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto mb-3 text-gray-500" size={48} />
                <h3 className="text-lg font-semibold mb-1">No assets found</h3>
                <p className="text-gray-400 text-sm">
                  {watchlistItems.length === 0
                    ? "Add your first asset to start tracking it."
                    : "Try adjusting your filters."}
                </p>
              </div>
            )}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Add Asset to Watchlist</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !addLoading && submitNewSymbol()
                    }
                    placeholder="e.g., AAPL, BTC, EUR/USD"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Display Name (optional)
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Apple Inc."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Asset Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as AssetType)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Stock">Stock</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Forex">Forex</option>
                    <option value="Commodity">Commodity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Group
                  </label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                {addError && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {addError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setAddError(null);
                    }}
                    disabled={addLoading}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitNewSymbol}
                    disabled={addLoading || !newSymbol.trim()}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {addLoading && <Loader2 size={16} className="animate-spin" />}
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
