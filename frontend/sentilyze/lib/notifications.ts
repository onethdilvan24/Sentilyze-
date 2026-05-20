export type NotificationType = "analysis_complete" | "high_impact_news";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  timestamp: string;
  href: string;
  symbol?: string;
  external?: boolean;
}

export interface AnalysisForNotifications {
  id: string;
  symbol: string;
  overall_sentiment: string;
  signal: string;
  confidence: number;
  created_at: string;
  analysis_news_items?: Array<{
    id: string;
    title: string;
    impact_score: number;
    url: string;
    published_at: string;
  }>;
}

const MAX_NOTIFICATIONS = 12;
const HIGH_IMPACT_THRESHOLD = 7;
const LAST_SEEN_PREFIX = "sentilyze_notifications_last_seen_";

export function relativeTime(iso: string): string {
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

export function buildNotificationsFromAnalyses(
  analyses: AnalysisForNotifications[],
): NotificationItem[] {
  const items: NotificationItem[] = [];
  const seen = new Set<string>();

  for (const analysis of analyses) {
    const analysisId = `analysis-${analysis.id}`;
    if (!seen.has(analysisId)) {
      seen.add(analysisId);
      items.push({
        id: analysisId,
        type: "analysis_complete",
        title: `${analysis.symbol} — ${analysis.overall_sentiment}`,
        detail: `${analysis.signal} · ${analysis.confidence}% confidence`,
        timestamp: analysis.created_at,
        href: `/Analysis?symbol=${encodeURIComponent(analysis.symbol)}`,
        symbol: analysis.symbol,
      });
    }

    for (const news of analysis.analysis_news_items ?? []) {
      if ((news.impact_score ?? 0) < HIGH_IMPACT_THRESHOLD) continue;
      const newsId = `news-${news.id}`;
      if (seen.has(newsId)) continue;
      seen.add(newsId);

      const truncated =
        news.title.length > 60 ? `${news.title.slice(0, 57)}…` : news.title;

      items.push({
        id: newsId,
        type: "high_impact_news",
        title: `High-impact news for ${analysis.symbol}`,
        detail: `"${truncated}"`,
        timestamp: news.published_at,
        href: news.url,
        symbol: analysis.symbol,
        external: true,
      });
    }
  }

  return items
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, MAX_NOTIFICATIONS);
}

export function getLastSeenKey(userId: string): string {
  return `${LAST_SEEN_PREFIX}${userId}`;
}

export function getLastSeenAt(userId: string | undefined): number {
  if (!userId || typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(getLastSeenKey(userId));
    if (!raw) return 0;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

export function setLastSeenAt(userId: string | undefined, at: number = Date.now()): void {
  if (!userId || typeof window === "undefined") return;
  try {
    localStorage.setItem(getLastSeenKey(userId), String(at));
  } catch {
    // ignore quota / private mode
  }
}

export function countUnread(
  notifications: NotificationItem[],
  lastSeenAt: number,
): number {
  return notifications.filter(
    (n) => new Date(n.timestamp).getTime() > lastSeenAt,
  ).length;
}
