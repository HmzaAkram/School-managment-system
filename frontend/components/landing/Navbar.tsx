"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-[#5C564D] hover:text-[#23201B] font-sans text-sm font-medium transition-colors relative group py-1"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C4993C] transition-all duration-300 group-hover:w-full rounded-full" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-[#EBE8E2] pl-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/login"
                  className="text-[#23201B] hover:bg-white font-sans text-xs font-semibold px-4 py-2.5 rounded-full border border-[#D9D4CC] transition-all"
                >
                  Open dashboard
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a
                  href="https://wa.me/923152123010?text=Hello%20Skoolms%20Team%2C%20I%20would%20like%20to%20book%20a%20demo%20for%20our%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                >
                  <Phone size={13} className="text-[#C4993C]" />
                  <span>Book a demo</span>
                  <ArrowUpRight size={13} className="opacity-70" />
                </a>
              </motion.div>
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#EBE8E2] overflow-hidden"
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center bg-[#23201B] text-white font-bold text-xs py-2.5 rounded-full shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Phone size={13} className="text-[#C4993C]" />
                    <span>Book a demo (+92 315 2123010)</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
