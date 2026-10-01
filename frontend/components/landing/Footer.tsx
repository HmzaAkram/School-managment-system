import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

const productLinks = [
  { label: "Features",   href: "#features" },
  { label: "Get Demo",   href: "#" },
  { label: "Changelog",  href: "#" },
];

const companyLinks = [
  { label: "About Us",   href: "/about" },
  { label: "Events",     href: "/events" },
  { label: "Careers",    href: "#" },
  { label: "Press",      href: "#" },
];

const pages = [
  { label: "Home",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "Events",  href: "/events" },
  { label: "Classes", href: "/classes" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 border-t border-slate-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_14px_rgba(59,79,232,0.4)]">
                BS
              </div>
              <span className="font-sora font-bold text-lg text-white">Skoolms</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The modern school management platform designed for the next generation of educators.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-white mb-1">Pages</h4>
            {pages.map((l) => (
              <Link key={l.label} href={l.href} className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-white mb-1">Company</h4>
            {companyLinks.map((l) => (
              <Link key={l.label} href={l.href} className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-white mb-1">Contact</h4>
            <span className="text-slate-400 text-sm">hello@skoolms.app</span>
            <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
            <span className="text-slate-400 text-sm leading-relaxed">123 Education Lane<br />San Francisco, CA 94111</span>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Skoolms. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
