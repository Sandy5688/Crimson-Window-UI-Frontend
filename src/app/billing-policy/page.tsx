/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

import ShieldIcon from "@mui/icons-material/Shield";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function BillingPolicyPage() {
  const highlights = [
    { Icon: ShieldIcon, title: "Secure by Stripe", desc: "All payments processed via Stripe with PCI-DSS compliance." },
    { Icon: AutorenewIcon, title: "Transparent Renewals", desc: "Subscriptions renew monthly; cancel anytime before renewal." },
    { Icon: ReceiptLongIcon, title: "Invoices & Taxes", desc: "Download invoices and add tax details from your billing portal." },
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
            💳 Billing Policy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Simple, transparent billing built for creators
          </h1>
          <p className="mt-4 text-lg text-black dark:text-white max-w-3xl mx-auto">
            Powered by Stripe with secure payments, clear invoices, and flexible cancellations.
          </p>
          <div className="mt-8">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <div key={h.title} className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-up" data-aos-delay={i * 80}>
              <div className="inline-flex items-center justify-center p-3 rounded-xl text-white shadow bg-gradient-to-br from-purple-500 to-pink-500">
                <h.Icon />
              </div>
              <h3 className="mt-4 text-lg font-bold">{h.title}</h3>
              <p className="mt-1 text-sm text-black dark:text-white">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-right">
            <div className="flex items-center gap-3">
              <AutorenewIcon className="text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold">Subscriptions & Renewals</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-black dark:text-white">
              <li>• Plans renew automatically each billing cycle via Stripe.</li>
              <li>• You can cancel anytime before the next renewal to avoid charges.</li>
              <li>• Changes to plans apply at the next cycle unless otherwise stated.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-left">
            <div className="flex items-center gap-3">
              <CreditCardIcon className="text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold">Payments & Methods</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-black dark:text-white">
              <li>• Stripe supports major cards and localized payment methods.</li>
              <li>• Invoices can include company and tax details from your portal.</li>
              <li>• Taxes (like VAT/GST) are calculated where applicable.</li>
            </ul>
          </div>
        </div>
      </section>

      

      <section className="container py-8 md:py-12">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-up">
          <div className="flex items-center gap-3">
            <ReceiptLongIcon className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold">Cancellations</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-black dark:text-white">
            <li>• Cancel anytime via your account dashboard or Stripe's customer portal.</li>
            <li>• Cancellation stops future charges; past payments remain as charged.</li>
          </ul>
          <div className="mt-6">
            <Link href="/support" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 hover:shadow-lg transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="container py-16 md:py-24 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Questions about billing?
          </h3>
          <p className="mt-3 text-black dark:text-white max-w-2xl mx-auto">
            We're here to help with invoices, taxes, billing questions, or plan changes.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105">
              See Pricing
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 hover:scale-110 hover:shadow-lg transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />
    </div>
  );
}

