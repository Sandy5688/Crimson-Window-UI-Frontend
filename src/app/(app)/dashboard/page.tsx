"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

type Channel = { id: string; provider: string; displayName: string };
type Monetization = any;

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function UserDashboardPage() {
  const { data: channels, isLoading: loadingChannels, error: channelsError } = useSWR<Channel[]>("/api/v1/channels", fetcher);
  const { data: monetization, isLoading: loadingMon, error: monError } = useSWR<Monetization>("/api/v1/monetization", fetcher);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-black/60">Your creator dashboard at a glance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Connected Channels</h2>
            {loadingChannels && (
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}
            {channelsError && <div className="text-sm text-red-600">Failed to load channels</div>}
            {!loadingChannels && !channelsError && (
              <div className="grid sm:grid-cols-2 gap-3">
                {channels?.map((c) => (
                  <div key={c.id} className="rounded-lg border border-black/5 p-4">
                    <div className="text-xs uppercase tracking-wide text-black/50">{c.provider}</div>
                    <div className="text-base font-medium">{c.displayName}</div>
                  </div>
                ))}
                {(!channels || channels.length === 0) && (
                  <div className="text-sm text-black/60">No channels connected yet</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Monetization</h2>
            {loadingMon && (
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <SkeletonText lines={4} />
              </div>
            )}
            {monError && <div className="text-sm text-red-600">Failed to load monetization</div>}
            {!loadingMon && !monError && (
              <pre className="bg-black/5 p-3 rounded text-xs overflow-auto">{JSON.stringify(monetization, null, 2)}</pre>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <a href="/uploads" className="rounded-xl border border-black/5 p-6 shadow-sm hover:bg-black/5 transition">
            <div className="text-lg font-medium">Schedule Upload</div>
            <div className="text-sm text-black/60">Queue content and track progress</div>
          </a>
          <a href="/channels" className="rounded-xl border border-black/5 p-6 shadow-sm hover:bg-black/5 transition">
            <div className="text-lg font-medium">Manage Channels</div>
            <div className="text-sm text-black/60">Connect or edit channels</div>
          </a>
          <a href="/monetization" className="rounded-xl border border-black/5 p-6 shadow-sm hover:bg-black/5 transition">
            <div className="text-lg font-medium">See Monetization</div>
            <div className="text-sm text-black/60">Insights and earnings</div>
          </a>
        </div>
      </div>
    </AppShell>
  );
}


