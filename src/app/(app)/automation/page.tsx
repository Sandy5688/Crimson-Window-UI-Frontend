"use client";
import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getBotStatus,
  getAutomationStats,
  getPostQueue,
  getActivityLogs,
  runBot,
  pauseBot,
  resumeBot,
  restartAllBots,
  retryFailedPosts,
  checkHealth,
  getSettings,
  saveSettings,
  BotStatus,
  AutomationStats,
  ScheduledPost,
  ActivityLog,
} from "@/lib/automation-api";

// Platform icons/colors
const platformConfig: Record<string, { color: string; icon: string; label: string }> = {
  twitter: { color: "#1DA1F2", icon: "𝕏", label: "Twitter / X" },
  instagram: { color: "#E4405F", icon: "📸", label: "Instagram" },
  facebook: { color: "#1877F2", icon: "📘", label: "Facebook" },
  linkedin: { color: "#0A66C2", icon: "💼", label: "LinkedIn" },
  tiktok: { color: "#000000", icon: "🎵", label: "TikTok" },
  pinterest: { color: "#E60023", icon: "📌", label: "Pinterest" },
  reddit: { color: "#FF4500", icon: "🔴", label: "Reddit" },
  telegram: { color: "#0088CC", icon: "✈️", label: "Telegram" },
  discord: { color: "#5865F2", icon: "🎮", label: "Discord" },
  quora: { color: "#B92B27", icon: "❓", label: "Quora" },
  snapchat: { color: "#FFFC00", icon: "👻", label: "Snapchat" },
  gmb: { color: "#4285F4", icon: "📍", label: "Google My Business" },
};

