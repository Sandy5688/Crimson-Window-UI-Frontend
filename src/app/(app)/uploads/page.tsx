"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

type Channel = { id: string; displayName: string };
type Job = { id: string; title: string; status: string; progress: number; scheduledAt: string };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function UploadsPage() {
  const { data: channels } = useSWR<Channel[]>("/api/v1/channels", fetcher);
  const [rows, setRows] = useState<Job[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      setErr(e?.response?.data?.error || "Failed to schedule upload");
    } finally {
      setBusy(false);
    }
  }

  const channelOptions = useMemo(() => channels || [], [channels]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Schedule Upload</h1>
      <form onSubmit={schedule} className="bg-white rounded-lg border border-black/5 p-4 shadow-sm grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm">Channel</label>
          <select name="channelId" required className="w-full rounded-md border px-3 py-2">
            {channelOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.displayName}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm">Asset URL</label>
          <input name="assetUrl" type="url" required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Title</label>
          <input name="title" required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Description</label>
          <input name="description" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Platform</label>
          <input name="platform" placeholder="youtube / tiktok / etc" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Schedule At</label>
          <input name="scheduledAt" type="datetime-local" required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <button disabled={busy} className="rounded-md bg-[#2D89FF] text-white px-4 py-2 hover:brightness-95 disabled:opacity-70">{busy ? "Scheduling..." : "Schedule"}</button>
        </div>
        {err && <div className="md:col-span-2 text-red-600 text-sm">{err}</div>}
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Recent Jobs</h2>
        <div className="bg-white rounded-lg border border-black/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Progress</th>
                <th className="px-3 py-2">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => (
                <tr key={j.id} className="border-t">
                  <td className="px-3 py-2">{j.title}</td>
                  <td className="px-3 py-2">{j.status}</td>
                  <td className="px-3 py-2">{j.progress}%</td>
                  <td className="px-3 py-2">{new Date(j.scheduledAt).toLocaleString()}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-black/60" colSpan={4}>No jobs yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


