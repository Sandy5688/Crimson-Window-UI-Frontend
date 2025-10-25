"use client";
import { useState, useEffect } from "react";

export default function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasSeenOnboarding) {
      // Show after a short delay
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  function complete() {
    localStorage.setItem("onboarding_completed", "true");
    setShow(false);
  }

  function skip() {
    localStorage.setItem("onboarding_completed", "true");
    setShow(false);
  }

  if (!show) return null;

  const steps = [
    {
      icon: "🎉",
      title: "Welcome to CreatorFlow!",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={skip}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
        data-aos="zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{currentStep.icon}</div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {currentStep.title}
          </h2>
          <p className="text-black/70">{currentStep.description}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-[#2D89FF]" : "w-2 bg-black/20"}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={skip}
            className="flex-1 rounded-lg border border-black/20 px-4 py-3 text-sm font-medium hover:bg-black/5"
          >
            Skip Tour
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95"
              style={{ backgroundColor: "#2D89FF" }}
            >
              Next
            </button>
          ) : currentStep.href ? (
            <a
              href={currentStep.href}
              onClick={complete}
              className="flex-1 text-center rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95"
              style={{ backgroundColor: "#4CAF50" }}
            >
              {currentStep.action || "Get Started"}
            </a>
          ) : (
            <button
              onClick={complete}
              className="flex-1 rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95"
              style={{ backgroundColor: "#4CAF50" }}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

