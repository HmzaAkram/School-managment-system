"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Lock, Cloud, Globe, Zap, Phone, ArrowUpRight } from "lucide-react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

const trustItems = [
  { icon: <Lock size={20} />, label: "Secure & Encrypted" },
  { icon: <Cloud size={20} />, label: "Cloud-Based" },
  { icon: <Globe size={20} />, label: "Used in 20+ Countries" },
  { icon: <Zap size={20} />, label: "99.9% Uptime" },
];

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryBtnRef = useMagneticButton<HTMLAnchorElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#final-cta", start: "top 75%" },
      });
      tl.from("#cta-headline", { y: 50, opacity: 0, duration: 1.0, ease: "power3.out" })
        .from("#cta-sub",      { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".cta-btn",      { y: 20, opacity: 0, stagger: 0.15, duration: 0.7 }, "-=0.4")
        .from(".cta-trust",   { y: 15, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.3");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      className="py-24 md:py-36 relative overflow-hidden animate-gradient-shift"
    >
      {/* Decorative blobs for depth */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none blur-3xl"
        style={{ background: "#ffffff" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none blur-3xl"
        style={{ background: "#D4A843" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{ background: "#A37C27" }} />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">

        <h2
          id="cta-headline"
          className="font-sora font-extrabold text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}
        >
          Your School Deserves Better.<br />
          <span className="text-white/90">Let&apos;s Get Started.</span>
        </h2>

        <p
          id="cta-sub"
          className="text-lg md:text-xl text-white/80 font-sans max-w-2xl mb-12 leading-relaxed"
        >
          Join 500+ schools already using Skoolms.
          Setup takes less than a week. No IT team required.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <a
            ref={primaryBtnRef}
            href="https://wa.me/923152123010?text=Hello%20Skoolms%20Team%2C%20I%20would%20like%20to%20book%20a%20demo%20for%20our%20school."
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn w-full sm:w-auto px-8 py-4 rounded-full bg-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-2"
            style={{ color: "var(--color-accent)" }}
          >
            <Phone size={18} />
            Book a Demo
            <ArrowUpRight size={16} className="opacity-70" />
          </a>
          <a
            href="/login"
            className="cta-btn w-full sm:w-auto px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all group inline-flex items-center justify-center"
          >
            Portal Login{" "}
            <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
          </a>
        </div>

        {/* Trust items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-white/70 text-sm font-medium w-full max-w-3xl">
          {trustItems.map((item, i) => (
            <div key={i} className="cta-trust flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="text-white/70">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
