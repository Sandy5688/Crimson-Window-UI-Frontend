import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#2D89FF] to-[#4CAF50] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold mb-1">Ready to ship your next upload?</div>
            <div className="text-white/90">Start free. Upgrade when you need more.</div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="px-5 py-3 rounded-md bg-white text-black hover:brightness-95">Get started</Link>
            <Link href="/login" className="px-5 py-3 rounded-md border border-white/50 hover:bg-white/10">I already have an account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


