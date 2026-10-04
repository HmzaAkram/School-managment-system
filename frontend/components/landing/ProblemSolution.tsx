"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Check, X, ArrowRight } from "lucide-react";

const problems = [
  "Paper roll-call registers — easily lost, manipulated, or inaccurate",
  "Cash & physical cheque collection — lost slips, unrecorded reconciliation",
  "Informal WhatsApp groups — unprofessional and impossible to audit",
  "Unconnected Excel gradebooks — error-prone GPA and manual report cards",
  "Filing cabinets for faculty records — zero instant access during audits",
];

const solutions = [
  "Instant biometric & web roll-call with automated SMS alerts to parents",
  "Integrated banking fee collection with live defaulter ledgers & receipts",
  "Certified student & guardian portal with verified teacher homework diaries",
  "Automated exam scheduling, weighted rubric calculations, & PDF transcripts",
  "Comprehensive HR suite: staff attendance, automated payroll, & leave rosters",
];

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("#prob-left", {
        x: -50, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from("#prob-right", {
        x: 50, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C4993C] font-bold block mb-2">
            The Transformation
          </span>
          <h2 className="font-sora font-extrabold text-[#23201B] leading-tight text-3xl sm:text-4xl md:text-5xl">
            Schools Run on Legacy Friction.{" "}
            <span className="text-gradient">Until Now.</span>
          </h2>
          <p className="text-sm md:text-base text-[#706B62] mt-4">
            Replace fragmented paper slips, spreadsheet formulas, and manual follow-ups with a unified institutional OS.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative items-stretch">
          {/* Left: The Legacy Problem */}
          <div
            id="prob-left"
            className="p-8 md:p-10 rounded-3xl bg-white border border-[#EBE8E2] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                  ✕
                </span>
                <h3 className="font-bold text-lg text-[#23201B] font-sora">The Legacy Paperwork Era</h3>
              </div>

              <ul className="space-y-4">
                {problems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-[#706B62]">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={12} strokeWidth={2.5} />
                    </div>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EBE8E2] text-xs text-[#8C877D] font-mono">
              Result: 30+ wasted admin hours weekly & uncollected revenue.
            </div>
          </div>

          {/* Right: The Skoolms Solution */}
          <div
            id="prob-right"
            className="p-8 md:p-10 rounded-3xl bg-[#FFFDF9] border-2 border-[#C4993C]/40 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#C4993C]/10 text-[#C4993C] flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <h3 className="font-bold text-lg text-[#23201B] font-sora">The Skoolms Operating System</h3>
              </div>

              <ul className="space-y-4">
                {solutions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-[#23201B] font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F1EAD9] flex items-center justify-between text-xs font-bold text-[#C4993C]">
              <span>Result: 100% Audit Precision & Rapid Parent Trust</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
