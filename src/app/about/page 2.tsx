"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PublicIcon from "@mui/icons-material/Public";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InsightsIcon from "@mui/icons-material/Insights";
import LanguageIcon from "@mui/icons-material/Language";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function AboutPage() {
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  
  const values = [
    { Icon: PublicIcon, title: "Global-first", desc: "We build for creators with audiences in every country." },
    { Icon: InsightsIcon, title: "Outcome-driven", desc: "We measure success by reach, engagement and growth." },
    { Icon: LanguageIcon, title: "Culturally aware", desc: "Localization that respects phrasing, tone and context." },
    { Icon: FavoriteIcon, title: "Creator-obsessed", desc: "We ship features that remove friction, not add it." },
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
            🇦🇺 Proudly Australian-Built
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            About CreatorFlow
          </h1>
          <p className="mt-5 text-lg md:text-xl text-black dark:text-white max-w-3xl mx-auto">
            We help creators go global in minutes—not months. One upload, localized and distributed everywhere.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold">Our mission</h2>
            <p className="mt-4 text-black dark:text-white">
              Build the world's most effective platform for creators to reach audiences across languages, platforms and cultures—while preserving each creator's unique voice.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Automation that saves hours of manual work",
                "Localization that feels native to every market",
                "Optimization guided by live trends and data",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full" style={{ background: PRIMARY }} />
                  <span className="text-sm md:text-base text-[#111827] dark:text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 hover:shadow-lg transition-all">
                How it works
                <RocketLaunchIcon className="text-sm" />
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-white dark:bg-gray-800 p-6 shadow-2xl">
              <Image src="/hero-draw.png" alt="CreatorFlow mission" width={900} height={600} className="w-full h-auto rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <h3 className="text-2xl font-extrabold text-center mb-8">Our values</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={v.title} className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm" data-aos="fade-up" data-aos-delay={i * 60}>
              <div className="inline-flex items-center justify-center p-3 rounded-xl text-white shadow bg-gradient-to-br from-purple-500 to-pink-500">
                <v.Icon />
              </div>
              <h4 className="mt-3 font-bold">{v.title}</h4>
              <p className="mt-1 text-sm text-black dark:text-white">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-extrabold">Built by creators, for creators</h3>
            <p className="mt-3 text-lg text-black dark:text-white">Our team combines deep expertise in localization, automation, and creator growth strategies.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Localization Experts",
                desc: "Native speakers across 50+ languages who understand cultural nuance beyond translation.",
                items: ["Cultural adaptation strategies", "Regional trend analysis", "Multilingual metadata optimization"]
              },
              {
                title: "Creator Growth Specialists",
                desc: "Former creators and growth strategists who've scaled channels to millions of followers.",
                items: ["A/B testing frameworks", "Audience engagement tactics", "Platform algorithm insights"]
              },
              {
                title: "Platform Engineers",
                desc: "Builders with experience integrating YouTube, Audiomack, Apple Music and 10+ major platforms.",
                items: ["API integrations", "Real-time distribution", "Automated publishing pipelines"]
              },
              {
                title: "Data Scientists",
                desc: "Analytics experts who turn viewer behavior into actionable insights and recommendations.",
                items: ["Predictive analytics", "Trend detection", "Performance forecasting"]
              }
            ].map((expertise, i) => (
              <div 
                key={expertise.title}
                onClick={() => setSelectedExpertise(selectedExpertise === expertise.title ? null : expertise.title)}
                className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
                  selectedExpertise === expertise.title
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg scale-105"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500"
                }`}
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <div className="p-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-white shadow transition-all duration-300 ${
                    selectedExpertise === expertise.title
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 scale-125"
                      : "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110"
                  }`}>
                    <span className="text-lg font-bold">{i + 1}</span>
                  </div>
                  <h4 className={`mt-4 text-lg font-bold transition-colors duration-300 ${
                    selectedExpertise === expertise.title
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-[#111827] dark:text-white"
                  }`}>{expertise.title}</h4>
                  <p className={`mt-2 text-sm transition-all duration-300 ${
                    selectedExpertise === expertise.title
                      ? "text-purple-900/80 dark:text-purple-200"
                      : "text-[#111827]/70 dark:text-white/70"
                  }`}>{expertise.desc}</p>
                  
                  {/* Items - expandable on click */}
                  <div className={`mt-4 overflow-hidden transition-all duration-300 ${
                    selectedExpertise === expertise.title ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <ul className="space-y-2 pt-4 border-t border-purple-200/50 dark:border-purple-500/30">
                      {expertise.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-[#111827]/70 dark:text-white/70 animate-in fade-in">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full mt-1.5" style={{ background: PRIMARY }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Click indicator */}
                  <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 transition-all duration-300 ${
                    selectedExpertise === expertise.title ? "opacity-0" : "opacity-100"
                  }`}>
                    Click to expand <span>↓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-2xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
            <p className="text-center text-[#111827] dark:text-white">
              <span className="font-bold text-lg">Our commitment:</span> We live and breathe creator growth. Every feature is built with feedback from the creators using CreatorFlow daily. We're not just building software—we're building the infrastructure for the next generation of global creators.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="container py-16 md:py-24 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Join us on our mission
          </h3>
          <p className="mt-3 text-[#111827]/70 dark:text-white/70 max-w-2xl mx-auto">
            We're hiring builders who care deeply about creator success and global reach.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />
    </div>
  );
}


