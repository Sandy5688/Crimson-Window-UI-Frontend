"use client";
import useSWR from "swr";
import { api } from "@/lib/api";

type Channel = { id: string; provider: string; displayName: string };

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function ChannelsPage() {
  const { data, isLoading, error, mutate } = useSWR<Channel[]>("/api/v1/channels", fetcher);
  async function connectChannel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await api.post('/api/v1/channels/connect', {
      provider: String(fd.get('provider') || ''),
      providerChannelId: String(fd.get('providerChannelId') || ''),
      displayName: String(fd.get('displayName') || ''),
    });
    (e.target as HTMLFormElement).reset();
    mutate();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Channels</h1>
        <button className="rounded-md bg-[#2D89FF] text-white px-3 py-2 text-sm hover:brightness-95" onClick={() => mutate()}>
          Refresh
        </button>
      </div>
      {isLoading && <div className="text-sm text-black/60">Loading...</div>}
      {error && <div className="text-sm text-red-600">Failed to load</div>}
      {!isLoading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((c) => (
            <div key={c.id} className="bg-white rounded-lg border border-black/5 p-4 shadow-sm">
              <div className="text-sm uppercase tracking-wide text-black/50">{c.provider}</div>
              <div className="text-lg font-medium">{c.displayName}</div>
            </div>
          ))}
          <div className="col-span-full bg-white rounded-lg border border-black/5 p-6">
            <h2 className="text-lg font-medium mb-3">Connect Channel</h2>
            <form onSubmit={connectChannel} className="grid md:grid-cols-3 gap-3">
              <input name="provider" placeholder="provider (youtube/tiktok/rss)" required className="rounded-md border px-3 py-2" />
              <input name="providerChannelId" placeholder="providerChannelId" required className="rounded-md border px-3 py-2" />
              <input name="displayName" placeholder="display name" className="rounded-md border px-3 py-2" />
              <div className="md:col-span-3">
                <button className="rounded-md bg-[#FFB400] text-black px-3 py-2 text-sm hover:brightness-95">Connect</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


