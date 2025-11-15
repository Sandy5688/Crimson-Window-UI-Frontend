/** @jsxImportSource react */
"use client";

import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function MarketingFooter() {
  return (
    <footer className="bg-[#F9FAFB] dark:bg-gray-950 border-t border-black/10 dark:border-white/10">
      <div className="container py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="font-semibold text-[#111827] dark:text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80 dark:text-white/80">
            <li><Link href="/about" className="hover:text-[#111827] dark:hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#111827] dark:hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827] dark:text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80 dark:text-white/80">
            <li><Link href="/pricing" className="hover:text-[#111827] dark:hover:text-white">Pricing</Link></li>
            <li><Link href="/legal" className="hover:text-[#111827] dark:hover:text-white">Legal & Privacy</Link></li>
            <li><Link href="/support" className="hover:text-[#111827] dark:hover:text-white">Support</Link></li>
            <li><Link href="/billing-policy" className="hover:text-[#111827] dark:hover:text-white">Billing Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827] dark:text-white">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80 dark:text-white/80">
            <li><Link href="/features" className="hover:text-[#111827] dark:hover:text-white">Localization</Link></li>
            <li><Link href="/features" className="hover:text-[#111827] dark:hover:text-white">Optimization</Link></li>
            <li><Link href="/features" className="hover:text-[#111827] dark:hover:text-white">Analytics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827] dark:text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#111827]/80 dark:text-white/80">
            <li>Email: hello@creatorflow.app</li>
            <li>Phone: +61 400 000 000</li>
            <li>Address: Sydney, Australia</li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="text-[#111827]/70 dark:text-white/70 hover:text-[#111827] dark:hover:text-white"><FacebookIcon /></a>
            <a href="#" aria-label="Twitter" className="text-[#111827]/70 dark:text-white/70 hover:text-[#111827] dark:hover:text-white"><TwitterIcon /></a>
            <a href="#" aria-label="LinkedIn" className="text-[#111827]/70 dark:text-white/70 hover:text-[#111827] dark:hover:text-white"><LinkedInIcon /></a>
            <a href="#" aria-label="Instagram" className="text-[#111827]/70 dark:text-white/70 hover:text-[#111827] dark:hover:text-white"><InstagramIcon /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 dark:border-white/10">
        <div className="container py-6 text-center text-sm text-[#111827]/70 dark:text-white/70">
          <p>Proudly Australian-Built Software for Global Creators.</p>
          <p className="mt-1">© 2025 CreatorFlow. All rights reserved.</p>
          {/* <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
              <ShieldIcon className="text-green-500" />
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
              <CheckCircleIcon className="text-green-500" />
              <span className="text-sm font-medium">Cancel Anytime</span>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}


