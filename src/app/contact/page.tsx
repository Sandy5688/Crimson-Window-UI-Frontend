"use client";

import { useState } from "react";
import Link from "next/link";
import CookieConsent from "@/components/CookieConsent";
import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";
import { api } from "@/lib/api";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      const response = await api.post('/api/v1/contact', {
        name: `${firstName} ${lastName}`,
        email,
        subject,
        message,
      });

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data.message || 'Failed to send message');
      }
    } catch (err: any) {
      console.error('Contact form error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again or email us directly at hello@creatorflow.app');
    } finally {
      setLoading(false);
    }
  }

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
            💬 We’re here to help
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Contact CreatorFlow
          </h1>
          <p className="mt-5 text-lg md:text-xl text-black dark:text-white max-w-3xl mx-auto">
            Questions about pricing, onboarding or features? Get in touch and we’ll respond promptly.
          </p>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-8 shadow-sm" data-aos="fade-right">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-700 dark:text-red-300">
                <ErrorIcon />
                <div>
                  <p className="font-semibold">Error sending message</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            )}
            {!submitted ? (
              <form
                className="mt-6 space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#111827]/70 dark:text-white/70">First name</label>
                    <input 
                      name="firstName"
                      required 
                      disabled={loading}
                      className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#111827]/70 dark:text-white/70">Last name</label>
                    <input 
                      name="lastName"
                      required 
                      disabled={loading}
                      className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#111827]/70 dark:text-white/70">Email</label>
                  <input 
                    name="email"
                    type="email" 
                    required 
                    disabled={loading}
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-[#111827]/70 dark:text-white/70">Subject</label>
                  <input 
                    name="subject"
                    disabled={loading}
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-[#111827]/70 dark:text-white/70">Message</label>
                  <textarea 
                    name="message"
                    required 
                    rows={6} 
                    disabled={loading}
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <RocketLaunchIcon className="text-sm" />
                </button>
              </form>
            ) : (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-green-700 dark:text-green-300">
                <CheckCircleIcon />
                <div>
                  <p className="font-semibold">Thanks! Your message has been received.</p>
                  <p className="text-sm opacity-80">We’ll get back to you shortly.</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 p-8 shadow-sm" data-aos="fade-left">
            <h2 className="text-2xl font-bold">Contact information</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <EmailIcon className="text-purple-600 dark:text-purple-400" />
                <span>hello@creatorflow.app</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <PhoneIcon className="text-purple-600 dark:text-purple-400" />
                <span>+61 400 000 000</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <PlaceIcon className="text-purple-600 dark:text-purple-400" />
                <span>Sydney, Australia</span>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F9FAFB] dark:bg-gray-900 p-6">
              <h3 className="font-semibold">Need support?</h3>
              <p className="mt-1 text-sm text-[#111827]/70 dark:text-white/70">
                Visit our support center to browse FAQs or open a ticket.
              </p>
              <div className="mt-4">
                <Link href="/support" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow bg-gradient-to-r from-purple-600 to-pink-600">
                  Go to Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <CookieConsent />
    </div>
  );
}


