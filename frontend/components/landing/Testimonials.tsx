"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Mr. Ahmad Raza",
    role: "Principal, Al-Noor Secondary School",
    initials: "AR",
    avatarGradient: "from-[#3B4FE8] to-[#7C3AED]",
    quote: "Skoolms completely transformed how we manage our school. Fee collection alone saves us 10 hours a week. I can't imagine going back.",
  },
  {
    name: "Ms. Sarah Malik",
    role: "Head of Administration, Sunrise Academy",
    initials: "SM",
    avatarGradient: "from-[#06B6D4] to-[#6366F1]",
    quote: "The parent portal changed everything. Parents now trust us more because they can see their child's attendance and grades in real time.",
  },
  {
    name: "Mr. Tariq Hussain",
    role: "Director, Excel Public School System",
    initials: "TH",
    avatarGradient: "from-[#7C3AED] to-[#EC4899]",
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
          <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-primary font-semibold mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(59,79,232,0.08)" }}>
            Testimonials
          </span>
          <h2 className="font-sora font-bold text-slate-900 leading-tight" style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}>
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
              className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(59,79,232,0.09)] transition-shadow duration-300 flex flex-col relative overflow-hidden cursor-default"
            >
              {/* Decorative quotation mark */}
              <div className="absolute top-3 right-6 text-[7rem] leading-none font-sora font-black text-slate-100 select-none pointer-events-none" aria-hidden="true">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="text-amber-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-600 font-sans italic text-[1rem] leading-[1.8] flex-grow mb-8 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto relative z-10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center font-sora font-bold text-white text-sm shadow-md flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-sora font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500 font-sans">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
