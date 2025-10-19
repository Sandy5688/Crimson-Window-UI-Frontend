import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import BoltIcon from "@mui/icons-material/Bolt";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const features = [
  { title: "Real-time status", desc: "Live progress updates for every job.", Icon: TrendingUpIcon },
  { title: "Secure by design", desc: "Tokens encrypted, never exposed to clients.", Icon: SecurityIcon },
  { title: "Fast scheduling", desc: "Queue uploads in seconds.", Icon: BoltIcon },
  { title: "Usage-aware limits", desc: "Plan-based controls with clear feedback.", Icon: QueryStatsIcon },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map(({ title, desc, Icon }) => (
          <div key={title} className="bg-white rounded-lg border border-black/5 p-5 shadow-sm">
            <div className="text-[#2D89FF] mb-2"><Icon /></div>
            <div className="font-medium mb-1">{title}</div>
            <div className="text-sm text-black/60">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


