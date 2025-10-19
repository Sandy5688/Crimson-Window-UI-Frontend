export default function FAQ() {
  const qas = [
    { q: "Is my data secure?", a: "Yes—we encrypt tokens at rest, never expose them to the client, and proxy all sensitive calls through our gateway." },
    { q: "Can I cancel anytime?", a: "Absolutely. Manage your plan from the billing portal and cancel at any time." },
    { q: "Do you support multiple platforms?", a: "Yes—integrations cover several providers and more are coming." },
    { q: "Is there a free trial?", a: "Start for free and upgrade when you need higher limits." },
  ];
  return (
    <section id="faq" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">FAQ</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {qas.map((item) => (
          <div key={item.q} className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
            <div className="font-medium mb-2">{item.q}</div>
            <div className="text-sm text-black/70">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


