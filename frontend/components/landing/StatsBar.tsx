"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";

// ── Custom CountUp (requestAnimationFrame, no library) ──
function CountUp({ target, suffix = "", separator = "" }: { target: number; suffix?: string; separator?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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
  { value: 500,   suffix: "+",     label: "Schools",        separator: "" },
  { value: 50000, suffix: "+",     label: "Students",       separator: "," },
  { value: 98,    suffix: "%",     label: "Satisfaction",   separator: "" },
  { value: 7,     suffix: " Days", label: "Avg Setup Time", separator: "" },
];

const schools = ["Sunrise Academy", "Al-Noor School", "City Public High", "Excel Institute", "Bright Minds"];

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".school-pill", {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-slate-900 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-18">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Stats */}
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col items-center md:items-start ${i > 0 ? "md:border-l md:border-slate-800 md:pl-8" : ""}`}>
                <div className="text-3xl lg:text-4xl font-extrabold font-sora text-white mb-1 tracking-tight">
                  <CountUp target={stat.value} suffix={stat.suffix} separator={stat.separator} />
                </div>
                <div className="text-sm font-sans text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trusted logos */}
          <div className="lg:w-[40%] flex flex-col items-center lg:items-end gap-4 w-full border-t lg:border-t-0 border-slate-800 pt-8 lg:pt-0">
            <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">
              Trusted by schools in:
            </span>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              {schools.map((school) => (
                <div
                  key={school}
                  className="school-pill px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap text-white/50 border border-white/10 hover:bg-white/10 transition-colors cursor-default"
                >
                  {school}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
