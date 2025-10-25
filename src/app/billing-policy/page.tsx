export default function BillingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Billing & Refund Policy
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              💰 Billing Overview
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• All payments are processed securely through <strong>Stripe</strong>.</li>
              <li>• Subscriptions renew automatically unless cancelled before renewal date.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🔁 Refund Policy
            </h2>
            <p className="text-black/80 mb-3">Refunds may be issued only for:</p>
            <ul className="space-y-2 text-black/80 ml-4">
              <li>• Duplicate payments</li>
              <li>• Technical service failures preventing usage</li>
              <li>• Special cases approved by support</li>
            </ul>
            <p className="text-black/80 mt-3">
              Refund requests must be made within <strong>7 days</strong> of charge.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🧾 Cancellations
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• Users can cancel any time through their account dashboard or via Stripe customer portal.</li>
              <li>• Cancellation stops future charges but does not retroactively refund past payments.</li>
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

