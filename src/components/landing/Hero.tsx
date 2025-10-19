import Link from "next/link";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40" style={{
        background:
          "radial-gradient(1000px 500px at 10% -10%, #2D89FF33, transparent 70%), radial-gradient(1000px 500px at 90% -20%, #FFB40022, transparent 70%)",
      }} />
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-16">
        <header className="flex items-center justify-between mb-10">
          <div className="text-[18px] font-semibold tracking-tight">Portal</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-black/70">
            <a href="#features" className="hover:text-black">Features</a>
            <a href="#how" className="hover:text-black">How it works</a>
            <a href="#pricing" className="hover:text-black">Pricing</a>
            <a href="#faq" className="hover:text-black">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-md border hover:bg-black/5">Log in</Link>
            <Link href="/signup" className="px-4 py-2 rounded-md bg-[#2D89FF] text-white hover:brightness-95">Sign up</Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2FF] text-[#2D89FF] text-xs font-medium mb-3">
              Built for creators and teams
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">Schedule uploads, connect channels, and track results live</h1>
            <p className="text-black/70 mb-6 text-lg">A modern portal to orchestrate your content. Secure by design. Lightning fast. Gorgeous UI.</p>
            <div className="flex items-center gap-3">
              <Link href="/signup" className="px-5 py-3 rounded-md bg-[#2D89FF] text-white hover:brightness-95 inline-flex items-center gap-2">
                <RocketLaunchIcon /> Get started free
              </Link>
              <a href="#features" className="px-5 py-3 rounded-md border hover:bg-black/5">Explore features</a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-black/60">
              <div className="inline-flex items-center gap-1"><CheckCircleIcon fontSize="small" className="text-[#4CAF50]" /> No credit card</div>
              <div className="inline-flex items-center gap-1"><CheckCircleIcon fontSize="small" className="text-[#4CAF50]" /> Cancel anytime</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-[#2D89FF]/10 blur-2xl" />
            <div className="absolute -bottom-6 -right-8 w-56 h-56 rounded-full bg-[#FFB400]/10 blur-2xl" />
            <div className="relative bg-white/80 backdrop-blur rounded-2xl border border-black/5 shadow-xl p-6">
              <div className="text-sm text-black/60 mb-2">Preview</div>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-black/5 to-black/10 border border-black/5" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


