"use client";

import Link from "next/link";
import {
  TrendingUp,
  LayoutDashboard,
  Target,
  Newspaper,
  BarChart3,
  Activity,
  Users,
  Zap,
  Settings,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePage?: string;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activePage = "dashboard",
}: SidebarProps) {
  const navItem = (
    href: string,
    label: string,
    icon: JSX.Element,
    key: string,
  ) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        activePage === key
          ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 text-cyan-400"
          : "hover:bg-white/5 text-gray-300 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-white/10 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={18} />
            </div>
            <span className="font-bold text-xl">Sentilyze</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItem(
              "/dashboard",
              "Dashboard",
              <LayoutDashboard />,
              "dashboard",
            )}
            {navItem("/Analysis", "Analysis", <Target />, "analysis")}
            {navItem("/news-feed", "News Feed", <Newspaper />, "news")}
            {navItem("/analytics", "Analytics", <BarChart3 />, "analytics")}
            {navItem("/watchlist", "Watchlist", <Activity />, "watchlist")}
            {navItem("/team", "Team", <Users />, "team")}
            {navItem("/settings", "Settings", <Settings />, "settings")}
          </nav>

          <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-2 rounded-lg">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
