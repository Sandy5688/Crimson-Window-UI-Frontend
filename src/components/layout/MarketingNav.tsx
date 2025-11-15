/** @jsxImportSource react */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function MarketingNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href: string) => {
    // Handle home link specially
    if (href === "/#home") {
      return pathname === "/";
    }
    // Check if pathname starts with the href (without hash)
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#home", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow bg-white/90 dark:bg-gray-900/80 backdrop-blur ${isScrolled ? "shadow-sm" : "shadow-none"}`}>
      <div className="container flex items-center justify-between h-16">
        <Link href="/#home" className="font-semibold text-lg tracking-tight text-[#111827] dark:text-white" aria-label="CreatorFlow - Home">
          CreatorFlow
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm transition-colors ${isActive(l.href) ? "text-[#111827] dark:text-white font-semibold border-b-2" : "text-[#111827]/80 dark:text-white/80 hover:text-[#111827] dark:hover:text-white"}`} style={isActive(l.href) ? { borderColor: PRIMARY } : {}}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link href="/signup" className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
            Start for Free
          </Link>
        </div>
        <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10" aria-label="Toggle menu" onClick={() => setIsOpen((v) => !v)}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-gray-900" data-aos="fade-down">
          <div className="container py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`transition-colors ${isActive(l.href) ? "text-[#111827] dark:text-white font-semibold" : "text-[#111827] dark:text-white"}`} style={isActive(l.href) ? { color: PRIMARY } : {}} onClick={() => setIsOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/signup" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
                Start for Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


