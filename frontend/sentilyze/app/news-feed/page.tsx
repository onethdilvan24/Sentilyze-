"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Bookmark,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Menu,
  X,
  Newspaper,
  Twitter,
  Globe,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

type Sentiment = "Bullish" | "Bearish" | "Neutral";
type Source = "News" | "Twitter" | "Reddit" | "Telegram";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: Source;
  sourceName: string;
  sentiment: Sentiment;
  sentimentScore: number;
  relatedAssets: string[];
  timestamp: string;
  url: string;
  imageUrl?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  isBookmarked: boolean;
}

export default function NewsFeedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | "all">("all");
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Apple Reports Record Q1 Earnings, Beats Wall Street Expectations",
      summary:
        "Apple Inc. reported quarterly revenue of $119.6 billion, beating analyst expectations of $117.9 billion. iPhone sales remained strong despite global economic headwinds, with services revenue hitting an all-time high.",
      source: "News",
      sourceName: "Bloomberg",
      sentiment: "Bullish",
      sentimentScore: 87,
      relatedAssets: ["AAPL", "NASDAQ"],
      timestamp: "15 min ago",
      url: "#",
      engagement: { likes: 1243, comments: 89, shares: 234 },
      isBookmarked: false,
    },
    {
      id: 2,
      title: "Bitcoin Whale Moves $500M to Unknown Wallet - Market Watches Closely",
      summary:
        "A large Bitcoin holder has transferred approximately 12,000 BTC worth over $500 million to an unknown wallet address. Analysts are divided on whether this signals upcoming selling pressure or institutional accumulation.",
      source: "Twitter",
      sourceName: "@WhaleAlert",
      sentiment: "Neutral",
      sentimentScore: 52,
      relatedAssets: ["BTC", "ETH"],
      timestamp: "32 min ago",
      url: "#",
      engagement: { likes: 3421, comments: 567, shares: 892 },
      isBookmarked: true,
    },
    {
      id: 3,
      title: "Tesla Faces Production Challenges at Berlin Gigafactory",
      summary:
        "Tesla's Berlin Gigafactory is experiencing production delays due to supply chain issues and regulatory hurdles. The company has reduced its Q2 delivery guidance, causing concern among investors.",
      source: "News",
      sourceName: "Reuters",
      sentiment: "Bearish",
      sentimentScore: 28,
      relatedAssets: ["TSLA"],
      timestamp: "1 hour ago",
      url: "#",
      engagement: { likes: 876, comments: 234, shares: 156 },
      isBookmarked: false,
    },
    {
      id: 4,
      title: "Federal Reserve Signals Potential Rate Cut in September",
      summary:
        "Fed Chair Jerome Powell hinted at a possible interest rate cut in the upcoming September meeting, citing cooling inflation and stable employment figures. Markets rallied on the news.",
      source: "News",
      sourceName: "CNBC",
      sentiment: "Bullish",
      sentimentScore: 79,
      relatedAssets: ["SPY", "DXY", "GLD"],
      timestamp: "2 hours ago",
      url: "#",
      engagement: { likes: 2156, comments: 312, shares: 445 },
      isBookmarked: false,
    },
    {
      id: 5,
      title: "Ethereum Layer 2 Solutions See Record TVL Growth",
      summary:
        "Total Value Locked in Ethereum Layer 2 solutions has reached an all-time high of $45 billion, with Arbitrum and Optimism leading the charge. Gas fees on mainnet have dropped significantly as a result.",
      source: "Reddit",
      sourceName: "r/ethereum",
      sentiment: "Bullish",
      sentimentScore: 82,
      relatedAssets: ["ETH", "ARB", "OP"],
      timestamp: "3 hours ago",
      url: "#",
      engagement: { likes: 4532, comments: 678, shares: 321 },
      isBookmarked: true,
    },
    {
      id: 6,
      title: "NVIDIA Stock Drops 5% on China Export Restriction Concerns",
      summary:
        "NVIDIA shares fell sharply after reports emerged of potential new U.S. restrictions on AI chip exports to China. The company derives approximately 20% of its revenue from the Chinese market.",
      source: "News",
      sourceName: "Wall Street Journal",
      sentiment: "Bearish",
      sentimentScore: 31,
      relatedAssets: ["NVDA", "AMD", "INTC"],
      timestamp: "4 hours ago",
      url: "#",
      engagement: { likes: 1876, comments: 423, shares: 287 },
      isBookmarked: false,
    },
    {
      id: 7,
      title: "Solana Network Processes Record 65,000 TPS During NFT Mint",
      summary:
        "The Solana blockchain achieved a new transaction throughput record during a popular NFT collection mint, processing over 65,000 transactions per second without network degradation.",
      source: "Twitter",
      sourceName: "@solaboratory",
      sentiment: "Bullish",
      sentimentScore: 88,
      relatedAssets: ["SOL"],
      timestamp: "5 hours ago",
      url: "#",
      engagement: { likes: 5678, comments: 432, shares: 765 },
      isBookmarked: false,
    },
    {
      id: 8,
      title: "Oil Prices Surge Amid Middle East Tensions",
      summary:
        "Crude oil prices jumped 4% as geopolitical tensions in the Middle East escalated. Brent crude topped $85 per barrel, with analysts warning of potential supply disruptions.",
      source: "News",
      sourceName: "Financial Times",
      sentiment: "Neutral",
      sentimentScore: 55,
      relatedAssets: ["CL", "XOM", "CVX"],
      timestamp: "6 hours ago",
      url: "#",
      engagement: { likes: 987, comments: 156, shares: 198 },
      isBookmarked: false,
    },
  ];

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

  const getSourceIcon = (source: Source) => {
    switch (source) {
      case "News":
        return <Newspaper size={14} />;
      case "Twitter":
        return <Twitter size={14} />;
      case "Reddit":
        return <MessageSquare size={14} />;
      case "Telegram":
        return <Globe size={14} />;
    }
  };

  const filteredNews = newsItems.filter((item) => {
    const matchesSource = selectedSource === "all" || item.source === selectedSource;
    const matchesSentiment = selectedSentiment === "all" || item.sentiment === selectedSentiment;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedAssets.some((asset) =>
        asset.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center gap-2">
              <RefreshCw size={16} />
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
                  onChange={(e) => setSelectedSource(e.target.value as Source | "all")}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="all">All Sources</option>
                  <option value="News">News</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Reddit">Reddit</option>
                  <option value="Telegram">Telegram</option>
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
                        {getSourceIcon(item.source)}
                        {item.sourceName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
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

                  {/* Title & Summary */}
                  <h3 className="text-lg font-semibold mb-2 hover:text-cyan-400 transition-colors cursor-pointer">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {item.summary}
                  </p>

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
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                        <ThumbsUp size={16} />
                        {item.engagement.likes.toLocaleString()}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                        <MessageSquare size={16} />
                        {item.engagement.comments}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                        <Share2 size={16} />
                        {item.engagement.shares}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          item.isBookmarked
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-gray-400 hover:text-amber-400 hover:bg-white/5"
                        }`}
                      >
                        <Bookmark size={16} fill={item.isBookmarked ? "currentColor" : "none"} />
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors text-sm">
                        <ExternalLink size={14} />
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNews.length === 0 && (
              <div className="text-center py-12 bg-zinc-950/80 border border-white/10 rounded-xl">
                <Newspaper className="mx-auto mb-3 text-gray-500" size={48} />
                <h3 className="text-lg font-semibold mb-1">No news found</h3>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
