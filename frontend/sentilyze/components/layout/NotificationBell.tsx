"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Bell, Loader2, Target, Newspaper } from "lucide-react";
import {
  type AnalysisForNotifications,
  type NotificationItem,
  buildNotificationsFromAnalyses,
  countUnread,
  getLastSeenAt,
  relativeTime,
  setLastSeenAt,
} from "@/lib/notifications";

const TYPE_ICONS = {
  analysis_complete: Target,
  high_impact_news: Newspaper,
} as const;

export default function NotificationBell() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastSeenAt, setLastSeenAtState] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = countUnread(notifications, lastSeenAt);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyses?limit=20", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotifications(
          buildNotificationsFromAnalyses(
            (data.analyses ?? []) as AnalysisForNotifications[],
          ),
        );
      }
    } catch (e) {
      console.warn("[NotificationBell] fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    setLastSeenAtState(getLastSeenAt(userId));
    void fetchNotifications();
  }, [isLoaded, userId, fetchNotifications]);

  useEffect(() => {
    if (open && userId) {
      void fetchNotifications();
    }
  }, [open, userId, fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const markAllRead = useCallback(() => {
    if (!userId) return;
    const now = Date.now();
    setLastSeenAt(userId, now);
    setLastSeenAtState(now);
  }, [userId]);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && userId) {
        markAllRead();
      }
      return next;
    });
  };

  const handleItemClick = (item: NotificationItem) => {
    setOpen(false);
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 bg-zinc-950 border border-white/10 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-sm text-gray-400 text-center">
                No notifications yet. Run an analysis to see updates here.
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {notifications.map((item) => {
                  const Icon = TYPE_ICONS[item.type];
                  const isUnread =
                    new Date(item.timestamp).getTime() > lastSeenAt;

                  const rowContent = (
                    <>
                      <div
                        className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === "analysis_complete"
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {relativeTime(item.timestamp)}
                        </p>
                      </div>
                      {isUnread && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                      )}
                    </>
                  );

                  if (item.external) {
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          {rowContent}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        {rowContent}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-4 py-3 border-t border-white/10">
            <Link
              href="/Analysis"
              onClick={() => setOpen(false)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View Analysis →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
