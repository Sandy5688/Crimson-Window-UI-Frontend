"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { clearToken, getToken, getRole } from "@/lib/auth";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DnsIcon from "@mui/icons-material/Dns";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

type NavItem = { href: string; label: string; Icon: React.ElementType };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Compute on client after mount to avoid SSR/CSR mismatch
    setRole(getRole());
    setAuthed(!!getToken());
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const nav = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { href: role === 'admin' ? "/admin/dashboard" : "/dashboard", label: "Dashboard", Icon: HomeIcon },
      { href: "/channels", label: "Channels", Icon: DnsIcon },
      { href: "/uploads", label: "Uploads", Icon: CloudUploadIcon },
      { href: "/monetization", label: "Monetization", Icon: HomeIcon },
    ];
    if (role === 'admin') items.push({ href: "/admin/users", label: "Admin", Icon: PeopleIcon });
    return items;
  }, [role]);

  function signOut() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#171717]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-[18px] font-semibold tracking-tight">
            Portal
          </Link>
          <div className="flex items-center gap-4">
            {authed && (
              <button onClick={signOut} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md bg-[#2D89FF] text-white hover:brightness-95">
                <LogoutIcon fontSize="small" /> Sign out
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="bg-white rounded-lg shadow-sm border border-black/5 divide-y">
            {!mounted ? (
              <div className="p-3 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              nav.map(({ href, label, Icon }) => {
                const active = pathname?.startsWith(href);
                return (
                  <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 text-sm ${active ? "bg-[#E8F2FF] text-[#2D89FF]" : "hover:bg-black/5"}`}>
                    <Icon fontSize="small" />
                    <span>{label}</span>
                  </Link>
                );
              })
            )}
          </nav>
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10">{children}</main>
      </div>
    </div>
  );
}


