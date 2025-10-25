"use client";
import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/EmptyState";

type Channel = { id: string; provider: string; displayName: string; lastSyncedAt?: string };
type PlanData = { plan: any; usage: any; channelCount: number; channelLimit: number };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

const PLATFORMS = [
  { id: "youtube", name: "YouTube", color: "#FF0000" },
  { id: "spotify", name: "Spotify", color: "#1DB954" },
  { id: "applemusic", name: "Apple Music", color: "#FC3C44" },
  { id: "deezer", name: "Deezer", color: "#FF6700" },
  { id: "soundcloud", name: "SoundCloud", color: "#FF5500" },
  { id: "tunein", name: "TuneIn", color: "#14D8CC" },
  { id: "amazonmusic", name: "Amazon Music", color: "#00A8E1" },
  { id: "iheartradio", name: "iHeartRadio", color: "#C6002B" },
  { id: "audiomack", name: "Audiomack", color: "#FFA200" },
  { id: "podchaser", name: "Podchaser", color: "#5C68E2" },
];

export default function ChannelsPage() {
  const { data: channels, isLoading, error, mutate } = useSWR<Channel[]>("/api/v1/channels", fetcher);
  const { data: planData } = useSWR<PlanData>("/api/v1/billing/plan", fetcher);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const connectedProviders = new Set((channels || []).map((c) => c.provider.toLowerCase()));

  async function handleSyncAll() {
    setBusy(true);
    try {
      await api.post("/api/v1/channels/refresh-all", {});
      mutate();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to sync");
    } finally {
      setBusy(false);
    }
  }

  async function handleConnect(provider: string, channelId: string, displayName: string) {
    if (planData && planData.channelCount >= planData.channelLimit) {
      setShowLimitModal(true);
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/v1/channels/connect", { provider, providerChannelId: channelId, displayName });
      mutate();
      setShowAddModal(false);
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to connect");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect(id: string) {
    if (!confirm("Disconnect this channel?")) return;
    setBusy(true);
    try {
      await api.delete(`/api/v1/channels/${id}`);
      mutate();
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh(id: string) {
    setBusy(true);
    try {
      await api.post(`/api/v1/channels/${id}/refresh`, {});
      mutate();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Connected Platforms
            </h1>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              {planData ? `${planData.channelCount} / ${planData.channelLimit} platforms connected` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={busy}
              onClick={handleSyncAll}
              className="rounded-lg bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
            >
              Sync All
            </button>
            <button
              onClick={() => {
                if (planData && planData.channelCount >= planData.channelLimit) {
                  setShowLimitModal(true);
                } else {
                  setShowAddModal(true);
                }
              }}
              className="rounded-lg px-4 py-2 text-sm font-bold text-white hover:brightness-95"
              style={{ backgroundColor: "#2D89FF" }}
            >
              + Add Platform
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        )}
        {error && <div className="text-sm text-red-600 dark:text-red-400">Failed to load channels</div>}
        {!isLoading && !error && (
          <>
            {(channels || []).length === 0 && (
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-8">
                <EmptyState
                  icon="🎧"
                  title="No Channels Connected Yet"
                  description="Connect your first platform to start distributing your content globally. Choose from YouTube, Spotify, Apple Music, and more!"
                  actionLabel="Connect Your First Channel"
                  onAction={() => setShowAddModal(true)}
                />
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PLATFORMS.map((platform, idx) => {
              const connected = connectedProviders.has(platform.id.toLowerCase());
              const channel = (channels || []).find((c) => c.provider.toLowerCase() === platform.id.toLowerCase());
              return (
                <div
                  key={platform.id}
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-5 shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name.charAt(0)}
                    </div>
                    {connected ? (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        ✅ Connected
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        ❌ Not Connected
                      </span>
                    )}
                  </div>
                  <div className="text-base font-semibold mb-1 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {platform.name}
                  </div>
                  {connected && channel && (
                    <>
                      <div className="text-sm text-black/60 dark:text-white/60 mb-2">{channel.displayName}</div>
                      {channel.lastSyncedAt && (
                        <div className="text-xs text-black/50 dark:text-white/50 mb-3">
                          Synced: {new Date(channel.lastSyncedAt).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() => handleRefresh(channel.id)}
                          className="flex-1 text-xs px-2 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
                        >
                          Refresh
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => handleDisconnect(channel.id)}
                          className="flex-1 text-xs px-2 py-1.5 rounded-md border border-red-200 dark:border-red-400/40 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                        >
                          Disconnect
                        </button>
                      </div>
                    </>
                  )}
                  {!connected && (
                    <button
                      disabled={busy}
                      onClick={() => setShowAddModal(true)}
                      className="w-full mt-3 text-xs px-3 py-2 rounded-md font-medium text-white hover:brightness-95 disabled:opacity-50"
                      style={{ backgroundColor: "#FFB400" }}
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
            </div>
          </>
        )}
      </div>

      {/* Add Platform Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-black/10 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Connect a Platform
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                handleConnect(
                  String(fd.get("provider")),
                  String(fd.get("channelId")),
                  String(fd.get("displayName"))
                );
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white/80">Platform</label>
                <select name="provider" required className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-3 py-2">
                  <option value="">— Select Platform —</option>
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white/80">Channel URL / ID</label>
                <input
                  name="channelId"
                  type="text"
                  placeholder="e.g. UCxxxxxx or channel link"
                  required
                  className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white/80">Display Name (optional)</label>
                <input
                  name="displayName"
                  type="text"
                  placeholder="My Channel"
                  className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-3 py-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-black/20 dark:border-white/20 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-50"
                  style={{ backgroundColor: "#2D89FF" }}
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLimitModal(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-black/10 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Channel Limit Reached
            </h2>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">
              You've reached your connection limit ({planData?.channelCount} of {planData?.channelLimit}). Upgrade to
              unlock more channels.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="flex-1 rounded-lg border border-black/20 dark:border-white/20 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                Close
              </button>
              <button
                onClick={() => (window.location.href = "/monetization")}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-white hover:brightness-95"
                style={{ backgroundColor: "#4CAF50" }}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
