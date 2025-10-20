"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useState } from "react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function MonetizationPage() {
  const { data, isLoading, error, mutate } = useSWR<any>("/api/v1/monetization", fetcher);
  const { data: planData, mutate: mutatePlan } = useSWR<any>("/api/v1/billing/plan", fetcher);
  const [busy, setBusy] = useState(false);

  async function checkout(priceId: string) {
    setBusy(true);
    try {
      const successUrl = window.location.origin + "/monetization?success=1";
      const cancelUrl = window.location.href;
      const { data } = await api.post('/api/v1/billing/checkout', { priceId, successUrl, cancelUrl });
      window.location.href = data.url;
    } finally {
      setBusy(false);
    }
  }

  async function openPortal() {
    setBusy(true);
    try {
      const returnUrl = window.location.href;
      const { data } = await api.post('/api/v1/billing/portal', { returnUrl });
      window.location.href = data.url;
    } finally {
      setBusy(false);
    }
  }
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
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-black/5 p-4">
            <div className="text-lg font-medium mb-2">Current Plan</div>
            {planData ? (
              <div className="text-sm">
                <div>Plan: <b>{planData.plan?.slug || 'Free'}</b></div>
                <div>Uploads used: <b>{planData.usage?.uploadsUsed ?? 0}</b>{planData.plan ? ` / ${planData.plan.uploadQuota}` : ''}</div>
              </div>
            ) : (
              <div className="text-sm text-black/60">Loading plan...</div>
            )}
            <div className="mt-3 flex gap-2">
              <button disabled={busy} onClick={() => checkout('price_123')} className="rounded-md bg-[#2D89FF] text-white px-3 py-2 text-sm hover:brightness-95 disabled:opacity-60">Upgrade</button>
              <button disabled={busy} onClick={openPortal} className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 disabled:opacity-60">Manage Billing</button>
              <button onClick={() => { mutatePlan(); mutate(); }} className="rounded-md border px-3 py-2 text-sm hover:bg-black/5">Refresh</button>
            </div>
          </div>

          <pre className="bg-white rounded-lg border border-black/5 p-4 overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


