"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import {
  Menu,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  CreditCard,
} from "lucide-react";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                      JD
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Portfolio manager with 10+ years experience in quantitative trading."
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <button className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold">Notification Preferences</h2>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-4">
                  {[
                    {
                      title: "Price Alerts",
                      description: "Get notified when stock prices change",
                    },
                    {
                      title: "Sentiment Changes",
                      description: "Alert on major sentiment shifts",
                    },
                    {
                      title: "News Updates",
                      description: "Breaking news for watchlist stocks",
                    },
                    {
                      title: "Portfolio Updates",
                      description: "Daily portfolio performance summary",
                    },
                    {
                      title: "Team Activity",
                      description: "Notifications from team members",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-600"></div>
                      </label>
                    </div>
                  ))}
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
                      {["Dark", "Light", "Auto"].map((theme) => (
                        <button
                          key={theme}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            theme === "Dark"
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="text-center">
                            <p className="font-semibold">{theme}</p>
                          </div>
                        </button>
                      ))}
                    </div>
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
