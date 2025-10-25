"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getToken, isUser } from "@/lib/auth";
import Providers from "@/app/providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    if (!isUser()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);
  return <Providers><AppShell>{children}</AppShell></Providers>;
}


