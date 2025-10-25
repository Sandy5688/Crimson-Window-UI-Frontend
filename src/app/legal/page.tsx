export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Legal & Compliance
          </h1>
          <p className="text-sm text-black/60 mb-8">Last updated: October 22, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🧩 Privacy & Data
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• We collect and store only essential information (name, email, connected channels, uploaded content metadata).</li>
              <li>• Used solely to deliver, improve, and personalize your experience.</li>
              <li>• Your tokens and credentials are securely stored (encrypted at rest).</li>
              <li>• We never sell your data.</li>
              <li>• You can request deletion anytime via support email.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📜 Terms of Service
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• You agree to use the platform for lawful purposes only.</li>
              <li>• Subscription renewals are handled automatically via Stripe.</li>
              <li>• Refunds follow our refund policy (see Billing Policy).</li>
              <li>• All content uploaded remains your intellectual property; by using our system, you grant temporary processing rights to deliver localization and publishing.</li>
              <li>• Misuse, scraping, or impersonation will result in account suspension.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🍪 Cookies & Tracking
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• We use minimal analytics cookies to improve performance.</li>
              <li>• You can decline non-essential cookies via the banner.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              ⚠️ Disclaimer
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• AI outputs may not always be 100% accurate.</li>
              <li>• We recommend reviewing localized content before publishing.</li>
              <li>• The service is provided "as-is" without warranties of any kind.</li>
            </ul>
          </section>

          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 rounded-lg text-white font-semibold hover:brightness-95"
            style={{ backgroundColor: "#2D89FF" }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

