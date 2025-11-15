/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

import GavelIcon from "@mui/icons-material/Gavel";
import PolicyIcon from "@mui/icons-material/Policy";
import LockIcon from "@mui/icons-material/Lock";
import CookieIcon from "@mui/icons-material/Cookie";
import ShieldIcon from "@mui/icons-material/Shield";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function LegalPage() {
  const sections = [
    {
      Icon: LockIcon,
      title: "Privacy & Data",
      points: [
        "We collect only essential info (name, email, connected channels, content metadata).",
        "Used to deliver, improve and personalize your experience.",
        "Tokens and credentials are encrypted at rest.",
        "We never sell your data.",
        "Request deletion any time via support.",
      ],
    },
    {
      Icon: GavelIcon,
      title: "Terms of Service",
      points: [
        "Use the platform for lawful purposes only.",
        "Subscriptions renew automatically via Stripe.",
        "Billing terms follow our Billing Policy.",
        "You own your content; we process it to localize and publish.",
        "Misuse or impersonation may result in suspension.",
      ],
    },
    {
      Icon: CookieIcon,
      title: "Cookies & Tracking",
      points: [
        "Minimal analytics to improve performance and reliability.",
        "You can decline non-essential cookies via the banner.",
        "Preferences are honored across sessions where possible.",
      ],
    },
    {
      Icon: PolicyIcon,
      title: "Security & Compliance",
      points: [
        "Transport encryption (TLS) and encryption at rest.",
        "Role-based access controls and audit trails for sensitive actions.",
        "Incident response playbooks and least-privilege access.",
      ],
    },
  ];

  return (
    <div className="bg-[#F9FAFB] dark:bg-gray-950 text-[#111827] dark:text-white relative">
      <MarketingNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10 py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-100/50 dark:bg-purple-900/30 backdrop-blur-md px-6 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow mb-6">
            📚 Legal & Compliance
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Built with privacy, security and trust
          </h1>
          <p className="mt-4 text-lg text-black dark:text-white max-w-3xl mx-auto">
            Clear terms. Strong protections. Controls that respect your choices.
          </p>
          <p className="mt-2 text-sm text-[#111827]/90 dark:text-white/90">
            Last updated: November 15, 2025
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-up" data-aos-delay={i * 80}>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center p-3 rounded-xl text-white shadow bg-gradient-to-br from-purple-500 to-pink-500">
                  <s.Icon />
                </div>
                <h2 className="text-lg font-bold">{s.title}</h2>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-black dark:text-white">
                {s.points.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-up">
          <div className="flex items-center gap-3">
            <ShieldIcon className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold">Your Rights</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-black dark:text-white">
            <li>• Access, correct or delete your personal data.</li>
            <li>• Export your data where supported.</li>
            <li>• Withdraw consent for non-essential tracking.</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Link href="/support" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 hover:shadow-lg transition-all">
              Contact Support
            </Link>
            <Link href="/billing-policy" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 hover:scale-110 hover:shadow-lg transition-all">
              Billing Policy
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="container py-16 md:py-24 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Need legal or compliance help?
          </h3>
          <p className="mt-3 text-black dark:text-white max-w-2xl mx-auto">
            Our team can assist with DPAs, security questionnaires and procurement reviews.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />
    </div>
  );

