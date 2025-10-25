"use client";
import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

type PlanData = { plan: any; usage: any; channelCount: number; channelLimit: number };

type Tier = {
  name: string;
  price: string;
  period: string;
  priceId: string | null;
  annualPriceId?: string | null;
  slug: string;
  popular?: boolean;
  features: Array<{ text: string; included: boolean; tooltip?: string; annual?: boolean }>;
};

// Helper function to transform API plans to frontend tier format
function transformPlanToTier(plan: any): Tier {
  const videoQuota = plan.videoQuota || 0;
  const podcastQuota = plan.podcastQuota || 0;
  const channelLimit = plan.channelLimit || 0;
  const features = plan.features || {};
  
  // Build features array based on plan data
  const featuresList: Array<{ text: string; included: boolean; tooltip?: string; annual?: boolean }> = [];
  
  // Upload limits
  if (plan.slug === 'free') {
    featuresList.push({ text: "2 video uploads / month", included: true });
    featuresList.push({ text: "1 podcast upload / month", included: true });
  } else if (plan.slug === 'pro') {
    featuresList.push({ text: "20 video uploads / month", included: true });
    featuresList.push({ text: "10 podcast uploads / month", included: true });
  } else if (plan.slug === 'pro_plus') {
    featuresList.push({ text: "Unlimited video uploads", included: true, tooltip: "Subject to fair use" });
    featuresList.push({ text: "Unlimited podcast uploads", included: true, tooltip: "Subject to fair use" });
  }
  
  // Platform/Channel limits
  if (channelLimit === 2) {
    featuresList.push({ text: "2 platforms accessible", included: true, tooltip: "Choose any 2 platforms" });
  } else if (channelLimit === 5) {
    featuresList.push({ text: "Up to 5 platforms", included: true, tooltip: "Choose any 5 platforms" });
  } else if (channelLimit >= 10) {
    featuresList.push({ text: "All 10 integrated platforms", included: true });
  }
  
  // Standard features
  featuresList.push({ text: "Auto-Reupload", included: !!features.autoReupload });
  
  // Localization
  if (features.localization === 'basic') {
    featuresList.push({ text: "Localization (Basic)", included: true, tooltip: "Title and tag only" });
  } else if (features.localization === 'advanced') {
    featuresList.push({ text: "Localization (Advanced)", included: true, tooltip: "Titles and subtitles" });
  } else if (features.localization === 'full') {
    featuresList.push({ text: "Localization (Full)", included: true, tooltip: "AI translation + SEO suggestions" });
  } else {
    featuresList.push({ text: "Localization", included: false });
  }
  
  // Analytics
  if (features.analytics === 'basic') {
    featuresList.push({ text: "Analytics Dashboard (Basic)", included: true, tooltip: "Basic metrics" });
  } else if (features.analytics === 'partial') {
    featuresList.push({ text: "Analytics (Partial)", included: true, tooltip: "Partial analytics" });
  } else if (features.analytics === 'full') {
    featuresList.push({ text: "Analytics (Full)", included: true, tooltip: "Full analytics & recommendations" });
  } else {
    featuresList.push({ text: "Analytics", included: false });
  }
  
  // AI Optimization
  if (features.aiOptimization === 'basic') {
    featuresList.push({ text: "AI Optimization (Basic)", included: true, tooltip: "Basic suggestions" });
  } else if (features.aiOptimization === 'full') {
    featuresList.push({ text: "AI Optimization (Full)", included: true, tooltip: "Full AI optimization" });
  } else {
    featuresList.push({ text: "AI Optimization", included: !!features.aiOptimization });
  }
  
  // Watermark
  featuresList.push({ text: "Remove Watermark", included: !plan.hasWatermark });
  
  // Support
  if (features.prioritySupport === 'standard') {
    featuresList.push({ text: "Priority Support (Standard email)", included: true });
  } else if (features.prioritySupport === 'priority') {
    featuresList.push({ text: "Priority Support (Priority email)", included: true });
  } else {
    featuresList.push({ text: "Priority Support", included: !!features.prioritySupport });
  }
  
  // Always included
  featuresList.push({ text: "100% creator royalty", included: true });
  
  // Annual discount info
  if (plan.annualPriceId) {
    featuresList.push({ text: "Annual: 2 months free", included: true, annual: true });
  }
  
  return {
    name: plan.name,
    price: plan.price,
    period: "/month",
    priceId: plan.priceId,
    annualPriceId: plan.annualPriceId,
    slug: plan.slug,
    popular: plan.slug === 'pro', // Pro plan is most popular
    features: featuresList,
  };
}

