"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

import LanguageIcon from "@mui/icons-material/Language";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function FeaturesPage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    {
      title: "Smart Localization",
      desc: "AI-powered localization that adapts phrasing and tone per region. Your content feels native everywhere.",
      Icon: LanguageIcon,
      color: "from-purple-500 to-pink-500",
      bullets: ["50+ languages", "Cultural phrasing", "Time-zone aware scheduling"]
    },
    {
      title: "Trend-Aware Optimization",
      desc: "Keep titles, tags and thumbnails aligned with live global trends for maximum visibility.",
      Icon: TrendingUpIcon,
      color: "from-blue-500 to-cyan-500",
      bullets: ["Live trend monitoring", "Smart hashtagging", "Title scoring"]
    },
    {
      title: "Multi-Platform Sync",
      desc: "One upload = instant presence everywhere. Publish to Audiomack, Spotify, Apple Music and more.",
      Icon: SyncAltIcon,
      color: "from-green-500 to-emerald-500",
      bullets: ["Single source workflow", "Reliable retries", "Platform-specific metadata"]
    },
    {
      title: "Voice Consistency",
      desc: "Maintain your creative style and brand voice across platforms and languages.",
      Icon: RecordVoiceOverIcon,
      color: "from-orange-500 to-red-500",
      bullets: ["Style guardrails", "Glossary support", "Reviewer workflows"]
    },
    {
      title: "Smart Testing",
      desc: "Run A/B tests on thumbnails and titles automatically and ship the winner.",
      Icon: AutoGraphIcon,
      color: "from-indigo-500 to-blue-500",
      bullets: ["Auto-switch winners", "CTR tracking", "Variant insights"]
    },
    {
      title: "Network Boost",
      desc: "Leverage global creator data to amplify reach and discoverability.",
      Icon: RocketLaunchIcon,
      color: "from-pink-500 to-rose-500",
      bullets: ["Audience lookalikes", "Timing optimization", "Content clusters"]
    },
    {
      title: "Gamified Growth",
      desc: "Insights and achievements that guide you to the next milestone, faster.",
      Icon: EmojiEventsIcon,
      color: "from-yellow-500 via-orange-500 to-red-500",
      bullets: ["Milestone tracking", "Actionable tips", "Weekly goals"]
    },
    {
      title: "Brand Safety",
      desc: "Consistency and control over tone, message and intent worldwide.",
      Icon: ShieldIcon,
      color: "from-teal-500 to-cyan-500",
      bullets: ["Approval flows", "Audit logs", "Policy templates"]
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
        <div className="container relative z-10 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-100/50 dark:bg-purple-900/30 backdrop-blur-md px-6 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow mb-6">
              ✨ Feature-Rich Platform
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Built for <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Modern Creators</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-black dark:text-white">
              Everything you need to scale your content globally, in one seamless workflow.
            </p>
            <div className="mt-8">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold text-white shadow-lg transition-all bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105">
                Get Started Free
                <RocketLaunchIcon className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-white">Powerful Features, One Platform</h2>
          <p className="mt-4 text-lg text-black dark:text-white">Everything you need to dominate every platform</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <Link key={f.title} href="/signup">
              <div
                onMouseEnter={() => setHoveredFeature(f.title)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative h-full flex flex-col rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 cursor-pointer overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={idx * 70}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-8 transition-opacity duration-300 bg-gradient-to-br ${f.color}`} />
                
                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                <div className="relative z-10">
                  {/* Icon with Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl text-white shadow-lg bg-gradient-to-br ${f.color} group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                      <f.Icon className="text-3xl" />
                    </div>
                    <ArrowForwardIcon className={`text-[#6C63FF] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-[#111827] dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300`}>
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#111827]/70 dark:text-white/70 group-hover:text-[#111827] dark:group-hover:text-white transition-colors duration-300">
                    {f.desc}
                  </p>

                  {/* Bullet Points with Animation */}
                  <ul className={`mt-4 space-y-2 transition-all duration-300 ${hoveredFeature === f.title ? 'opacity-100' : 'opacity-100'}`}>
                    {f.bullets.map((b, bulletIdx) => (
                      <li 
                        key={b} 
                        className="flex items-center gap-2 text-sm text-[#111827] dark:text-white/90 transform transition-all duration-300"
                        style={{
                          transitionDelay: hoveredFeature === f.title ? `${bulletIdx * 50}ms` : '0ms'
                        }}
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircleIcon className="text-white text-xs" />
                        </span>
                        <span className="group-hover:font-semibold transition-all duration-300">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-4 inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                    Explore Now
                    <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-t from-purple-400/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] dark:text-white">
              Why these features matter
            </h2>
            <p className="mt-4 text-lg text-black dark:text-white/70">
              CreatorFlow aligns your creative output with what audiences are searching for—across languages, platforms and cultures—while preserving your unique voice.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Reach audiences in 50+ countries without rework",
                "Boost CTR with automated A/B testing and optimization",
                "Publish everywhere reliably with one-click",
                "Stay on-brand with voice consistency and approvals",
              ].map((item, idx) => (
                <li key={item} className="group flex items-start gap-4 cursor-pointer transition-all duration-300 hover:translate-x-2" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <span className="mt-1 inline-flex h-3 w-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300" style={{ background: PRIMARY }} />
                  <span className="text-base md:text-lg text-[#111827] dark:text-white/90 group-hover:font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-4" data-aos="fade-up" data-aos-delay="400">
              <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Get Started Free
                <RocketLaunchIcon className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </Link>
              <Link href="/pricing" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-purple-600 border-2 border-purple-300 dark:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105">
                See Pricing
                <ArrowForwardIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="relative group" data-aos="fade-left">
            <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300" />
            <div className="relative rounded-2xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-white dark:bg-gray-800 p-6 shadow-2xl group-hover:shadow-[0_20px_60px_rgba(108,99,255,0.2)] group-hover:-translate-y-2 transition-all duration-300">
              <Image src="/hero-draw.png" alt="CreatorFlow Features" width={900} height={600} className="w-full h-auto rounded-xl group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 dark:from-purple-900 dark:via-pink-900 dark:to-purple-900 overflow-hidden py-24 md:py-32">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight" data-aos="fade-up">
            Ready to Go Global in Minutes?
          </h2>
          <p className="mt-6 text-xl text-white max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Join thousands of creators scaling their content across every major platform with CreatorFlow's powerful features.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-purple-600 bg-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Get Started Free
              <RocketLaunchIcon className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white border-2 border-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
              View Plans
              <ArrowForwardIcon className="w-6 h-6" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: "10", label: "Platform Integrations" },
              { number: "50+", label: "Supported Languages" },
              { number: "99.9%", label: "Uptime Guarantee" }
            ].map((stat, i) => (
              <div key={i} className="group text-white" data-aos="fade-up" data-aos-delay={300 + i * 100}>
                <div className="text-4xl sm:text-5xl font-extrabold group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-sm text-white mt-2 group-hover:text-white transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animate-pulse {
          animation: pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}