// Credential fields per platform
const platformFields: Record<string, { key: string; label: string; type: string; placeholder: string }[]> = {
  twitter: [
    { key: "apiKey", label: "API Key (Consumer Key)", type: "password", placeholder: "Enter Twitter API Key" },
    { key: "apiSecret", label: "API Secret", type: "password", placeholder: "Enter Twitter API Secret" },
    { key: "accessToken", label: "Access Token", type: "password", placeholder: "Enter Access Token" },
    { key: "accessTokenSecret", label: "Access Token Secret", type: "password", placeholder: "Enter Access Token Secret" },
  ],
  instagram: [
    { key: "username", label: "Username / Email", type: "text", placeholder: "your@email.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ],
  facebook: [
    { key: "email", label: "Email", type: "text", placeholder: "your@email.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
    { key: "pageId", label: "Page ID", type: "text", placeholder: "Facebook Page ID (optional)" },
  ],
  linkedin: [
    { key: "email", label: "Email", type: "text", placeholder: "your@email.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ],
  tiktok: [
    { key: "username", label: "Username", type: "text", placeholder: "@yourhandle" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ],
  pinterest: [
    { key: "email", label: "Email", type: "text", placeholder: "your@email.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ],
  reddit: [
    { key: "username", label: "Username", type: "text", placeholder: "u/yourname" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
    { key: "clientId", label: "Client ID", type: "text", placeholder: "Reddit App Client ID" },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "Reddit App Client Secret" },
  ],
  telegram: [
    { key: "botToken", label: "Bot Token", type: "password", placeholder: "Telegram bot token from @BotFather" },
    { key: "chatId", label: "Chat ID", type: "text", placeholder: "Channel or group chat ID" },
  ],
  discord: [
    { key: "botToken", label: "Bot Token", type: "password", placeholder: "Discord bot token" },
    { key: "channelId", label: "Channel ID", type: "text", placeholder: "Discord channel ID" },
  ],
  quora: [
    { key: "email", label: "Email", type: "text", placeholder: "your@email.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ],
  snapchat: [
    { key: "username", label: "Username", type: "text", placeholder: "@yourhandle" },
    { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ],
  gmb: [
    { key: "email", label: "Google Email", type: "text", placeholder: "your@gmail.com" },
    { key: "locationId", label: "Location ID", type: "text", placeholder: "Google Business Location ID" },
  ],
};

const statusColors: Record<string, string> = {
  running: "bg-green-500",
  paused: "bg-yellow-500",
  stopped: "bg-gray-500",
  error: "bg-red-500",
  pending: "bg-blue-500",
  published: "bg-green-500",
  failed: "bg-red-500",
  success: "bg-green-500",
  info: "bg-blue-500",
};

type SocialAccounts = Record<string, Record<string, string>>;

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "social-accounts">("dashboard");
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Social accounts state
  const [socialAccounts, setSocialAccounts] = useState<SocialAccounts>({});
  const [socialLoading, setSocialLoading] = useState(true);
  const [connectModal, setConnectModal] = useState<{ platform: string } | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Fetch data with SWR
  const { data: stats, isLoading: statsLoading, mutate: mutateStats } = useSWR<AutomationStats>(
    "automation-stats",
    () => getAutomationStats().catch(() => null) as Promise<AutomationStats>,
    { refreshInterval: 30000 }
  );

  const { data: bots, isLoading: botsLoading, mutate: mutateBots } = useSWR<BotStatus[]>(
    "bot-status",
    () => getBotStatus().catch(() => []),
    { refreshInterval: 10000 }
  );

  const { data: queue, isLoading: queueLoading, mutate: mutateQueue } = useSWR<ScheduledPost[]>(
    "post-queue",
    () => getPostQueue().catch(() => []),
    { refreshInterval: 15000 }
  );

  const { data: activity, isLoading: activityLoading } = useSWR<ActivityLog[]>(
    "activity-logs",
    () => getActivityLogs(20).catch(() => []),
    { refreshInterval: 30000 }
  );

  // Health check on mount
  useEffect(() => {
    checkHealth()
      .then(() => setIsHealthy(true))
      .catch(() => setIsHealthy(false));
  }, []);

  // Load social accounts from settings
  useEffect(() => {
    setSocialLoading(true);
    getSettings()
      .then((s: Record<string, unknown>) => {
        setSocialAccounts((s.socialAccounts as SocialAccounts) || {});
      })
      .catch(() => setSocialAccounts({}))
      .finally(() => setSocialLoading(false));
  }, []);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ── Bot actions ─────────────────────────────────────────────────────────────
  const handleBotAction = async (action: "run" | "pause" | "resume", botName: string) => {
    setActionLoading(`${action}-${botName}`);
    try {
      let result;
      if (action === "run") result = await runBot(botName);
      else if (action === "pause") result = await pauseBot(botName);
      else result = await resumeBot(botName);
      showNotification(result.success ? "success" : "error", result.message || `Bot ${action} ${result.success ? "successful" : "failed"}`);
      mutateBots();
    } catch (err) {
      showNotification("error", `Failed to ${action} bot: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestartAll = async () => {
    setActionLoading("restart-all");
    try {
      const result = await restartAllBots();
      showNotification(result.success ? "success" : "error", result.message || "All bots restarted");
      mutateBots();
      mutateStats();
    } catch (err) {
      showNotification("error", `Failed to restart bots: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetryFailed = async () => {
    setActionLoading("retry-failed");
    try {
      const result = await retryFailedPosts();
      showNotification("success", `Retried ${result.retriedCount} failed posts`);
      mutateQueue();
    } catch (err) {
      showNotification("error", `Failed to retry posts: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Social account actions ───────────────────────────────────────────────────
  function openConnectModal(platform: string) {
    const existing = socialAccounts[platform] || {};
    setFormValues(existing);
    setAccountError(null);
    setConnectModal({ platform });
  }

  // CR-3: Validate social account credentials before saving
  function validateAccountFields(platform: string, values: Record<string, string>): string | null {
    const fields = platformFields[platform] || [];
    for (const field of fields) {
      const val = (values[field.key] || "").trim();
      // Skip optional fields (pageId, locationId etc.)
      if (field.placeholder?.includes("optional")) continue;
      if (!val) return `${field.label} is required.`;
      // Email format check
      if (field.type === "text" && field.label.toLowerCase().includes("email") && !field.label.toLowerCase().includes("username")) {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) return `${field.label} must be a valid email address.`;
      }
      // Minimum password length
      if (field.type === "password" && field.key === "password" && val.length < 6) {
        return "Password must be at least 6 characters.";
      }
    }
    return null;
  }

  async function handleSaveAccount() {
    if (!connectModal) return;
    // CR-3: Validate before attempting to save
    const validationMsg = validateAccountFields(connectModal.platform, formValues);
    if (validationMsg) {
      setAccountError(validationMsg);
      return;
    }
    setAccountError(null);
    setSavingAccount(true);
    try {
      const updated: SocialAccounts = {
        ...socialAccounts,
        [connectModal.platform]: formValues,
      };
      // CR-3: Add timeout so we don't hang forever if automation service is unreachable
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      );
      await Promise.race([saveSettings({ socialAccounts: updated }), timeoutPromise]);
      setSocialAccounts(updated);
      setConnectModal(null);
      showNotification("success", `${platformConfig[connectModal.platform]?.label} account saved!`);
    } catch (err: any) {
      if (err?.message === "timeout") {
        setAccountError("Automation service is unreachable. Please check the service is running and try again.");
      } else {
        setAccountError("Failed to save account. Please try again.");
      }
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleDisconnect(platform: string) {
    if (!confirm(`Disconnect your ${platformConfig[platform]?.label} account?`)) return;
    try {
      const updated: SocialAccounts = { ...socialAccounts };
      delete updated[platform];
      await saveSettings({ socialAccounts: updated });
      setSocialAccounts(updated);
      showNotification("success", `${platformConfig[platform]?.label} disconnected`);
    } catch {
      showNotification("error", "Failed to disconnect account");
    }
  }

  const platforms = Object.keys(platformConfig);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header Banner */}
      <div
        className="bg-gradient-to-br from-purple-600 to-pink-500 dark:from-purple-700 dark:to-pink-600 rounded-2xl p-6 sm:p-8 shadow-xl"
        data-aos="fade-down"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🤖 Social Media Automation
            </h1>
            <p className="text-white/90 text-base sm:text-lg">
              Manage your automated posting bots across all platforms
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium self-start sm:self-auto ${isHealthy === null
              ? "bg-gray-500/30 text-white"
              : isHealthy
                ? "bg-green-500/30 text-green-100"
                : "bg-red-500/30 text-red-100"
              }`}
          >
            <span className={`w-2 h-2 rounded-full ${isHealthy === null ? "bg-gray-400" : isHealthy ? "bg-green-400" : "bg-red-400"}`} />
            {isHealthy === null ? "Checking..." : isHealthy ? "Service Online" : "Service Offline"}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "dashboard"
            ? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("social-accounts")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "social-accounts"
            ? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
        >
          🔗 Social Accounts
          {Object.keys(socialAccounts).length > 0 && (
            <span className="bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {Object.keys(socialAccounts).length}
            </span>
          )}
        </button>
      </div>

      {/* ── TAB: Social Accounts ─────────────────────────────────────────────── */}
      {activeTab === "social-accounts" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold dark:text-white mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🔗 Connect Your Social Accounts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add your credentials so the automation bots can post on your behalf.
            </p>
          </div>

          {socialLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-36" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {platforms.map((platform) => {
                const cfg = platformConfig[platform];
                const isConnected = !!socialAccounts[platform];
                return (
                  <div
                    key={platform}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-5 shadow-md hover:shadow-lg transition-all"
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: cfg.color === "#FFFC00" ? "#f5c400" : cfg.color }}
                      >
                        {cfg.icon}
                      </div>
                      {isConnected ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                          ✅ Connected
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          ❌ Not Connected
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="text-base font-semibold mb-3 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {cfg.label}
                    </div>

                    {/* Actions */}
                    {isConnected ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openConnectModal(platform)}
                          className="flex-1 text-xs px-2 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 dark:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDisconnect(platform)}
                          className="flex-1 text-xs px-2 py-1.5 rounded-md border border-red-200 dark:border-red-400/40 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openConnectModal(platform)}
                        className="w-full text-xs px-3 py-2 rounded-md font-medium text-white hover:brightness-95"
                        style={{ backgroundColor: "#FFB400" }}
                      >
                        Connect Account
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Info banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
            <strong>🔒 Your credentials are encrypted</strong> and stored securely. They are only used by the automation bots to post content on your behalf and are never shared with third parties.
          </div>
        </div>
      )}

      {/* ── TAB: Dashboard ───────────────────────────────────────────────────── */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Overview */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📊 Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {statsLoading ? (
                [...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)
              ) : stats ? (
                (() => {
                  // B3: Derive activeBots/pausedBots from actual bots array (overrides stale API stats)
                  const realActive = bots ? bots.filter(b => b.status === "running").length : (stats.activeBots || 0);
                  const realPaused = bots ? bots.filter(b => b.status === "paused").length : (stats.pausedBots || 0);
                  return (
                    <>
                      <StatCard label="Total Posts" value={stats.totalPosts || 0} color="#8B5CF6" />
                      <StatCard label="Posts Today" value={stats.postsToday || 0} color="#EC4899" />
                      <StatCard label="This Week" value={stats.postsThisWeek || 0} color="#06B6D4" />
                      <StatCard label="Engagements" value={stats.totalEngagements || 0} color="#F59E0B" />
                      <StatCard label="Active Bots" value={realActive} color="#10B981" />
                      <StatCard label="Paused Bots" value={realPaused} color="#6B7280" />
                    </>
                  );
                })()
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                  Unable to load stats. Make sure the automation service is running.
                </div>
              )}
            </div>
          </div>

          {/* Bot Status */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                🤖 Bot Status
              </h2>
              <button
                onClick={handleRestartAll}
                disabled={actionLoading === "restart-all"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {actionLoading === "restart-all" ? "⏳ Restarting..." : "🔄 Restart All Bots"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {botsLoading ? (
                [...Array(8)].map((_, i) => <Skeleton key={i} className="h-40" />)
              ) : bots && bots.length > 0 ? (
                bots.map((bot) => (
                  <BotCard
                    key={bot.name}
                    bot={bot}
                    onRun={() => handleBotAction("run", bot.name)}
                    onPause={() => handleBotAction("pause", bot.name)}
                    onResume={() => handleBotAction("resume", bot.name)}
                    isLoading={actionLoading?.includes(bot.name) || false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl">
                  No bots configured. Check automation service configuration.
                </div>
              )}
            </div>
          </div>

          {/* Post Queue */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                📋 Post Queue
              </h2>
              <button
                onClick={handleRetryFailed}
                disabled={actionLoading === "retry-failed"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {actionLoading === "retry-failed" ? "⏳ Retrying..." : "🔁 Retry Failed Posts"}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-black/5 dark:border-white/10 overflow-hidden">
              {queueLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : queue && queue.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {queue.slice(0, 10).map((post) => (
                    <PostQueueItem key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No posts in queue
                </div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📜 Recent Activity
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-black/5 dark:border-white/10 overflow-hidden max-h-96 overflow-y-auto">
              {activityLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                </div>
              ) : activity && activity.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {activity.map((log, index) => (
                    <ActivityLogItem key={log.id || `activity-${index}`} log={log} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Connect / Edit Account Modal ─────────────────────────────────────── */}
      {connectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConnectModal(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-black/10 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{
                  backgroundColor:
                    platformConfig[connectModal.platform]?.color === "#FFFC00"
                      ? "#f5c400"
                      : platformConfig[connectModal.platform]?.color,
                }}
              >
                {platformConfig[connectModal.platform]?.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {socialAccounts[connectModal.platform] ? "Edit" : "Connect"}{" "}
                  {platformConfig[connectModal.platform]?.label}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enter your account credentials</p>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3 mb-5">
              {(platformFields[connectModal.platform] || [
                { key: "username", label: "Username / Email", type: "text", placeholder: "Enter username or email" },
                { key: "password", label: "Password", type: "password", placeholder: "Enter password" },
              ]).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1 dark:text-white/80">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formValues[field.key] || ""}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              ))}
            </div>

            {/* CR-3: Inline validation / service error */}
            {accountError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-3 border border-red-200 dark:border-red-700">
                ⚠️ {accountError}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setConnectModal(null); setAccountError(null); }}
                className="flex-1 rounded-lg border border-black/20 dark:border-white/20 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccount}
                disabled={savingAccount}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-50"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                {savingAccount ? "Saving…" : "Save Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-black/5 dark:border-white/10 p-4 shadow-md hover:shadow-lg transition-all">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-3xl font-bold" style={{ color }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function BotCard({
  bot,
  onRun,
  onPause,
  onResume,
  isLoading,
}: {
  bot: BotStatus;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  isLoading: boolean;
}) {
  const platform = bot.name.replace("Bot", "").toLowerCase();
  const config = platformConfig[platform] || { color: "#6B7280", icon: "🤖", label: platform };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-black/5 dark:border-white/10 p-4 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <span className="font-semibold dark:text-white capitalize">{platform}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${statusColors[bot.status] || "bg-gray-500"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          {bot.status}
        </span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
        {bot.lastRun && <div>Last run: {new Date(bot.lastRun).toLocaleString()}</div>}
        {bot.nextRun && <div>Next run: {new Date(bot.nextRun).toLocaleString()}</div>}
        {bot.postsToday !== undefined && <div>Posts today: {bot.postsToday}</div>}
      </div>
      <div className="flex gap-2">
        {bot.status === "running" ? (
          <button
            onClick={onPause}
            disabled={isLoading}
            className="flex-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {isLoading ? "..." : "⏸ Pause"}
          </button>
        ) : (
          <>
            <button
              onClick={onResume}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? "..." : "▶ Resume"}
            </button>
            <button
              onClick={onRun}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? "..." : "🚀 Run Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PostQueueItem({ post }: { post: ScheduledPost }) {
  const config = platformConfig[post.platform.toLowerCase()] || { color: "#6B7280", icon: "📱", label: post.platform };
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <span className="text-2xl">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium dark:text-white truncate">{post.caption.slice(0, 60)}...</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Scheduled for: {new Date(post.scheduledAt).toLocaleString()}
        </div>
      </div>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${statusColors[post.status] || "bg-gray-500"}`}
      >
        {post.status}
      </span>
    </div>
  );
}

function ActivityLogItem({ log }: { log: ActivityLog }) {
  const config = platformConfig[log.platform?.toLowerCase()] || { color: "#6B7280", icon: "📋", label: "System" };
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <span className="text-lg">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium dark:text-white">{log.action}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{log.details}</div>
      </div>
      <div className="text-right">
        <span className={`inline-block w-2 h-2 rounded-full ${statusColors[log.status] || "bg-gray-500"}`} />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(log.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
