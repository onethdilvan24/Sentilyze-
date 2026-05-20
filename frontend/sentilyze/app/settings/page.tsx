"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Menu, Loader2, Check } from "lucide-react";

interface ProfileRow {
  id: string;
  clerk_user_id: string;
  email: string | null;
  display_name: string | null;
  default_timeframe: string;
  created_at: string;
  updated_at: string;
}

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [displayNameInput, setDisplayNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

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
      setProfile(p);
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
      setProfile(p);
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

        <div className="p-6 overflow-auto">
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
        </div>
      </main>
    </div>
  );
}
