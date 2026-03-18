"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const steps = [
  {
    num: "01",
    icon: "⚙️",
    title: "Set Up Your School",
    desc: "Add your classes, teachers, and students. Import existing data via CSV in minutes.",
    accent: "from-[#3B4FE8] to-[#7C3AED]",
  },
  {
    num: "02",
    icon: "📊",
    title: "Manage Everything",
    desc: "Track attendance, collect fees, communicate with parents, and generate reports.",
    accent: "from-[#6366F1] to-[#06B6D4]",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Watch Your School Grow",
    desc: "Use analytics to identify what's working, act on insights, and improve outcomes.",
    accent: "from-[#7C3AED] to-[#EC4899]",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-headline-hiw", {
        y: 50, opacity: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".section-headline-hiw", start: "top 88%" },
      });
      gsap.from(".hiw-step", {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: ".hiw-step", start: "top 88%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* subtle bg decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="section-headline-hiw text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-primary font-semibold mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(59,79,232,0.08)" }}>
            How It Works
          </span>
          <h2 className="font-sora font-bold text-slate-900 leading-tight" style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}>
            Up and Running in <span className="text-gradient">3 Simple Steps</span>
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Dashed connector line on desktop */}
          <div className="hidden md:block absolute top-[3.5rem] left-[16%] right-[16%] h-0 border-t-2 border-dashed border-slate-200 z-0" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="hiw-step flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${step.accent} flex items-center justify-center text-4xl mb-8 shadow-[0_12px_30px_rgba(59,79,232,0.2)] border-4 border-white relative`}>
                  {step.icon}
                  <span className="absolute -bottom-2 -right-2 text-white/15 font-sora font-black text-5xl select-none">{step.num}</span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full hover:shadow-[0_12px_40px_rgba(59,79,232,0.1)] hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-sora font-bold text-xl text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 font-sans leading-relaxed text-[0.95rem]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
