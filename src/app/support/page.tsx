export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Support & Contact
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              ✉️ Contact Us
            </h2>
            <p className="text-black/80 mb-2">
              <strong>Email:</strong> support@dummydomain.com
            </p>
            <p className="text-black/80">
              <strong>Response Time:</strong> within 24–48 hours on business days
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🧭 Help Topics
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• Connecting your YouTube/Spotify accounts</li>
              <li>• Uploading & localization issues</li>
              <li>• Billing & plan upgrades</li>
              <li>• Data deletion or privacy concerns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🔒 Trust & Safety
            </h2>
            <ul className="space-y-2 text-black/80">
              <li>• We comply with GDPR & standard data-protection practices.</li>
              <li>• All data transmitted over HTTPS and encrypted in storage.</li>
              <li>• If you believe your account was compromised, email us immediately.</li>
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

