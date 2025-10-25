"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { getSocket } from "@/lib/socket";
import { getSupabase } from "@/lib/supabase";
import EmptyState from "@/components/EmptyState";
import CircularProgress from "@/components/CircularProgress";

type Channel = { id: string; displayName: string };
type Job = { id: string; title: string; status: string; progress: number; scheduledAt: string };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function UploadsPage() {
  const { data: channels } = useSWR<Channel[]>("/api/v1/channels", fetcher);
  const [rows, setRows] = useState<Job[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  useEffect(() => {
    const s = getSocket();
    function onUpdate(payload: any) {
      setRows((prev) => prev.map((j) => (j.id === payload.jobId ? { ...j, status: payload.status, progress: payload.progress ?? j.progress } : j)));
    }
    function onDone(payload: any) {
      setRows((prev) => prev.map((j) => (j.id === payload.jobId ? { ...j, status: payload.status, progress: 100 } : j)));
    }
    function onFailed(payload: any) {
      setRows((prev) => prev.map((j) => (j.id === payload.jobId ? { ...j, status: "FAILED" } : j)));
    }
    s.on("job:update", onUpdate);
    s.on("job:done", onDone);
    s.on("job:failed", onFailed);
    return () => {
      s.off("job:update", onUpdate);
      s.off("job:done", onDone);
      s.off("job:failed", onFailed);
    };
  }, []);

  async function schedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setErr(null);
    try {
      const payload = {
        channelId: String(fd.get("channelId")),
        assetUrl: String(fd.get("assetUrl")),
        title: String(fd.get("title")),
        description: String(fd.get("description")) || undefined,
        platform: String(fd.get("platform")) || "generic",
        scheduledAt: String(fd.get("scheduledAt")),
      };
      const res = await api.post("/api/v1/upload", payload);
      const job: Job = res.data;
      setRows((prev) => [{ id: job.id, title: job.title, status: job.status, progress: job.progress, scheduledAt: job.scheduledAt }, ...prev]);
      form.reset();
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || "Failed to schedule upload";
      
      // Check if it's a quota limit error (403)
      if (e?.response?.status === 403) {
        setUpgradeMessage(errorMsg);
        setShowUpgradeModal(true);
        setErr(null); // Don't show error in form, show modal instead
      } else {
        setErr(errorMsg);
      }
    } finally {
      setBusy(false);
    }
  }

  const channelOptions = useMemo(() => channels || [], [channels]);

  return (
    <div className="space-y-8">
        <div data-aos="fade-down" className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#2D89FF]/10 to-[#4CAF50]/10 rounded-3xl blur-2xl opacity-30"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold dark:text-white bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] bg-clip-text text-transparent" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Schedule Upload
            </h1>
            <p className="text-black/60 dark:text-white/60 mt-2 text-lg">Queue your content for automated distribution across all platforms</p>
          </div>
        </div>
      <form onSubmit={schedule} data-aos="fade-up" data-aos-delay="100" className="relative bg-white dark:bg-gray-900 rounded-2xl border border-black/5 dark:border-white/10 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 grid gap-6 md:grid-cols-2 group">
        <div className="space-y-1">
          <label className="text-sm dark:text-white/80">Channel</label>
          {!channels && (
            <Skeleton className="h-10 w-full" />
          )}
          {channels && (
            <select name="channelId" required className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200">
              {channelOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.displayName}</option>
              ))}
            </select>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-white/80">Asset URL</label>
          <div className="flex gap-2">
            <input name="assetUrl" type="url" placeholder="https://... or use Upload" required className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200" />
            <input name="assetFile" type="file" className="hidden" />
            <button type="button" onClick={async () => {
              const supabase = getSupabase();
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.onchange = async () => {
                const file = fileInput.files?.[0];
                if (!file) return;
                const filename = `${Date.now()}-${file.name}`;
                // Ask backend for a storage target path
                const { data } = await api.post('/api/v1/upload/presign', { filename, contentType: file.type || 'application/octet-stream' });
                const url: string = data.url;
                if (url.startsWith('supabase://') && supabase) {
                  const [, bucket, ...pathParts] = url.replace('supabase://', '').split('/');
                  const objectPath = pathParts.join('/');
                  const { error } = await supabase.storage.from(bucket).upload(objectPath, file, { contentType: file.type || 'application/octet-stream', upsert: true });
                  if (error) {
                    alert(`Upload failed: ${error.message}`);
                    return;
                  }
                  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(objectPath);
                  const input = document.querySelector("input[name='assetUrl']") as HTMLInputElement | null;
                  if (input) input.value = publicUrl.publicUrl;
                } else {
                  // Fallback: set returned URL and assume accessible
                  const input = document.querySelector("input[name='assetUrl']") as HTMLInputElement | null;
                  if (input) input.value = url;
                }
              };
              fileInput.click();
            }} className="rounded-lg border-2 border-black/10 dark:border-white/10 px-4 py-3 text-sm font-medium hover:border-[#4CAF50] hover:bg-[#4CAF50]/10 hover:text-[#4CAF50] dark:hover:bg-[#4CAF50]/20 transition-all duration-200 whitespace-nowrap">📤 Upload</button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-white/80">Title</label>
          <input name="title" required className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-white/80">Description</label>
          <input name="description" className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-white/80">Platform</label>
          <input name="platform" placeholder="youtube / spotify / etc" className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-white/80">Schedule At</label>
          <input name="scheduledAt" type="datetime-local" required className="w-full rounded-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-4 py-3 hover:border-[#2D89FF] focus:border-[#2D89FF] focus:ring-2 focus:ring-[#2D89FF]/20 transition-all duration-200" />
        </div>
        <div className="md:col-span-2">
          <button disabled={busy} className="relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] text-white font-bold text-lg hover:shadow-2xl hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-all duration-300 group overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              {busy ? "⏳ Scheduling..." : "🚀 Schedule Upload"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50] to-[#2D89FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
        {err && <div className="md:col-span-2 text-red-600 dark:text-red-400 text-sm">{err}</div>}
      </form>

      <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white bg-gradient-to-r from-[#2D89FF] to-[#FF6B35] bg-clip-text text-transparent" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Recent Jobs
          </h2>
          <span className="text-sm text-black/60 dark:text-white/60">
            📊 {rows.length} {rows.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          {rows.length === 0 ? (
            <EmptyState
              icon="📤"
              title="No Uploads Yet"
              description="Schedule your first upload to start distributing content automatically across all your connected platforms."
              actionLabel="Scroll Up to Upload"
              onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/10 text-left">
                    <th className="px-4 py-3 font-semibold dark:text-white">Title</th>
                    <th className="px-4 py-3 font-semibold dark:text-white">Status</th>
                    <th className="px-4 py-3 font-semibold dark:text-white">Progress</th>
                    <th className="px-4 py-3 font-semibold dark:text-white">Scheduled</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((j, idx) => (
                    <tr key={j.id} data-aos="fade-left" data-aos-delay={idx * 50} className="border-t border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                      <td className="px-4 py-3 font-medium dark:text-white">{j.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            j.status === "SUCCEEDED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : j.status === "FAILED"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : j.status === "RUNNING"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {j.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CircularProgress progress={j.progress} size={36} strokeWidth={3} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">{new Date(j.scheduledAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div data-aos="zoom-in" data-aos-duration="300" className="relative bg-white dark:bg-gray-900 rounded-3xl border-2 border-black/10 dark:border-white/10 p-8 max-w-md w-full shadow-2xl">
            {/* Gradient background effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2D89FF] via-[#4CAF50] to-[#FF6B35] rounded-3xl blur opacity-20 animate-pulse"></div>
            
            <div className="relative">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce">🚀</div>
                <h3 className="text-3xl font-bold mb-3 dark:text-white bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] bg-clip-text text-transparent" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Upgrade Required
                </h3>
                <p className="text-black/70 dark:text-white/70 text-base mb-4">
                  {upgradeMessage}
                </p>
              </div>
              
              <div className="relative bg-gradient-to-br from-[#2D89FF]/10 to-[#4CAF50]/10 border-2 border-[#2D89FF]/20 rounded-xl p-5 mb-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50]/10 rounded-full blur-2xl"></div>
                <p className="text-sm font-bold text-black/90 dark:text-white/90 mb-3 relative z-10">
                  ✨ Pro Plan Benefits:
                </p>
                <ul className="text-sm text-black/80 dark:text-white/80 space-y-2 relative z-10">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span>20 video uploads / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span>10 podcast uploads / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span>Up to 5 platforms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span>Remove watermark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span>Advanced AI optimization</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 rounded-xl border-2 border-black/20 dark:border-white/20 px-6 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => window.location.href = "/monetization"}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] text-white px-6 py-3 text-sm font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  🎯 View Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


