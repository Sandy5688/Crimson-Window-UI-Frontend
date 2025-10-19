import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function USPStrip() {
  const items = [
    { Icon: AutoAwesomeIcon, text: "Effortless scheduling" },
    { Icon: BoltIcon, text: "Realtime updates" },
    { Icon: SecurityIcon, text: "Enterprise-grade security" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid sm:grid-cols-3 gap-3">
      {items.map(({ Icon, text }) => (
        <div key={text} className="rounded-lg bg-white border border-black/5 px-4 py-3 flex items-center gap-2">
          <span className="text-[#2D89FF]"><Icon fontSize="small" /></span>
          <span className="text-sm font-medium">{text}</span>
        </div>
      ))}
    </div>
  );
}


