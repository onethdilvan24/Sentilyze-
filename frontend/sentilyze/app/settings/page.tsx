"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import {
  Menu,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  CreditCard,
  Loader2,
  Check,
} from "lucide-react";

interface NotificationPrefs {
  priceAlerts: boolean;
  sentiment: boolean;
  news: boolean;
  portfolio: boolean;
  team: boolean;
}

interface ProfileRow {
  id: string;
  clerk_user_id: string;
  email: string | null;
  display_name: string | null;
  default_timeframe: string;
  notifications_enabled: boolean;
  notification_prefs: NotificationPrefs;
  theme: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PREFS: NotificationPrefs = {
  priceAlerts: true,
  sentiment: true,
  news: true,
  portfolio: true,
  team: true,
};

const NOTIFICATION_FIELDS: Array<{ key: keyof NotificationPrefs; title: string; description: string }> = [
  { key: "priceAlerts", title: "Price Alerts", description: "Get notified when stock prices change" },
  { key: "sentiment", title: "Sentiment Changes", description: "Alert on major sentiment shifts" },
  { key: "news", title: "News Updates", description: "Breaking news for watchlist stocks" },
  { key: "portfolio", title: "Portfolio Updates", description: "Daily portfolio performance summary" },
  { key: "team", title: "Team Activity", description: "Notifications from team members" },
];

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [displayNameInput, setDisplayNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [savingPrefs, setSavingPrefs] = useState(false);

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/profile", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : `Failed (${res.status}).`,
        );
      }
      const p = data.profile as ProfileRow;
      setProfile({
        ...p,
        notification_prefs: { ...DEFAULT_PREFS, ...(p.notification_prefs ?? {}) },
      });
      setDisplayNameInput(p.display_name ?? "");
      setEmailInput(p.email ?? "");
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const patchProfile = useCallback(
    async (updates: Record<string, unknown>) => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : `Failed (${res.status}).`,
        );
      }
      const p = data.profile as ProfileRow;
      setProfile({
        ...p,
        notification_prefs: { ...DEFAULT_PREFS, ...(p.notification_prefs ?? {}) },
      });
      return p;
    },
    [],
  );

  const saveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setProfileSaved(false);
    setProfileError(null);
    try {
      await patchProfile({
        display_name: displayNameInput,
        email: emailInput,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleNotificationPref = async (key: keyof NotificationPrefs) => {
    if (!profile) return;
    const next: NotificationPrefs = {
      ...profile.notification_prefs,
      [key]: !profile.notification_prefs[key],
    };
    setProfile({ ...profile, notification_prefs: next });
    setSavingPrefs(true);
    try {
      await patchProfile({ notification_prefs: next });
    } catch (e) {
      console.warn("[settings] notification pref save failed", e);
      setProfile(profile);
    } finally {
      setSavingPrefs(false);
    }
  };

  const setTheme = async (theme: string) => {
    if (!profile) return;
    const previous = profile;
    setProfile({ ...profile, theme });
    try {
      await patchProfile({ theme });
    } catch {
      setProfile(previous);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
    { id: "data", label: "Data & Privacy", icon: <Database size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage="settings"
      />

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
          {/* Settings Sidebar */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 text-cyan-400"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === "profile" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Profile Settings</h2>

                {profileLoading && !profile ? (
                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 flex items-center gap-3 text-gray-400">
                    <Loader2 className="animate-spin" size={18} />
                    Loading profile…
                  </div>
                ) : profileError && !profile ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-300">
                    {profileError}
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {(displayNameInput || profile?.email || "U")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Avatar managed via Clerk profile.
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Default Timeframe
                        </label>
                        <select
                          value={profile?.default_timeframe ?? "7d"}
                          onChange={(e) =>
                            patchProfile({ default_timeframe: e.target.value }).catch(
                              () => {},
                            )
                          }
                          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                        >
                          <option value="1h">1 Hour</option>
                          <option value="24h">24 Hours</option>
                          <option value="7d">7 Days</option>
                          <option value="30d">30 Days</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={saveProfile}
                      disabled={savingProfile}
                      className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {savingProfile && <Loader2 size={16} className="animate-spin" />}
                      {profileSaved && !savingProfile && <Check size={16} />}
                      {savingProfile
                        ? "Saving…"
                        : profileSaved
                          ? "Saved"
                          : "Save Changes"}
                    </button>
                    {profileError && (
                      <p className="mt-3 text-sm text-red-400">{profileError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Notification Preferences</h2>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold">Master switch</p>
                      <p className="text-sm text-gray-400">
                        Turn off all notifications at once
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={profile?.notifications_enabled ?? true}
                        onChange={(e) =>
                          patchProfile({
                            notifications_enabled: e.target.checked,
                          }).catch(() => {})
                        }
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-600"></div>
                    </label>
                  </div>

                  {NOTIFICATION_FIELDS.map((field) => {
                    const enabled = profile?.notification_prefs[field.key] ?? true;
                    return (
                      <div
                        key={field.key}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{field.title}</p>
                          <p className="text-sm text-gray-400">{field.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={enabled}
                            disabled={!profile}
                            onChange={() => toggleNotificationPref(field.key)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-600"></div>
                        </label>
                      </div>
                    );
                  })}
                  {savingPrefs && (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> Saving…
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Security Settings</h2>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Change Password</h3>
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                      />
                      <button className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold">Enable 2FA</p>
                        <p className="text-sm text-gray-400">
                          Add an extra layer of security
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      {[
                        {
                          device: "MacBook Pro",
                          location: "New York, US",
                          current: true,
                        },
                        { device: "iPhone 14", location: "New York, US" },
                        { device: "iPad Air", location: "Boston, US" },
                      ].map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">
                              {session.device}
                              {session.current && (
                                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">
                              {session.location}
                            </p>
                          </div>
                          {!session.current && (
                            <button className="text-red-400 hover:text-red-300">
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Appearance</h2>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {(["dark", "light", "auto"] as const).map((theme) => {
                        const active = (profile?.theme ?? "dark") === theme;
                        return (
                          <button
                            key={theme}
                            onClick={() => setTheme(theme)}
                            disabled={!profile}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              active
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-white/10 hover:border-white/30"
                            }`}
                          >
                            <div className="text-center">
                              <p className="font-semibold capitalize">{theme}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Light/Auto themes are saved to your profile but the UI currently
                      always renders in dark mode.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-4">Accent Color</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        "bg-cyan-500",
                        "bg-purple-500",
                        "bg-green-500",
                        "bg-orange-500",
                        "bg-pink-500",
                      ].map((color, index) => (
                        <button
                          key={index}
                          className={`w-12 h-12 ${color} rounded-lg ${
                            index === 0
                              ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Data & Privacy</h2>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-semibold mb-2">Export Data</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Download all your data in JSON format
                    </p>
                    <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      Export Data
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-semibold mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Permanently delete your account and all data
                    </p>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Billing</h2>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Free Plan</h3>
                      <p className="text-gray-400">Current Plan</p>
                    </div>
                    <button className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                      Upgrade to Pro
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-4">Payment Method</h3>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-gray-400">No payment method added</p>
                      <button className="mt-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
