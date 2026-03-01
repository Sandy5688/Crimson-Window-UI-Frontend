"use client";
import { useState, useEffect } from "react";
import { getEmail } from "@/lib/auth";

// B6: localStorage key is now scoped to the user's email so different users
// on the same browser each get the tour exactly once. Dismiss is permanent.
const STORAGE_KEY = () => {
  const email = typeof window !== "undefined" ? (getEmail() || "anonymous") : "anonymous";
  return `onboarding_completed_${email}`;
};

export default function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(STORAGE_KEY());
    if (!hasSeenOnboarding) {
      // Show after a short delay so the dashboard content loads first
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function complete() {
    localStorage.setItem(STORAGE_KEY(), "true");
    setShow(false);
  }

  function skip() {
    localStorage.setItem(STORAGE_KEY(), "true");
    setShow(false);
  }

  if (!show) return null;

  const steps = [
    {
      icon: "🎉",
      title: "Welcome to Flowpload!",
      description: "Let's get you started with a quick tour of the platform. You can skip anytime.",
    },
    {
      icon: "🎧",
      title: "Connect Your Platforms",
      description: "Link your YouTube, Spotify, Apple Music, and other channels to start distributing content globally.",
      action: "Go to Channels",
      href: "/channels",
    },
    {
      icon: "📤",
      title: "Upload & Localize",
      description: "Upload your content once, and we'll automatically localize it for different languages and optimize it for each platform.",
      action: "Schedule Upload",
      href: "/uploads",
    },
    {
      icon: "📊",
      title: "Track Your Progress",
      description: "Monitor uploads, localization jobs, and platform performance all from your dashboard.",
      action: "View Dashboard",
      href: "/dashboard",
    },
  ];

  const currentStep = steps[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={skip}
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding tour"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-black/5 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{currentStep.icon}</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {currentStep.title}
          </h2>
          <p className="text-black/70 dark:text-white/70">{currentStep.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-[#2D89FF]" : "w-2 bg-black/20 dark:bg-white/20"
                }`}
            />
          ))}
        </div>

        {/* Step counter */}
        <p className="text-xs text-center text-black/40 dark:text-white/40 mb-4">
          Step {step + 1} of {steps.length}
        </p>

        <div className="flex gap-3">
          <button
            onClick={skip}
            className="flex-1 rounded-lg border border-black/20 dark:border-white/20 px-4 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 dark:text-white transition"
          >
            Skip Tour
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95 transition"
              style={{ backgroundColor: "#2D89FF" }}
            >
              Next →
            </button>
          ) : currentStep.href ? (
            <a
              href={currentStep.href}
              onClick={complete}
              className="flex-1 text-center rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95 transition"
              style={{ backgroundColor: "#4CAF50" }}
            >
              {currentStep.action || "Get Started"}
            </a>
          ) : (
            <button
              onClick={complete}
              className="flex-1 rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95 transition"
              style={{ backgroundColor: "#4CAF50" }}
            >
              Get Started 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
