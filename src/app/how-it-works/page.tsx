"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PublicIcon from "@mui/icons-material/Public";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [hoveredIntegration, setHoveredIntegration] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [counts, setCounts] = useState([0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const steps = [
    {
      num: "1",
      title: "Upload Once",
      desc: "Drop your video or paste a link. We fetch everything we need automatically.",
      Icon: CloudUploadIcon,
      longDesc: "Simply upload your content or provide a link. Our system instantly recognizes the format and prepares it for global distribution.",
      color: "from-purple-500 to-pink-500",
    },
    {
      num: "2",
      title: "Optimize",
      desc: "CreatorFlow crafts localized titles, tags and descriptions aligned to trends.",
      Icon: AutoFixHighIcon,
      longDesc: "AI analyzes current trends across 50+ languages and generates platform-specific metadata that resonates with each audience.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      num: "3",
      title: "Distribute",
      desc: "Publish to YouTube, Audiomack, Apple Music and more—instantly and reliably.",
      Icon: PublicIcon,
      longDesc: "With a single click, your content goes live across all your connected platforms simultaneously.",
      color: "from-green-500 to-emerald-500",
    },
    {
      num: "4",
      title: "Analyze",
      desc: "A/B tests run automatically. Winners ship, insights flow back into your next upload.",
      Icon: AutoGraphIcon,
      longDesc: "Automatic testing and analytics give you actionable insights to improve your next release.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const integrations = [
    { name: "YouTube", color: "#FF0000", icon: "🎥" },
    { name: "Apple Music", color: "#FA243C", icon: "🎵" },
    { name: "Audiomack", color: "#E4405F", icon: "🎧" },
    { name: "Podchaser", color: "#7C3AED", icon: "🎙️" },
    { name: "iHeartRadio", color: "#C6002B", icon: "📻" },
    { name: "Spotify", color: "#1DB954", icon: "🎶" },
    { name: "SoundCloud", color: "#FF5500", icon: "☁️" },
    { name: "Amazon Music", color: "#FF9900", icon: "🎼" },
    { name: "Deezer", color: "#FF6600", icon: "💿" },
    { name: "TuneIn", color: "#14D8CC", icon: "📡" },
  ];

  const faqs = [
    { q: "Can I choose which platforms to publish to?", a: "Yes. Select platforms per upload or create reusable presets." },
    { q: "Do I keep control of my titles/thumbnails?", a: "Always. Approve or edit suggestions before publishing." },
    { q: "Is localization automatic?", a: "Yes—50+ languages supported with cultural phrasing and glossary support." },
    { q: "Is there a free trial?", a: "Yes. Start with our free tier (up to 2 uploads/month)" },
    { q: "How secure is my content?", a: "Bank-level encryption for all files. Your content stays yours—we never claim rights or use it for training." },
    { q: "How long does it take to distribute content?", a: "Your content goes live immediately after it's approved" },
    { q: "What file formats and sizes do you support?", a: "Automatic transcoding ensures compatibility across all platforms" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const targets = [15, 50, 500];
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setCounts(
              targets.map((target) => {
                if (target === 50) return Math.floor(progress * target);
                if (target === 15000) return Math.floor(progress * target);
                return Math.floor(progress * target);
              })
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div className="bg-[#F9FAFB] dark:bg-gray-950 text-[#111827] dark:text-white relative">
      <MarketingNav />

      <section className="relative overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-40"
          src="https://cdn.pixabay.com/video/2023/09/02/178826-860734645_large.mp4"
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/25 to-black/60" />
        <div className="relative z-20 container py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 py-2 text-sm font-semibold text-white shadow mb-6">
            🚀 End-to-end in minutes
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            How CreatorFlow Works
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            From upload to global distribution—automated, localized, and optimized for growth.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold text-purple-600 bg-white shadow-lg transition-all hover:scale-105">
              Start for Free
              <RocketLaunchIcon className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-white">The CreatorFlow Process</h2>
          <p className="mt-4 text-lg text-[#111827]/70 dark:text-white/70">Watch how your content transforms across every platform</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ num, title, desc, Icon, longDesc, color }, i) => (
            <Link key={title} href="/signup">
              <div 
                onMouseEnter={() => setActiveStep(title)}
                onMouseLeave={() => setActiveStep(null)}
                className="group relative h-full rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 cursor-pointer overflow-hidden"
                data-aos="zoom-in" 
                data-aos-delay={i * 100}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-8 transition-opacity duration-300 bg-gradient-to-br ${color}`} />
                
                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold shadow-lg bg-gradient-to-br ${color} group-hover:scale-125 group-hover:shadow-2xl transition-all duration-300`}>
                      {num}
                    </span>
                    <ArrowForwardIcon className={`text-[#6C63FF] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300`} />
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className={`text-5xl text-[#6C63FF] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold text-[#111827] dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300`}>
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm text-[#111827]/70 dark:text-white/70 group-hover:text-[#111827] dark:group-hover:text-white transition-colors duration-300">
                    {activeStep === title ? longDesc : desc}
                  </p>

                  {/* CTA */}
                  <div className="mt-4 inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                    Learn More
                    <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-t from-purple-400/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Connection Lines (desktop only) */}
        <div className="hidden lg:flex justify-center items-center mt-8 gap-2 text-[#6C63FF]/20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold">
              A simple flow—powerful outcomes
            </h2>
            <p className="mt-4 text-[#111827]/70 dark:text-white/70">
              Attach channels, pick your audience, and let CreatorFlow handle the rest. Approve suggestions and publish with one click.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Localized metadata crafted to feel native",
                "Platform-specific optimizations applied automatically",
                "A/B tests that run without extra work",
                "Insights that guide your next upload",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full" style={{ background: PRIMARY }} />
                  <span className="text-sm md:text-base text-[#111827] dark:text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-white dark:bg-gray-800 p-6 shadow-2xl">
              <Image src="/problem-draw.png" alt="Workflow" width={900} height={600} className="w-full h-auto rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24 overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h3 className="text-2xl md:text-4xl font-bold text-[#111827] dark:text-white">Connect to every major platform</h3>
            <p className="mt-3 text-lg text-[#111827]/70 dark:text-white/70">One upload, instant distribution across your entire creator ecosystem</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {integrations.map((p) => (
              <Link key={p.name} href="/signup">
                <div 
                  onMouseEnter={() => setHoveredIntegration(p.name)}
                  onMouseLeave={() => setHoveredIntegration(null)}
                  className="flex-shrink-0 w-56 h-40 rounded-3xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-white dark:bg-gray-800 shadow-xl flex flex-col items-center justify-center gap-3 group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  style={{ boxShadow: hoveredIntegration === p.name ? `0 20px 50px ${p.color}30` : `0 10px 40px ${p.color}20` }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: p.color }} />
                  
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 text-center">
                    <span className={`inline-block text-6xl transition-all duration-300 group-hover:scale-125 ${hoveredIntegration === p.name ? 'animate-bounce' : ''}`}>{p.icon}</span>
                    <span className={`text-xl font-bold transition-all duration-300 block mt-2`} style={{ color: hoveredIntegration === p.name ? p.color : '#111827' }}>
                      {p.name}
                    </span>
                    <div className={`text-xs font-semibold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1`}>
                      Connect Now →
                    </div>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" style={{ background: `radial-gradient(circle, ${p.color}40, transparent)` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h3 className="text-2xl md:text-4xl font-extrabold text-[#111827] dark:text-white">Frequently asked questions</h3>
            <p className="mt-3 text-lg text-[#111827]/70 dark:text-white/70">Everything you need to know about CreatorFlow</p>
          </div>
          
          <div className="space-y-4">
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

          {/* Trust Badge */}
          <div className="mt-12 text-center p-6 rounded-2xl border border-green-200/50 dark:border-green-500/30 bg-green-50/50 dark:bg-green-900/10">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-semibold">Still have questions? <Link href="/contact" className="underline hover:no-underline">Contact our team</Link></span>
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
            Ready to Transform Your Content?
          </h2>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Join thousands of creators who are scaling globally with CreatorFlow. Start for free today.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-purple-600 bg-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Get Started Free
              <RocketLaunchIcon className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white border-2 border-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
              Talk to Sales
              <ArrowForwardIcon className="w-6 h-6" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto" ref={statsRef}>
            {[
              { number: "15K+", label: "Active Creators", index: 0 },
              { number: "50+", label: "Supported Languages", index: 1 },
              { number: "2B+", label: "Videos Distributed", index: 2 }
            ].map((stat, i) => (
              <div key={i} className="text-white" data-aos="fade-up" data-aos-delay={300 + i * 100}>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {stat.index === 0 ? `${counts[0].toLocaleString()}K+` : ""}
                  {stat.index === 1 ? `${counts[1]}+` : ""}
                  {stat.index === 2 ? `${counts[2]}K+` : ""}
                </div>
                <div className="text-sm text-white/80 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