export default function MonetizationPage() {
  const { data: planData, mutate: mutatePlan } = useSWR<PlanData>("/api/v1/billing/plan", fetcher);
  const { data: plansResponse, error: plansError } = useSWR<{ plans: any[] }>("/api/v1/plans", fetcher);
  const [busy, setBusy] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  // Transform API plans to tier format
  const TIERS: Tier[] = plansResponse?.plans?.map(transformPlanToTier) || [];

  async function checkout(priceId: string) {
    setBusy(true);
    try {
      const successUrl = window.location.origin + "/monetization?success=1";
      const cancelUrl = window.location.href;
      const { data } = await api.post("/api/v1/billing/checkout", { priceId, successUrl, cancelUrl });
      window.location.href = data.url;
    } catch (error: any) {
      let errorMsg = 'Failed to create checkout session';
      
      // Extract error message properly
      if (error.response?.data?.error) {
        const err = error.response.data.error;
        errorMsg = typeof err === 'string' ? err : JSON.stringify(err);
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`Error: ${errorMsg}`);
    } finally {
      setBusy(false);
    }
  }

  async function openPortal() {
    setBusy(true);
    try {
      const returnUrl = window.location.href;
      const { data } = await api.post("/api/v1/billing/portal", { returnUrl });
      window.location.href = data.url;
    } catch (error: any) {
      let errorMsg = 'Failed to open billing portal';
      
      // Extract error message properly
      if (error.response?.data?.error) {
        const err = error.response.data.error;
        errorMsg = typeof err === 'string' ? err : JSON.stringify(err);
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`Error: ${errorMsg}`);
    } finally {
      setBusy(false);
    }
  }

  const currentPlanSlug = planData?.plan?.slug || "free";

  // Calculate prices based on billing cycle
  const getPrice = (tier: Tier) => {
    if (tier.price === "$0") return tier.price;
    if (!isAnnual) return tier.price;
    
    // Annual pricing with 2 months free (10 months price)
    const monthlyPrice = parseInt(tier.price.replace("$", ""));
    const annualPrice = monthlyPrice * 10; // 2 months free = 10 months price
    return `$${annualPrice}`;
  };

  const getPeriod = () => {
    return isAnnual ? "/year" : "/month";
  };

  // Get the correct price ID based on billing cycle
  const getPriceId = (tier: Tier) => {
    if (isAnnual && tier.annualPriceId) {
      return tier.annualPriceId;
    }
    return tier.priceId;
  };

  // Show loading state while fetching plans
  if (!plansResponse && !plansError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Plans & Pricing
          </h1>
          <p className="text-black/60 dark:text-white/60 mt-2">Loading pricing information...</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-md animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state if plans fail to load
  if (plansError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Plans & Pricing
          </h1>
          <p className="text-red-500 mt-2">Failed to load pricing plans. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
        <div data-aos="fade-down" className="text-center relative">
          <div className="absolute -inset-10 bg-gradient-to-r from-[#2D89FF]/10 via-[#4CAF50]/10 to-[#FF6B35]/10 rounded-full blur-3xl opacity-40"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold dark:text-white bg-gradient-to-r from-[#2D89FF] via-[#4CAF50] to-[#FF6B35] bg-clip-text text-transparent mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Plans & Pricing
            </h1>
            <p className="text-black/60 dark:text-white/60 text-lg max-w-2xl mx-auto">Choose the perfect plan to grow your content empire 🚀</p>
          </div>
        </div>

        {/* Annual Billing Toggle */}
        <div data-aos="fade-up" data-aos-delay="100" className="flex justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-full border border-black/10 dark:border-white/10 p-1 inline-flex items-center gap-2">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? "bg-[#2D89FF] text-white" 
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isAnnual 
                  ? "bg-[#2D89FF] text-white" 
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-[#4CAF50] text-white px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Current Plan Overview */}
        {planData && (
          <div data-aos="fade-up" data-aos-delay="200" className="relative bg-white dark:bg-gray-900 rounded-3xl border-2 border-black/5 dark:border-white/10 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2D89FF]/5 to-[#4CAF50]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] bg-clip-text text-transparent relative z-10" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📊 Current Plan
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm relative z-10">
              <div className="bg-gradient-to-br from-[#2D89FF]/10 to-[#2D89FF]/5 rounded-xl p-4 border border-[#2D89FF]/20 hover:scale-105 transition-transform duration-200">
                <div className="text-black/60 dark:text-white/60 text-xs mb-1">📦 Plan</div>
                <div className="text-2xl font-bold" style={{ color: "#2D89FF" }}>
                  {planData.plan?.slug || "Free"}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#FFB400]/10 to-[#FFB400]/5 rounded-xl p-4 border border-[#FFB400]/20 hover:scale-105 transition-transform duration-200">
                <div className="text-black/60 dark:text-white/60 text-xs mb-1">📤 Uploads This Month</div>
                <div className="text-2xl font-bold" style={{ color: "#FFB400" }}>
                  {planData.usage?.uploadsUsed ?? 0} / {planData.plan?.uploadQuota ?? 2}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5 rounded-xl p-4 border border-[#4CAF50]/20 hover:scale-105 transition-transform duration-200">
                <div className="text-black/60 dark:text-white/60 text-xs mb-1">🔗 Platforms Connected</div>
                <div className="text-2xl font-bold" style={{ color: "#4CAF50" }}>
                  {planData.channelCount ?? 0} / {planData.channelLimit ?? 2}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 relative z-10">
              <button
                disabled={busy}
                onClick={openPortal}
                className="flex-1 rounded-xl border-2 border-[#2D89FF]/30 px-6 py-3 text-sm font-semibold text-[#2D89FF] hover:bg-[#2D89FF] hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                💳 Manage Billing
              </button>
              <button
                onClick={() => mutatePlan()}
                className="rounded-xl border-2 border-black/10 dark:border-white/10 px-6 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        )}

        {/* Pricing Table */}
        <div className="grid md:grid-cols-3 gap-8">
          {TIERS.map((tier, idx) => {
            const isCurrent = tier.slug === currentPlanSlug;
            return (
              <div
                key={tier.slug}
                data-aos="fade-up"
                data-aos-delay={idx * 100 + 300}
                className={`relative bg-white dark:bg-gray-900 rounded-3xl border-2 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group ${
                  tier.popular ? "border-[#2D89FF] border-3 transform scale-105" : "border-black/5 dark:border-white/10"
                }`}
              >
                {/* Gradient background effect for popular */}
                {tier.popular && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#2D89FF] via-[#4CAF50] to-[#2D89FF] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                )}
                
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg animate-pulse" style={{ background: "linear-gradient(135deg, #FFB400 0%, #FF6B35 100%)" }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                
                <div className="relative z-10">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {tier.name}
                  </h3>
                  <div className="text-4xl font-bold" style={{ color: "#2D89FF" }}>
                    {getPrice(tier)}
                    <span className="text-lg font-normal text-black/60 dark:text-white/60">{getPeriod()}</span>
                  </div>
                  {isAnnual && tier.price !== "$0" && (
                    <div className="text-xs text-[#4CAF50] font-medium mt-1">
                      Save 2 months (billed annually)
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.filter((feat: any) => !feat.annual).map((feat: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm" title={feat.tooltip || ""}>
                      {feat.included ? (
                        <span className="text-green-600 font-bold">✅</span>
                      ) : (
                        <span className="text-red-500 font-bold">❌</span>
                      )}
                      <span className={feat.included ? "text-black/80 dark:text-white/80" : "text-black/40 dark:text-white/40"}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-lg px-4 py-3 text-sm font-bold text-white opacity-60"
                    style={{ backgroundColor: "#2D89FF" }}
                  >
                    Current Plan
                  </button>
                ) : getPriceId(tier) ? (
                  <button
                    disabled={busy}
                    onClick={() => checkout(getPriceId(tier)!)}
                    className="w-full rounded-lg px-4 py-3 text-sm font-bold text-white hover:brightness-95 disabled:opacity-50"
                    style={{ 
                      backgroundColor: 
                        tier.slug === 'pro' ? "#4CAF50" : // Green for Pro
                        tier.slug === 'pro_plus' ? "#FF6B35" : // Orange for Pro+
                        "#2D89FF" // Blue for Free
                    }}
                  >
                    Upgrade to {tier.name}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-lg px-4 py-3 text-sm font-bold border border-black/20 dark:border-white/20 text-black/60 dark:text-white/60"
                  >
                    Current Plan
                  </button>
                )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6" data-aos="fade-up" data-aos-delay="600">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-black/5 dark:border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-xl font-bold mb-3 dark:text-white relative z-10 flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <span className="text-2xl">⚖️</span> Fair Use Policy
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70 relative z-10 leading-relaxed">
              Unlimited plans are subject to fair use. We trust you to use our service reasonably. 
              Excessive usage that impacts service quality may be reviewed. We're here to support creators, not limit them! 🚀
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-black/5 dark:border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-xl font-bold mb-3 dark:text-white relative z-10 flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <span className="text-2xl">✅</span> Cancel Anytime
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70 relative z-10 leading-relaxed">
              No long-term contracts or hidden fees. Cancel your subscription anytime from the billing portal. 
              Your access continues until the end of your billing period.
            </p>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="700" className="relative bg-gradient-to-br from-[#2D89FF]/5 to-[#4CAF50]/5 rounded-2xl border-2 border-[#2D89FF]/20 p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D89FF]/5 via-transparent to-[#4CAF50]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-2xl font-bold mb-3 dark:text-white relative z-10 flex items-center gap-2 bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] bg-clip-text text-transparent" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <span className="text-3xl">💬</span> Need Help?
          </h3>
          <p className="text-base text-black/70 dark:text-white/70 mb-4 relative z-10 leading-relaxed">
            Have questions about billing or plans? We're here to help!
          </p>
          <div className="flex flex-wrap gap-3 relative z-10">
            <a href="/support" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D89FF] text-white font-medium hover:bg-[#2D89FF]/90 hover:scale-105 transition-all duration-200">
              📞 Support Page
            </a>
            <a href="/billing-policy" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#2D89FF] text-[#2D89FF] font-medium hover:bg-[#2D89FF] hover:text-white hover:scale-105 transition-all duration-200">
              📄 Billing Policy
            </a>
          </div>
        </div>
    </div>
  );
}
