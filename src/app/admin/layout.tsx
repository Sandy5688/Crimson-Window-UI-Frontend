"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getToken, isAdminRead, isAdminFull } from "@/lib/auth";
import Providers from "@/app/providers";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    if (!isAdminRead()) {
      router.replace("/dashboard");
    }
  }, [router]);
  const readOnly = !isAdminFull();
  return (
    <Providers>
    <AppShell>
      {readOnly && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
          You are viewing as Admin Viewer. Changes are disabled.
        </div>
      )}
      {children}
    </AppShell>
    </Providers>
  );
}


