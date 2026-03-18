"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Check, X } from "lucide-react";

const problems = [
  "Manual attendance sheets — lost, inaccurate",
  "Fee collection via cash — no records, no reminders",
  "WhatsApp groups for parent updates — unprofessional",
  "Excel gradebooks — no analysis, easy to corrupt",
  "Staff records in filing cabinets — impossible to search",
];

const solutions = [
  "One-click digital attendance with parent alerts",
  "Online fee portal with auto-reminders and receipts",
  "Professional parent portal with real-time updates",
  "Smart gradebook with auto GPA and report cards",
  "Centralized staff profiles, payroll, and leave management",
];

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("#prob-left", {
        x: -80, opacity: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from("#prob-right", {
        x: 80, opacity: 0, duration: 1.0, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from(".section-headline-ps", {
        y: 50, opacity: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".section-headline-ps", start: "top 88%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="section-headline-ps text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="font-sora font-bold text-slate-900 leading-tight" style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}>
            Schools Run on Paperwork.{" "}
            <span className="text-gradient">Until Now.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Arrow between columns on desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white rounded-full border border-slate-100 shadow-lg items-center justify-center text-slate-400 text-xl font-bold">
            →
          </div>

          {/* Problems */}
          <div id="prob-left" className="bg-red-50 border border-red-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-mono text-xs uppercase tracking-widest font-semibold mb-8">
              ❌ The Old Way
            </div>
            <ul className="flex flex-col gap-6">
              {problems.map((prob, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-red-200/60 flex flex-shrink-0 items-center justify-center text-red-500 mt-0.5">
                    <X size={13} strokeWidth={3} />
                  </div>
                  <span className="text-slate-900 text-base leading-snug">{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div
            id="prob-right"
            className="border border-blue-100 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(59,79,232,0.06)]"
            style={{ background: "linear-gradient(135deg,#EEF0FD 0%,#f0f4ff 100%)" }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full text-primary font-mono text-xs uppercase tracking-widest font-semibold mb-8"
              style={{ backgroundColor: "rgba(59,79,232,0.1)" }}>
              ✅ The BrightScope Way
            </div>
            <ul className="flex flex-col gap-6">
              {solutions.map((sol, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center text-primary mt-0.5"
                    style={{ backgroundColor: "rgba(59,79,232,0.15)" }}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span className="text-slate-900 text-base leading-snug font-medium">{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
