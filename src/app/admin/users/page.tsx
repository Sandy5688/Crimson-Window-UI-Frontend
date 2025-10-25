"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";
import { isAdminFull } from "@/lib/auth";

type Row = { id: string; email: string; role: string; status: string; planId?: string | null };
const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function AdminUsersPage() {
  const { data, isLoading, error, mutate } = useSWR<Row[]>("/admin/users", fetcher);
  const [canWrite, setCanWrite] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setCanWrite(isAdminFull());
  }, []);

  async function setStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
    setUpdatingUserId(id);
    try {
      const path = status === "SUSPENDED" ? `/admin/user/${id}/suspend` : `/admin/user/${id}/reactivate`;
      await api.post(path, {});
      mutate();
    } catch {
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="rounded-md bg-[#2D89FF] text-white px-3 py-2 text-sm hover:brightness-95" onClick={() => mutate()}>
          Refresh
        </button>
      </div>
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <SkeletonText lines={4} />
        </div>
      )}
      {error && <div className="text-sm text-red-600">Failed to load</div>}
      {!isLoading && !error && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg border border-black/5 overflow-hidden">
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
                      {canWrite && (
                        u.status === "ACTIVE" ? (
                          <button 
                            onClick={() => setStatus(u.id, "SUSPENDED")} 
                            disabled={updatingUserId === u.id}
                            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === u.id ? (
                              <>
                                <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin"></span>
                                Loading...
                              </>
                            ) : (
                              <>
                                <BlockIcon fontSize="small" /> Suspend
                              </>
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={() => setStatus(u.id, "ACTIVE")} 
                            disabled={updatingUserId === u.id}
                            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === u.id ? (
                              <>
                                <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin"></span>
                                Loading...
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon fontSize="small" /> Reactivate
                              </>
                            )}
                          </button>
                        )
                      )}
                      <Link href="/uploads" className="ml-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5">Jobs</Link>
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {data?.map((u) => (
              <div key={u.id} className="bg-white rounded-lg border border-black/10 p-4">
                <div className="text-sm font-medium break-all">{u.email}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-black/5 text-black/70">{u.role}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{u.status}</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-black/5 text-black/70">{u.planId || '—'}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  {canWrite && (
                    u.status === 'ACTIVE' ? (
                      <button 
                        onClick={() => setStatus(u.id, 'SUSPENDED')} 
                        disabled={updatingUserId === u.id}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingUserId === u.id ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin"></span>
                            Loading...
                          </>
                        ) : (
                          <>
                            <BlockIcon fontSize="small" /> Suspend
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setStatus(u.id, 'ACTIVE')} 
                        disabled={updatingUserId === u.id}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingUserId === u.id ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin"></span>
                            Loading...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon fontSize="small" /> Reactivate
                          </>
                        )}
                      </button>
                    )
                  )}
                  <Link href="/uploads" className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-black/5">Jobs</Link>
                </div>
              </div>
            ))}
            {(!data || data.length === 0) && (
              <div className="text-sm text-black/60">No users</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}


