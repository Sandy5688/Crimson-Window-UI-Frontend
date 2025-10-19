import CheckIcon from "@mui/icons-material/Check";

const tiers = [
  { name: "Starter", price: "$0", features: ["Up to 3 uploads/mo", "1 channel"] },
  { name: "Pro", price: "$19", features: ["Up to 50 uploads/mo", "3 channels", "Priority queue"] },
  { name: "Agency", price: "$49", features: ["Unlimited uploads", "10 channels", "Team access"] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Pricing</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="bg-white rounded-lg border border-black/5 p-6 shadow-sm">
            <div className="text-sm text-black/60">{t.name}</div>
            <div className="text-3xl font-bold my-2">{t.price}<span className="text-base font-normal text-black/60">/mo</span></div>
            <ul className="space-y-2 text-sm mb-4">
              {t.features.map((f) => (
                <li key={f} className="inline-flex items-center gap-2"><CheckIcon className="text-[#4CAF50]" fontSize="small" /> {f}</li>
              ))}
            </ul>
            <a href="/signup" className="inline-block w-full text-center rounded-md bg-[#2D89FF] text-white py-2 hover:brightness-95">Choose {t.name}</a>
          </div>
        ))}
      </div>
    </section>
  );
}


