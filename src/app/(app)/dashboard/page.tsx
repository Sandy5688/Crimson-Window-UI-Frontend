"use client";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { api } from "@/lib/api";
import { getUserName, getRoleLabel } from "@/lib/auth";
import { Skeleton } from "@/components/ui/Skeleton";
import OnboardingModal from "@/components/OnboardingModal";

type MetricsOverview = {
  platformsConnected: { count: number; limit: number };
  uploadsThisMonth: { used: number; quota: number };
  localizationJobs: { queued: number; running: number; succeeded: number; failed: number };
  storageUsed: { bytes: number; limit: number };
};

type PlanData = { plan: any; usage: any; channelCount: number; channelLimit: number };
type Channel = { id: string; displayName: string };
type Job = { id: string; title: string; status: string; progress: number; scheduledAt: string };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 GB";
  const gb = bytes / 1073741824;
  return `${gb.toFixed(2)} GB`;
}

export default function UserDashboardPage() {
  const { data: metrics, isLoading, error } = useSWR<MetricsOverview>("/api/v1/metrics/overview", fetcher);
  const { data: planData } = useSWR<PlanData>("/api/v1/billing/plan", fetcher);
  const { data: channels } = useSWR<Channel[]>("/api/v1/channels", fetcher);
  const [userName, setUserName] = useState<string | null>(null);
  const [roleLabel, setRoleLabel] = useState<string>("Guest");
  const [isMounted, setIsMounted] = useState(false);

  // Schedule upload state
  const [busy, setBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUserName(getUserName());
    setRoleLabel(getRoleLabel());
  }, []);

  const channelOptions = useMemo(() => channels || [], [channels]);

  async function handleScheduleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setUploadErr(null);
    setUploadSuccess(false);
    try {
      const payload = {
        channelId: String(fd.get("channelId")),
        assetUrl: String(fd.get("assetUrl")),
        title: String(fd.get("title")),
        platform: "generic",
        scheduledAt: String(fd.get("scheduledAt")),
      };
      await api.post("/api/v1/upload", payload);
      setUploadSuccess(true);
      form.reset();
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || "Failed to schedule upload";
      setUploadErr(errorMsg);
    } finally {
      setBusy(false);
    }
  }

  const currentPlanSlug = planData?.plan?.slug || "free";
  const currentPlanName = planData?.plan?.name || "Free";

  return (
    <>
      <OnboardingModal />
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Banner */}
        <div
          className="bg-gradient-to-br from-[#2D89FF] to-[#1e5fbf] dark:from-[#1e5fbf] dark:to-[#0f3d7a] rounded-2xl p-6 sm:p-8 shadow-xl"
          data-aos="fade-down"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Welcome back!
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-1">{isMounted ? userName : ""}</p>
          <p className="text-white/70 text-sm">{isMounted ? roleLabel : ""}</p>
        </div>

        {/* Metrics Overview */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            📊 Your Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading && [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            {error && <div className="col-span-full text-sm text-red-600 dark:text-red-400">Failed to load metrics</div>}
            {!isLoading && !error && metrics && (
              <>
                <div
                  data-aos="fade-up"
                  data-aos-delay="0"
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Platforms Connected</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: "#2D89FF" }}>
                    {metrics.platformsConnected.count}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50">of {metrics.platformsConnected.limit} allowed</div>
                </div>

                <div
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Uploads This Month</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: "#FFB400" }}>
                    {metrics.uploadsThisMonth.used}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50">of {metrics.uploadsThisMonth.quota} quota</div>
                </div>

                <div
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Localization Jobs</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: "#4CAF50" }}>
                    {metrics.localizationJobs.queued + metrics.localizationJobs.running}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50">
                    {metrics.localizationJobs.succeeded} completed · {metrics.localizationJobs.failed} failed
                  </div>
                </div>

                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Storage Used</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: "#6366F1" }}>
                    {formatBytes(metrics.storageUsed.bytes)}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50">of {formatBytes(metrics.storageUsed.limit)}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Your Plan Section */}
        <div data-aos="fade-up">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            💎 Your Plan
          </h2>
          {!planData ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#2D89FF]/5 to-[#4CAF50]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#2D89FF]/10 to-[#2D89FF]/5 rounded-xl p-4 border border-[#2D89FF]/20">
                    <div className="text-black/60 dark:text-white/60 text-xs mb-1">📦 Current Plan</div>
                    <div className="text-2xl font-bold capitalize" style={{ color: "#2D89FF" }}>
                      {currentPlanName}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#FFB400]/10 to-[#FFB400]/5 rounded-xl p-4 border border-[#FFB400]/20">
                    <div className="text-black/60 dark:text-white/60 text-xs mb-1">📤 Uploads Used</div>
                    <div className="text-2xl font-bold" style={{ color: "#FFB400" }}>
                      {planData.usage?.uploadsUsed ?? 0} / {planData.plan?.uploadQuota ?? 2}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5 rounded-xl p-4 border border-[#4CAF50]/20">
                    <div className="text-black/60 dark:text-white/60 text-xs mb-1">🔗 Platforms</div>
                    <div className="text-2xl font-bold" style={{ color: "#4CAF50" }}>
                      {planData.channelCount ?? 0} / {planData.channelLimit ?? 2}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/monetization"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    🚀 {currentPlanSlug === "free" ? "Upgrade Plan" : "Manage Plan"}
                  </Link>
                  <Link
                    href="/monetization"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium border-2 border-[#2D89FF]/30 text-[#2D89FF] hover:bg-[#2D89FF] hover:text-white transition-all duration-200"
                  >
                    💳 View Pricing
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Upload Section */}
        <div data-aos="fade-up">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            📤 Schedule Upload
          </h2>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300">
            {uploadSuccess && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-green-700 dark:text-green-300 text-sm font-medium animate-fadeIn">
                ✅ Upload scheduled successfully!
              </div>
            )}
            {uploadErr && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-700 dark:text-red-300 text-sm font-medium">
                ❌ {uploadErr}
              </div>
            )}
            <form onSubmit={handleScheduleUpload} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium dark:text-white/80">Channel</label>
                {!channels ? (
                  <Skeleton className="h-11 w-full" />
                ) : channelOptions.length === 0 ? (
                  <div className="text-sm text-black/50 dark:text-white/50 py-3">
                    No channels connected.{" "}
                    <Link href="/channels" className="text-[#2D89FF] font-medium hover:underline">
                      Connect a channel →
                    </Link>
                  </div>
                ) : (
                  <select
                    name="channelId"
                    required
                    className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200"
                  >
                    {channelOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium dark:text-white/80">Title</label>
                <input
                  name="title"
                  required
                  placeholder="Content title"
                  className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium dark:text-white/80">Asset URL</label>
                <input
                  name="assetUrl"
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium dark:text-white/80">Schedule At</label>
                <input
                  name="scheduledAt"
                  type="datetime-local"
                  required
                  className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                <button
                  disabled={busy || channelOptions.length === 0}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] text-white font-bold text-sm hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300"
                >
                  {busy ? "⏳ Scheduling..." : "🚀 Schedule Upload"}
                </button>
                <Link
                  href="/uploads"
                  className="text-sm font-medium text-[#2D89FF] hover:underline"
                >
                  View all uploads →
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <a
              href="/uploads"
              data-aos="fade-right"
              data-aos-delay="0"
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#2D89FF] dark:hover:border-[#2D89FF]"
            >
              <div className="text-4xl mb-3">📤</div>
              <div className="text-lg sm:text-xl font-bold mb-2 dark:text-white group-hover:text-[#2D89FF] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Upload Now
              </div>
              <div className="text-sm text-black/60 dark:text-white/60">Queue content and track progress</div>
            </a>
            <a
              href="/channels"
              data-aos="fade-up"
              data-aos-delay="100"
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#FFB400] dark:hover:border-[#FFB400]"
            >
              <div className="text-4xl mb-3">🎧</div>
              <div className="text-lg sm:text-xl font-bold mb-2 dark:text-white group-hover:text-[#FFB400] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Manage Channels
              </div>
              <div className="text-sm text-black/60 dark:text-white/60">Connect or edit channels</div>
            </a>
            <a
              href="/monetization"
              data-aos="fade-left"
              data-aos-delay="200"
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#4CAF50] dark:hover:border-[#4CAF50]"
            >
              <div className="text-4xl mb-3">💳</div>
              <div className="text-lg sm:text-xl font-bold mb-2 dark:text-white group-hover:text-[#4CAF50] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Upgrade Plan
              </div>
              <div className="text-sm text-black/60 dark:text-white/60">View pricing and upgrade</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
