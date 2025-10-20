"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PublicIcon from "@mui/icons-material/Public";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MicIcon from "@mui/icons-material/Mic";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const PRIMARY = "#6C63FF";
const ACCENT = "#FF6584";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#blog", label: "Blog" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow bg-white/90 backdrop-blur ${isScrolled ? "shadow-sm" : "shadow-none"}`}>
      <div className="container flex items-center justify-between h-16">
        <Link href="#home" className="font-semibold text-lg tracking-tight text-[#111827]" aria-label="CreatorFlow - Home">
          CreatorFlow
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[#111827]/80 hover:text-[#111827] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/signup" className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition-all" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
            Start for Free
          </Link>
        </div>
        <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5" aria-label="Toggle menu" onClick={() => setIsOpen((v) => !v)}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden border-t border-black/10 bg-white" data-aos="fade-down">
          <div className="container py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-[#111827]" onClick={() => setIsOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link href="/signup" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition-all" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
              Start for Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-[600px] bg-black"
      style={{ minHeight: "650px" }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        src="https://cdn.pixabay.com/video/2023/09/02/178826-860734645_large.mp4"
        aria-hidden="true"
      />
      {/* Blend + Backdrop: dark for legibility */}
      <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-20 container grid lg:grid-cols-2 gap-10 items-center py-20 mb-48 min-h-[600px]">
        <div data-aos="fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-[#111827]/70 shadow-sm">
            <span className="h-2 w-2 rounded-full" style={{ background: PRIMARY }} />
            Creator automation for global reach
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Upload Once. Speak Every Language. Rank Everywhere.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/90 drop-shadow">
            Transform your videos, podcasts, and posts into global hits — automatically localized, trend-tuned, and adapted for every audience.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3" data-aos="zoom-in">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
            >
              <span>🚀 Start for Free</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-white/10 border border-white/30 hover:bg-white/20 transition-colors"
            >
              <PlayCircleOutlineIcon />
              <span>See How It Works</span>
            </a>
          </div>
        </div>
        <div className="relative flex justify-center items-center" data-aos="zoom-in">
          <div className="absolute -inset-16 -z-10 bg-gradient-to-tr from-[#6C63FF20] to-[#FF658420] blur-3xl" />
          <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-xl backdrop-blur">
            <Image src="/hero-draw.png" alt="Hero illustration" width={800} height={600} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="bg-white" data-aos="fade-up">
      <div className="container py-16 grid lg:grid-cols-2 gap-10 items-center mb-48">
        <div data-aos="fade-right">
          <blockquote className="text-xl sm:text-2xl leading-relaxed text-[#111827]">
            “Creators waste hours reposting the same content across platforms. Our Australian-built software automates it — reuploads, localizes, and schedules everything for you.”
          </blockquote>
        </div>
        <div className="relative" data-aos="fade-left">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg">
            <Image src="/problem-draw.png" alt="Tired creator illustration" width={640} height={420} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Upload Once",
      desc: "Drop your video or paste a link",
      Icon: CloudUploadIcon,
    },
    {
      num: "2",
      title: "We Optimize It",
      desc: "Smart titles, tags & metadata for every region",
      Icon: AutoFixHighIcon,
    },
    {
      num: "3",
      title: "Distribute Everywhere",
      desc: "Instantly published to all connected channels",
      Icon: PublicIcon,
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#F9FAFB]">
      <div className="container py-20 mb-48">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] text-center">How It Works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ num, title, desc, Icon }, i) => (
            <div key={title} className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl" data-aos="zoom-in" data-aos-delay={i * 100}>
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold shadow" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
                  {num}
                </span>
                <Icon className="text-[#6C63FF]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#111827]">{title}</h3>
              <p className="mt-1 text-sm text-[#111827]/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { Icon: LanguageIcon, title: "Smart Localization", desc: "Adapts phrasing and tone per region for natural reach." },
    { Icon: TrendingUpIcon, title: "Trend-Aware Optimization", desc: "Keeps your uploads aligned with live global trends." },
    { Icon: RecordVoiceOverIcon, title: "Voice Consistency", desc: "Maintains your creative style across platforms." },
    { Icon: SyncAltIcon, title: "Multi-Platform Sync", desc: "One upload = instant presence everywhere." },
    { Icon: AutoGraphIcon, title: "Smart Testing", desc: "Continuously tests thumbnails & titles for better results." },
    { Icon: RocketLaunchIcon, title: "Creator Network Boost", desc: "Learns from global data to amplify reach." },
    { Icon: EmojiEventsIcon, title: "Gamified Growth", desc: "Rewards you for milestones & audience expansion." },
    { Icon: ShieldIcon, title: "Brand Safety Layer", desc: "Keeps tone, message, and intent consistent worldwide." },
  ];

  return (
    <section id="features" className="bg-white">
      <div className="container py-20 mb-48">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] text-center">Built for Modern Creators</h2>
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, desc }, i) => (
            <div key={title} className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl" data-aos="zoom-in" data-aos-delay={i * 60}>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
                  <Icon />
                </div>
                <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-[#111827]/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const bullets = [
    "Feels native in every market",
    "Real-time trend awareness",
    "Proven 25–50% CTR boost",
    "Zero setup friction",
  ];

  return (
    <section className="bg-[#F9FAFB]" data-aos="fade-in">
      <div className="container py-20 mb-48">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] text-center max-w-3xl mx-auto">
          Because our software doesn’t just distribute — it understands audiences.
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircleIcon className="mt-0.5 text-[#6C63FF]" />
              <span className="text-[#111827]">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    { Icon: MovieFilterIcon, title: "Video Creators", desc: "Localized thumbnails & hashtags" },
    { Icon: MusicNoteIcon, title: "Musicians", desc: "Multilingual metadata & region-aware drops" },
    { Icon: MicIcon, title: "Podcasters", desc: "Auto-transcripts & cultural phrasing" },
    { Icon: WorkspacesIcon, title: "Agencies", desc: "Multi-client scheduling & analytics" },
  ];
  return (
    <section className="bg-white">
      <div className="container py-20 mb-48">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] text-center">Who It’s For</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map(({ Icon, title, desc }, i) => (
            <div key={title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl" data-aos="zoom-in" data-aos-delay={i * 80}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
                <Icon />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111827]">{title}</h3>
              <p className="mt-1 text-sm text-[#111827]/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Basic",
      price: "$19",
      period: "/mo",
      features: ["Up to 5 channels", "Basic localization", "Scheduled posting", "Email support"],
      popular: false,
    },
    {
      name: "Standard",
      price: "$49",
      period: "/mo",
      features: ["Up to 20 channels", "Trend-aware optimization", "A/B testing", "Priority support"],
      popular: true,
    },
    {
      name: "Premium",
      price: "$99",
      period: "/mo",
      features: ["Unlimited channels", "Advanced analytics", "Team workspaces", "Dedicated manager"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-[#F9FAFB]">
      <div className="container py-20 mb-48">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] text-center">Not Sure Which Plan Is For You?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`relative rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`} data-aos="zoom-in">
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#111827]">{t.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold text-[#111827]">{t.price}</span>
                <span className="text-sm text-[#111827]/60">{t.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#111827]">
                    <CheckCircleIcon className="text-[#6C63FF]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.01]" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
                Start for Free
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-white" data-aos="fade-up">
      <div className="container py-20 text-center mb-36">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">Go Global in Minutes — Not Months.</h2>
        <div className="mt-6 flex items-center justify-center">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]" style={{ backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}>
            <span>🌎 Start for Free</span>
          </Link>
        </div>
        <p className="mt-3 text-sm text-[#111827]/70">No credit card required. Cancel anytime.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[#F9FAFB] border-t border-black/10">
      <div className="container py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="font-semibold text-[#111827]">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80">
            <li><a href="#" className="hover:text-[#111827]">About</a></li>
            <li><a href="#blog" className="hover:text-[#111827]">Blog</a></li>
            <li><a href="#" className="hover:text-[#111827]">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827]">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80">
            <li><a href="#pricing" className="hover:text-[#111827]">Pricing</a></li>
            <li><a href="#" className="hover:text-[#111827]">Docs</a></li>
            <li><a href="#" className="hover:text-[#111827]">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827]">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80">
            <li><a href="#features" className="hover:text-[#111827]">Localization</a></li>
            <li><a href="#features" className="hover:text-[#111827]">Optimization</a></li>
            <li><a href="#features" className="hover:text-[#111827]">Analytics</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827]">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80">
            <li>Email: hello@creatorflow.app</li>
            <li>Phone: +61 400 000 000</li>
            <li>Address: Sydney, Australia</li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="text-[#111827]/70 hover:text-[#111827]"><FacebookIcon /></a>
            <a href="#" aria-label="Twitter" className="text-[#111827]/70 hover:text-[#111827]"><TwitterIcon /></a>
            <a href="#" aria-label="LinkedIn" className="text-[#111827]/70 hover:text-[#111827]"><LinkedInIcon /></a>
            <a href="#" aria-label="Instagram" className="text-[#111827]/70 hover:text-[#111827]"><InstagramIcon /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10">
        <div className="container py-6 text-center text-sm text-[#111827]/70">
          <p>Proudly Australian-Built Software for Global Creators.</p>
          <p className="mt-1">© 2025 CreatorFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="bg-[#F9FAFB] text-[#111827] ">
      <Header />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <WhyChooseUs />
      <UseCases />
      <Pricing />
      <FinalCTA />
      <Footer />
      <div id="blog" className="sr-only" />
    </div>
  );
}
