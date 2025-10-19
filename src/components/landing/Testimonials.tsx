export default function Testimonials() {
  const items = [
    { name: "Alex", quote: "Scheduling uploads used to be a chore—this made it effortless." },
    { name: "Priya", quote: "Love the realtime progress. I can plan my day with confidence." },
    { name: "Miguel", quote: "Secure and fast. Exactly what our team needed." },
  ];
  return (
    <section className="bg-white/60 border-y border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <div key={t.name} className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
            <div className="text-sm text-black/60 mb-2">{t.name}</div>
            <div className="text-black/80">“{t.quote}”</div>
          </div>
        ))}
      </div>
    </section>
  );
}


