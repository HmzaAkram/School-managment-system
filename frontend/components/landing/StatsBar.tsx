"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";

function CountUp({ target, suffix = "", separator = "" }: { target: number; suffix?: string; separator?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
      else setCount(target);
    };
    requestAnimationFrame((t) => step(t, t));
  }, [isInView, target]);

  const formatted = separator
    ? count.toLocaleString()
    : count.toString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

const stats = [
  { value: 500,   suffix: "+",     label: "Institutions Operating",  separator: "" },
  { value: 120000, suffix: "+",    label: "Active Students & Parents", separator: "," },
  { value: 99,    suffix: ".4%",   label: "Daily Attendance Accuracy", separator: "" },
  { value: 100,   suffix: "%",     label: "Audit-Ready Financial Ledger", separator: "" },
];

const schools = ["Oakridge International", "Beaconhouse City", "Army Public Schools", "The City School", "Roots Millennium", "KGS Campus"];

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".school-pill", {
        y: 15, opacity: 0, stagger: 0.08, duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 90%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#1A1A1A] border-y border-[#2E2A24] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {stats.map((s, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sora text-[#D4A843] mb-1">
                <CountUp target={s.value} suffix={s.suffix} separator={s.separator} />
              </div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partner schools */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">
            Trusted by Leaders Across:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {schools.map((sch, i) => (
              <span
                key={i}
                className="school-pill px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:border-[#C4993C] hover:text-white transition-colors"
              >
                {sch}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
