export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Header / Hero */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold font-[Montserrat] mb-4">
          Need Help? We’re Here for You
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Whether it’s a technical issue, billing question, or feedback — our team is ready to help you get things sorted quickly.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-12">
        {/* Contact Form */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl font-semibold font-[Montserrat] mb-6 flex items-center gap-2">
            ✉️ Contact Us
          </h2>
          <p className="text-gray-600 mb-6">
            Fill out the form below and we’ll get back to you within 24–48 hours.
          </p>

          <form
            action="https://formsubmit.co/personalsandykumar@gmail.com"
            method="POST"
            className="space-y-5"
          >
            {/* Hidden input to disable CAPTCHA */}
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://yourdomain.com/thank-you"
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Tell us what’s going on..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Help Topics */}
        <section>
          <h2 className="text-2xl font-semibold font-[Montserrat] mb-6 flex items-center gap-2">
            🧭 Help Topics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Connecting YouTube or Spotify accounts",
              "Uploading & localization issues",
              "Billing & plan upgrades",
              "Data deletion or privacy concerns",
            ].map((topic) => (
              <div
                key={topic}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800">{topic}</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Learn more about how to troubleshoot or manage this.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl font-semibold font-[Montserrat] mb-6 flex items-center gap-2">
            🔒 Trust & Safety
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>• We comply with GDPR and modern data-protection standards.</li>
            <li>• All data is encrypted in storage and transmitted via HTTPS.</li>
            <li>• If you believe your account was compromised, contact us immediately.</li>
          </ul>

          <div className="mt-8">
            <a
              href="/"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-xl transition"
            >
              ← Back to Home
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
