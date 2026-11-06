"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";

const navLinks = [
  { name: "Product",      href: "#hero" },
  { name: "Intelligence", href: "#features" },
  { name: "Portals",      href: "#dashboard-preview" },
  { name: "Analytics",    href: "#how-it-works" },
  { name: "About",        href: "#testimonials" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll progress bar
      gsap.to("#scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Navbar entrance animation
      gsap.from(navRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left scale-x-0 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #C4993C, #D4A843)" }}
      />

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#EBE8E2]/80"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#23201B] flex items-center justify-center text-[#D4A843] font-bold text-sm shadow-sm border border-[#3D382F] group-hover:scale-105 transition-transform">
              <span className="font-serif italic font-bold">SK</span>
            </div>
            <span className="font-serif font-bold text-2xl text-[#23201B] tracking-tight">
              Skoolms<span className="text-[#C4993C] font-sans text-lg">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[#5C564D] hover:text-[#23201B] font-sans text-sm font-medium transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C4993C] transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-[#EBE8E2] pl-6">
              <Link
                href="/login"
                className="text-[#23201B] hover:bg-white font-sans text-xs font-semibold px-4 py-2.5 rounded-full border border-[#D9D4CC] transition-all"
              >
                Open dashboard
              </Link>

              <a
                href="https://wa.me/923152123010?text=Hello%20Skoolms%20Team%2C%20I%20would%20like%20to%20book%20a%20demo%20for%20our%20school."
                rel="noopener noreferrer"
                className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone size={13} className="text-[#C4993C]" />
                <span>Book a demo</span>
                <ArrowUpRight size={13} className="opacity-70" />
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-[#23201B] p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="lg:hidden bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#EBE8E2] overflow-hidden animate-in slide-in-from-top duration-300"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[#4A453E] hover:text-[#23201B] font-semibold text-sm py-2 border-b border-[#EBE8E2]/60"
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-[#23201B] font-bold text-xs py-2.5 rounded-full border border-[#D9D4CC] bg-white"
                >
                  Open dashboard
                </Link>

                <a
                  href="https://wa.me/923152123010?text=Hello%20Skoolms%20Team%2C%20I%20would%20like%20to%20book%20a%20demo%20for%20our%20school."
                  rel="noopener noreferrer"
                  className="text-center bg-[#23201B] text-white font-bold text-xs py-2.5 rounded-full shadow-md flex items-center justify-center gap-1.5"
                >
                  <Phone size={13} className="text-[#C4993C]" />
                  <span>Book a demo (+92 315 2123010)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
