export default function HowItWorks() {
  return (
    <section id="how" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">How it works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { step: "Step 1", title: "Connect your channels", desc: "Authorize once and we securely manage credentials." },
          { step: "Step 2", title: "Schedule your uploads", desc: "Pick a date/time and we queue the job instantly." },
          { step: "Step 3", title: "Track results live", desc: "Realtime updates and detailed status for every job." },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-lg border border-black/5 p-6 shadow-sm">
            <div className="text-sm text-black/60 mb-1">{s.step}</div>
            <div className="font-medium mb-2">{s.title}</div>
            <div className="text-sm text-black/70">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


