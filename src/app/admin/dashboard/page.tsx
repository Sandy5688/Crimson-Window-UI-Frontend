"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

type UserRow = { id: string; email: string; role: string; status: string; planId?: string | null };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function AdminDashboardPage() {
  const { data: users, isLoading: loadingUsers, error: usersError, mutate } = useSWR<UserRow[]>("/admin/users", fetcher);

  const active = (users || []).filter((u) => u.status === "ACTIVE").length;
  const suspended = (users || []).filter((u) => u.status !== "ACTIVE").length;
  const admins = (users || []).filter((u) => u.role?.toLowerCase() === "admin").length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Admin Overview</h1>
          <p className="text-black/60">Manage users and operations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
            <div className="overflow-auto">
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
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <a href="/admin/users" className="rounded-xl border border-black/5 p-6 shadow-sm hover:bg-black/5 transition">
            <div className="text-lg font-medium">Manage Users</div>
            <div className="text-sm text-black/60">Suspend, reactivate users</div>
          </a>
          <a href="/uploads" className="rounded-xl border border-black/5 p-6 shadow-sm hover:bg-black/5 transition">
            <div className="text-lg font-medium">Jobs Queue</div>
            <div className="text-sm text-black/60">Track processing status</div>
          </a>
          <a href="/monetization" className="rounded-xl border border-black/5 p-6 shadow-sm hover:bg-black/5 transition">
            <div className="text-lg font-medium">Monetization</div>
            <div className="text-sm text-black/60">Overview & insights</div>
          </a>
        </div>
      </div>
    </AppShell>
  );
}


