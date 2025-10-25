"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
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

const fetcher = (url: string) => api.get(url).then((r) => r.data);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 GB";
  const gb = bytes / 1073741824;
  return `${gb.toFixed(2)} GB`;
}

export default function UserDashboardPage() {
  const { data: metrics, isLoading, error } = useSWR<MetricsOverview>("/api/v1/metrics/overview", fetcher);
  const [userName, setUserName] = useState<string | null>(null);
  const [roleLabel, setRoleLabel] = useState<string>("Guest");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUserName(getUserName());
    setRoleLabel(getRoleLabel());
  }, []);

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
