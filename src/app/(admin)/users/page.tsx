"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Row = { id: string; email: string; role: string; status: string; planId?: string | null };
const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function AdminUsersPage() {
  const { data, isLoading, error, mutate } = useSWR<Row[]>("/admin/users", fetcher);

  async function setStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
    try {
      const path = status === "SUSPENDED" ? `/admin/user/${id}/suspend` : `/admin/user/${id}/reactivate`;
      await api.post(path, {});
      mutate();
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="rounded-md bg-[#2D89FF] text-white px-3 py-2 text-sm hover:brightness-95" onClick={() => mutate()}>
          Refresh
        </button>
      </div>
      {isLoading && <div className="text-sm text-black/60">Loading...</div>}
      {error && <div className="text-sm text-red-600">Failed to load</div>}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg border border-black/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">{u.status}</td>
                  <td className="px-3 py-2">{u.planId || "—"}</td>
                  <td className="px-3 py-2">
                    {u.status === "ACTIVE" ? (
                      <button onClick={() => setStatus(u.id, "SUSPENDED")} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5">
                        <BlockIcon fontSize="small" /> Suspend
                      </button>
                    ) : (
                      <button onClick={() => setStatus(u.id, "ACTIVE")} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5">
                        <CheckCircleIcon fontSize="small" /> Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td className="px-3 py-6 text-center text-black/60" colSpan={5}>No users</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


