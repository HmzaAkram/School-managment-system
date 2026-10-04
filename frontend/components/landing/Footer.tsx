import Link from "next/link";
import { Twitter, Linkedin, Instagram, Phone } from "lucide-react";

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
    <footer id="contact" className="pt-20 pb-10" style={{ backgroundColor: "#23201B", borderTop: "1px solid #3D382F" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_14px_rgba(196,153,60,0.4)]">
                SK
              </div>
              <span className="font-sora font-bold text-lg text-white">Skoolms</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#A09A91" }}>
              The modern school management platform designed for the next generation of educators.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="transition-colors p-2 rounded-lg hover:bg-white/10" style={{ color: "#706B62" }}>
                <Twitter size={18} />
              </a>
              <a href="#" className="transition-colors p-2 rounded-lg hover:bg-white/10" style={{ color: "#706B62" }}>
                <Linkedin size={18} />
              </a>
              <a href="#" className="transition-colors p-2 rounded-lg hover:bg-white/10" style={{ color: "#706B62" }}>
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-white mb-1">Pages</h4>
            {pages.map((l) => (
              <Link key={l.label} href={l.href} className="text-sm transition-colors hover:translate-x-1 inline-block" style={{ color: "#A09A91" }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-white mb-1">Company</h4>
            {companyLinks.map((l) => (
              <Link key={l.label} href={l.href} className="text-sm transition-colors hover:translate-x-1 inline-block" style={{ color: "#A09A91" }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-white mb-1">Contact</h4>
            <span className="text-sm" style={{ color: "#A09A91" }}>hello@skoolms.app</span>
            <a
              href="https://wa.me/923152123010"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm inline-flex items-center gap-1.5 transition-colors"
              style={{ color: "#A09A91" }}
            >
              <Phone size={14} style={{ color: "#C4993C" }} />
              +92 315 2123010
            </a>
            <span className="text-sm leading-relaxed" style={{ color: "#A09A91" }}>Pakistan</span>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #3D382F" }}>
          <p className="text-sm" style={{ color: "#706B62" }}>
            © 2026 Skoolms. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm transition-colors" style={{ color: "#706B62" }}>Privacy Policy</a>
            <a href="#" className="text-sm transition-colors" style={{ color: "#706B62" }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
