export default function Footer() {
  return (
    <footer className="border-t border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-black/60 flex items-center justify-between">
        <div>© {new Date().getFullYear()} Portal</div>
        <div className="flex items-center gap-4">
          <a href="#features" className="hover:text-black">Features</a>
          <a href="#how" className="hover:text-black">How it works</a>
          <a href="#pricing" className="hover:text-black">Pricing</a>
          <a href="#faq" className="hover:text-black">FAQ</a>
        </div>
      </div>
    </footer>
  );
}


