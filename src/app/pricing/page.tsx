"use client";

import { useState} from "react"
import Link from "next/link";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function PricingPage() {

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/mo",
      features: ["2 video uploads", "1 podcast upload", "2 platforms accessible", "Auto-Reupload", "And More..."],
      popular: false,
      gradient: "from-gray-500 to-gray-700",
      icon: "🚀",
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mo",
      features: ["20 video uploads", "10 podcast upload", "Up to 5 platforms", "Auto-Reupload", "And More..."],
      popular: false,
      gradient: "from-blue-500 to-cyan-500",
      icon: "⚡",
    },
    {
      name: "Pro+",
      price: "$49",
      period: "/mo",
      features: ["Unlimited video uploads", "Unlimited podcast upload", "All 10 integrated platforms", "Auto-Reupload", "And More..."],
      popular: true,
      gradient: "from-purple-500 to-pink-500",
      icon: "👑",
    },
  ];

  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes. Plans are month-to-month with no lock-in." },
    { q: "Do you offer discounts?", a: "Annual and startup discounts are available." },
    { q: "Is there an enterprise plan?", a: "Yes. Custom SLAs, SSO, and onboarding." },
  ];

  return (
    <div className="bg-[#F9FAFB] dark:bg-gray-950 text-[#111827] dark:text-white relative">
      <MarketingNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-100/50 dark:bg-purple-900/30 backdrop-blur-md px-6 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow mb-6">
            💳 Simple & transparent
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Pricing that scales with you
          </h1>
          <p className="mt-5 text-lg md:text-xl text-black dark:text-white max-w-3xl mx-auto">
            Start free. Upgrade when you need more power, insights and scale.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {tiers.map((t, index) => (
            <div 
              key={t.name} 
              className={`group relative rounded-3xl border-2 ${t.popular ? 'border-purple-500 dark:border-purple-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${t.popular ? 'scale-105 lg:scale-110' : 'hover:scale-105'}`} 
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              {t.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                  <EmojiEventsIcon className="text-sm" />
                  Most Popular
                </div>
              )}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-4 bg-gradient-to-br ${t.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {t.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">{t.name}</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-extrabold text-[#111827] dark:text-white">{t.price}</span>
                <span className="text-lg text-[#111827]/60 dark:text-white/60 pb-2">{t.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-base text-[#111827] dark:text-white/90">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${t.gradient}`}>
                      <CheckCircleIcon className="text-white text-sm" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup" 
                className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 ${t.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/50' : `bg-gradient-to-r ${t.gradient}`}`}
              >
                <span>Get Started</span>
                <RocketLaunchIcon className="text-sm group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-8 md:p-10 shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold">What’s included</h3>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              "Localization in 50+ languages",
              "Trend-aware metadata optimization",
              "A/B testing for titles and thumbnails",
              "Multi-platform publishing",
              "Team workspaces (Pro+)",
              "Advanced analytics (Pro+)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full text-white text-xs" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>✓</span>
                <span className="text-sm text-[#111827] dark:text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold text-center">Billing FAQ</h3>
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <button
                key={i}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full text-left rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500 group cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={i * 50}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-[#111827] dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {f.q}
                    </h4>
                    
                    {/* Expandable Answer */}
                    <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === i ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                      <p className="text-base text-[#111827]/70 dark:text-white/70 leading-relaxed">
                        {f.a}
                      </p>
                      <Link href="/signup" onClick={(e) => e.stopPropagation()} className="mt-4 inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                        Ready to get started? <span>→</span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Toggle Icon */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center transition-all duration-300 transform ${expandedFaq === i ? 'rotate-180' : ''} group-hover:scale-110`}>
                    <span className="text-sm font-bold">+</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />
    </div>
  );
}


