"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
// import AppShell from "@/components/layout/AppShell";
import { getUserName, getRoleLabel } from "@/lib/auth";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

type UserRow = { id: string; email: string; role: string; status: string; planId?: string | null };
type JobRow = { id: string; title: string; status: string; progress: number; scheduledAt: string; user: { id: string; email: string }; channel: { id: string; displayName: string; provider: string } };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function AdminDashboardPage() {
  const { data: users, isLoading: loadingUsers, error: usersError, mutate } = useSWR<UserRow[]>("/admin/users", fetcher);
  const { data: jobs, isLoading: loadingJobs, error: jobsError } = useSWR<JobRow[]>("/admin/jobs", fetcher);

  const active = (users || []).filter((u) => u.status === "ACTIVE").length;
  const suspended = (users || []).filter((u) => u.status !== "ACTIVE").length;
  const admins = (users || []).filter((u) => u.role?.toLowerCase() === "admin").length;
  const jobQueued = (jobs || []).filter((j) => j.status === "QUEUED").length;
  const jobRunning = (jobs || []).filter((j) => j.status === "RUNNING").length;
  const jobSucceeded = (jobs || []).filter((j) => j.status === "SUCCEEDED").length;
  const jobFailed = (jobs || []).filter((j) => j.status === "FAILED").length;

  return (
    
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Welcome, {getUserName() || ""}</h1>
          <p className="text-black/60">Role: {getRoleLabel()}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-black/5 p-5 bg-white shadow-sm">
            <div className="text-xs uppercase tracking-wide text-black/60">Active Users</div>
            {loadingUsers ? <Skeleton className="h-8 w-20 mt-2" /> : <div className="text-3xl font-semibold mt-1">{active}</div>}
          </div>
          <div className="rounded-xl border border-black/5 p-5 bg-white shadow-sm">
            <div className="text-xs uppercase tracking-wide text-black/60">Suspended</div>
            {loadingUsers ? <Skeleton className="h-8 w-20 mt-2" /> : <div className="text-3xl font-semibold mt-1">{suspended}</div>}
          </div>
          <div className="rounded-xl border border-black/5 p-5 bg-white shadow-sm">
            <div className="text-xs uppercase tracking-wide text-black/60">Admins</div>
            {loadingUsers ? <Skeleton className="h-8 w-20 mt-2" /> : <div className="text-3xl font-semibold mt-1">{admins}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-black/5 p-4 bg-white">
            <div className="text-xs uppercase tracking-wide text-black/60">Jobs Queued</div>
            {loadingJobs ? <Skeleton className="h-7 w-16 mt-2" /> : <div className="text-2xl font-semibold mt-1">{jobQueued}</div>}
          </div>
          <div className="rounded-lg border border-black/5 p-4 bg-white">
            <div className="text-xs uppercase tracking-wide text-black/60">Jobs Running</div>
            {loadingJobs ? <Skeleton className="h-7 w-16 mt-2" /> : <div className="text-2xl font-semibold mt-1">{jobRunning}</div>}
          </div>
          <div className="rounded-lg border border-black/5 p-4 bg-white">
            <div className="text-xs uppercase tracking-wide text-black/60">Jobs Succeeded</div>
            {loadingJobs ? <Skeleton className="h-7 w-16 mt-2" /> : <div className="text-2xl font-semibold mt-1">{jobSucceeded}</div>}
          </div>
          <div className="rounded-lg border border-black/5 p-4 bg-white">
            <div className="text-xs uppercase tracking-wide text-black/60">Jobs Failed</div>
            {loadingJobs ? <Skeleton className="h-7 w-16 mt-2" /> : <div className="text-2xl font-semibold mt-1">{jobFailed}</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Recent Users</h2>
            <button onClick={() => mutate()} className="rounded-md bg-[#2D89FF] text-white px-3 py-1.5 text-sm hover:brightness-95">Refresh</button>
          </div>
          {loadingUsers && (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <SkeletonText lines={3} />
            </div>
          )}
          {usersError && <div className="text-sm text-red-600">Failed to load users</div>}
          {!loadingUsers && !usersError && (
            <>
              <div className="hidden md:block overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black/5 text-left">
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.slice(0, 8).map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-3 py-2">{u.email}</td>
                        <td className="px-3 py-2">{u.role}</td>
                        <td className="px-3 py-2">{u.status}</td>
                        <td className="px-3 py-2">{u.planId || "—"}</td>
                      </tr>
                    ))}
                    {(!users || users.length === 0) && (
                      <tr>
                        <td className="px-3 py-6 text-center text-black/60" colSpan={4}>No users yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-3">
                {users?.slice(0, 6).map((u) => (
                  <div key={u.id} className="rounded-lg border border-black/10 p-4">
                    <div className="text-sm font-medium break-all">{u.email}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-black/5 text-black/70">{u.role}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{u.status}</span>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-black/5 text-black/70">{u.planId || '—'}</span>
                    </div>
                  </div>
                ))}
                {(!users || users.length === 0) && (
                  <div className="text-sm text-black/60">No users yet</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Admin dashboard: no user action CTAs to avoid duplicates */}
      </div>
    
  );
}


