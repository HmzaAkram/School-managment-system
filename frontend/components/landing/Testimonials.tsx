"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Mr. Ahmad Raza",
    role: "Principal, Al-Noor Secondary School",
    initials: "AR",
    avatarGradient: "from-[#C4993C] to-[#A37C27]",
    quote: "Skoolms completely transformed how we manage our school. Fee collection alone saves us 10 hours a week. I can't imagine going back.",
  },
  {
    name: "Ms. Sarah Malik",
    role: "Head of Administration, Sunrise Academy",
    initials: "SM",
    avatarGradient: "from-[#D4A843] to-[#C4993C]",
    quote: "The parent portal changed everything. Parents now trust us more because they can see their child's attendance and grades in real time.",
  },
  {
    name: "Mr. Tariq Hussain",
    role: "Director, Excel Public School System",
    initials: "TH",
    avatarGradient: "from-[#A37C27] to-[#8B6914]",
    quote: "We manage 3 school branches on one platform. The reports dashboard gives me a bird's-eye view of all three campuses instantly.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] font-semibold mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(196,153,60,0.1)", color: "var(--color-accent)" }}>
            Testimonials
          </span>
          <h2 className="font-sora font-bold leading-tight" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--color-text)" }}>
            Trusted by School Leaders{" "}
            <span className="text-gradient">Worldwide</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(196,153,60,0.09)] transition-shadow duration-300 flex flex-col relative overflow-hidden cursor-default"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              {/* Decorative quotation mark */}
              <div className="absolute top-3 right-6 text-[7rem] leading-none font-sora font-black select-none pointer-events-none" style={{ color: "var(--color-border)" }} aria-hidden="true">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="text-lg" style={{ color: "var(--color-accent)" }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-sans italic text-[1rem] leading-[1.8] flex-grow mb-8 relative z-10" style={{ color: "var(--color-text-muted)" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto relative z-10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center font-sora font-bold text-white text-sm shadow-md flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-sora font-bold text-sm" style={{ color: "var(--color-text)" }}>{t.name}</div>
                  <div className="text-xs font-sans" style={{ color: "var(--color-text-muted)" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
