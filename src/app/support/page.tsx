/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function SupportPage() {
  return (
    <div className="bg-[#F9FAFB] dark:bg-gray-950 text-[#111827] dark:text-white relative">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10 py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-100/50 dark:bg-purple-900/30 backdrop-blur-md px-6 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow mb-6">
            💬 Support Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Need help? We're here for you
          </h1>
          <p className="mt-4 text-lg text-black dark:text-white max-w-2xl mx-auto">
            Technical issue, billing question, or feedback — our team responds fast.
          </p>
        </div>
      </section>

      <div className="container pb-20 space-y-12">
        {/* Contact Form */}
        <section className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-8 md:p-12 shadow-sm">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">Contact us</h2>
            <p className="text-black dark:text-white mb-6">
              Fill out the form below and we’ll get back to you within 24–48 hours.
            </p>

            <form
              action="https://formsubmit.co/personalsandykumar@gmail.com"
              method="POST"
              className="space-y-5"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://yourdomain.com/thank-you" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#111827]/80 dark:text-white/80 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#111827]/80 dark:text-white/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#111827]/80 dark:text-white/80 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Tell us what’s going on..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Help Topics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Help topics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Connecting YouTube or Spotify accounts",
              "Uploading & localization issues",
              "Billing & plan upgrades",
              "Data deletion or privacy concerns",
            ].map((topic) => (
              <div
                key={topic}
                className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="absolute -inset-8 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition" />
                <div className="relative z-10">
                  <h3 className="font-semibold">{topic}</h3>
                  <p className="text-sm text-black dark:text-white mt-2">
                    Learn more about how to troubleshoot or manage this.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-8 md:p-12 shadow-sm">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Trust & safety</h2>
            <ul className="space-y-3 text-sm text-[#111827]/80 dark:text-white/80">
              <li>• We comply with GDPR and modern data-protection standards.</li>
              <li>• All data is encrypted in storage and transmitted via HTTPS.</li>
              <li>• If you believe your account was compromised, contact us immediately.</li>
            </ul>
            <div className="mt-8 flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 hover:shadow-lg transition-all"
              >
                ← Back to Home
              </Link>
              <Link
                href="/billing-policy"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 hover:scale-110 hover:shadow-lg transition-all"
              >
                Billing Policy
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <h3 className="text-xl md:text-2xl font-extrabold">Still need help?</h3>
          <p className="mt-2 text-black dark:text-white">
            Our team can assist with onboarding, billing, and technical issues.
          </p>
          <div className="mt-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105">
              Contact Us
            </Link>
          </div>
        </section>
      </div>

      <MarketingFooter />
      <CookieConsent />
    </div>
  );
}
