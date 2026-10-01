"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

const navLinks = [
  { name: "Home",    href: "/" },
  { name: "About",   href: "/about" },
  { name: "Events",  href: "/events" },
  { name: "Classes", href: "/classes" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
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
        style={{ background: "linear-gradient(90deg, #3B4FE8, #7C3AED)" }}
      />

      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-[2px] left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg font-sora shadow-[0_4px_14px_rgba(59,79,232,0.3)]">
              SK
            </div>
            <span className="font-sora font-bold text-xl text-slate-800">
              Skoolms
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-primary font-sans text-sm font-medium transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-primary transition-all duration-300 group-hover:w-full rounded-full" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 font-sans text-sm font-medium px-4 py-2 rounded-full border border-slate-200 hover:border-slate-400 transition-all"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/login"
                  className="bg-gradient-primary text-white px-6 py-2.5 rounded-full font-sans text-sm font-semibold hover:shadow-[0_8px_20px_rgba(59,79,232,0.35)] transition-shadow"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-slate-600 p-2"
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
              className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-2">
                  <Link
                    href="/login"
                    className="text-center font-semibold py-3 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className="bg-gradient-primary text-white rounded-xl py-3 font-semibold shadow-md text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
