"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getToken, isUser, isEmailVerified } from "@/lib/auth";
import Providers from "@/app/providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    // Check if user is authenticated
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    
    // Check if email is verified (Item 9)
    if (!isEmailVerified()) {
      router.replace("/verify-email");
      return;
    }
    
    // Redirect admin users to admin dashboard
    if (!isUser()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);
  return <Providers><AppShell>{children}</AppShell></Providers>;
}


