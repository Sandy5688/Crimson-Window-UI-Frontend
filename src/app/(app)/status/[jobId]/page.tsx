"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

type Job = { id: string; title: string; status: string; progress: number; logsJson?: any };

export default function JobStatusPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/v1/status/${jobId}`);
        setJob(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load job");
      }
    })();
  }, [jobId]);

  useEffect(() => {
    const s = getSocket();
    function onUpdate(p: any) { if (p.jobId === jobId) setJob((j) => j ? { ...j, status: p.status, progress: p.progress ?? j.progress } : j); }
    function onDone(p: any) { if (p.jobId === jobId) setJob((j) => j ? { ...j, status: p.status, progress: 100 } : j); }
    function onFailed(p: any) { if (p.jobId === jobId) setJob((j) => j ? { ...j, status: 'FAILED' } : j); }
    s.on("job:update", onUpdate);
    s.on("job:done", onDone);
    s.on("job:failed", onFailed);
    return () => {
      s.off("job:update", onUpdate);
      s.off("job:done", onDone);
      s.off("job:failed", onFailed);
    };
  }, [jobId]);

  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!job) return <div className="text-sm text-black/60">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Job Status</h1>
      <div className="bg-white rounded-lg border border-black/5 p-4">
        <div className="text-sm text-black/60">ID</div>
        <div className="mb-3">{job.id}</div>
        <div className="text-sm text-black/60">Title</div>
        <div className="mb-3">{job.title}</div>
        <div className="text-sm text-black/60">Status</div>
        <div className="mb-3">{job.status}</div>
        <div className="text-sm text-black/60">Progress</div>
        <div className="mb-3">{job.progress}%</div>
        {job.logsJson && (
          <div>
            <div className="text-sm text-black/60">Logs</div>
            <pre className="bg-black/5 p-3 rounded text-xs overflow-auto">{JSON.stringify(job.logsJson, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}


