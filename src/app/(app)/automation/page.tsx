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
  BotStatus,
  AutomationStats,
  ScheduledPost,
  ActivityLog,
} from "@/lib/automation-api";

// Platform icons/colors
const platformConfig: Record<string, { color: string; icon: string }> = {
  twitter: { color: "#1DA1F2", icon: "𝕏" },
  instagram: { color: "#E4405F", icon: "📸" },
  facebook: { color: "#1877F2", icon: "📘" },
  linkedin: { color: "#0A66C2", icon: "💼" },
  tiktok: { color: "#000000", icon: "🎵" },
  pinterest: { color: "#E60023", icon: "📌" },
  reddit: { color: "#FF4500", icon: "🔴" },
  telegram: { color: "#0088CC", icon: "✈️" },
  discord: { color: "#5865F2", icon: "🎮" },
  quora: { color: "#B92B27", icon: "❓" },
  snapchat: { color: "#FFFC00", icon: "👻" },
  gmb: { color: "#4285F4", icon: "📍" },
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

export default function AutomationPage() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  // Show notification
  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Bot actions
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
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
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isHealthy === null
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
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
          📊 Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsLoading ? (
            [...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : stats ? (
            <>
              <StatCard label="Total Posts" value={stats.totalPosts || 0} color="#8B5CF6" />
              <StatCard label="Posts Today" value={stats.postsToday || 0} color="#EC4899" />
              <StatCard label="This Week" value={stats.postsThisWeek || 0} color="#06B6D4" />
              <StatCard label="Engagements" value={stats.totalEngagements || 0} color="#F59E0B" />
              <StatCard label="Active Bots" value={stats.activeBots || 0} color="#10B981" />
              <StatCard label="Paused Bots" value={stats.pausedBots || 0} color="#6B7280" />
            </>
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
              Unable to load stats. Make sure the automation service is running.
            </div>
          )}
        </div>
      </div>

      {/* Bot Status & Controls */}
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
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
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
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
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
  );
}

// Sub-components
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
  const config = platformConfig[platform] || { color: "#6B7280", icon: "🤖" };

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
  const config = platformConfig[post.platform.toLowerCase()] || { color: "#6B7280", icon: "📱" };

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
  const config = platformConfig[log.platform?.toLowerCase()] || { color: "#6B7280", icon: "📋" };

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <span className="text-lg">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium dark:text-white">{log.action}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{log.details}</div>
      </div>
      <div className="text-right">
        <span
          className={`inline-block w-2 h-2 rounded-full ${statusColors[log.status] || "bg-gray-500"}`}
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(log.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
