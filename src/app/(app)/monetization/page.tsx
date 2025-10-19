"use client";
import useSWR from "swr";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function MonetizationPage() {
  const { data, isLoading, error, mutate } = useSWR<any>("/api/v1/monetization", fetcher);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Monetization</h1>
        <button className="rounded-md bg-[#2D89FF] text-white px-3 py-2 text-sm hover:brightness-95" onClick={() => mutate()}>
          Refresh
        </button>
      </div>
      {isLoading && <div className="text-sm text-black/60">Loading...</div>}
      {error && <div className="text-sm text-red-600">Failed to load</div>}
      {!isLoading && !error && (
        <pre className="bg-white rounded-lg border border-black/5 p-4 overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}


