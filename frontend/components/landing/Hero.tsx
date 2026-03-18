"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

const headline = ["Run", "Your", "School", "Smarter", "with", "BrightScope"];

const statCards = [
  { label: "Total Students", value: "1,248", icon: "👨‍🎓" },
  { label: "Attendance Rate", value: "96.4%", icon: "📋" },
  { label: "Fees Collected", value: "$42,500", icon: "💰" },
  { label: "Staff Count",    value: "84",     icon: "👨‍🏫" },
];

const activityItems = [
  { text: "Fee payment received — Ali Hassan",  time: "2 min ago",  dot: "bg-emerald-400" },
  { text: "Attendance marked — Grade 9A",        time: "15 min ago", dot: "bg-blue-400" },
  { text: "New student enrolled — Sara Malik",   time: "1 hr ago",   dot: "bg-purple-400" },
  { text: "Staff leave approved — Mr. Ahmed",    time: "2 hr ago",   dot: "bg-amber-400" },
  { text: "Report generated — Term 2 Grades",   time: "3 hr ago",   dot: "bg-cyan-400" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryBtnRef = useMagneticButton();
  const secondaryBtnRef = useMagneticButton();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("#hero-badge",     { y: 24, opacity: 0, duration: 0.7 })
        .from(".hero-word",      { y: 80, opacity: 0, stagger: 0.06, duration: 0.9 }, "-=0.3")
        .from("#hero-sub",       { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(".hero-btn",       { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 }, "-=0.4")
        .from("#hero-trust",     { y: 15, opacity: 0, duration: 0.6 }, "-=0.3")
        .from("#hero-dashboard", { y: 60, opacity: 0, scale: 0.96, duration: 1.2 }, "-=0.3");

      // Subtle parallax on background blobs
      gsap.to("#hero-blob-1", {
        y: -60, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 },
      });
      gsap.to("#hero-blob-2", {
        y: -30, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 2 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-white"
    >
      {/* Background blobs */}
      <div
        id="hero-blob-1"
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/4"
        style={{ background: "linear-gradient(135deg,#3B4FE8,#7C3AED)", opacity: 0.15, filter: "blur(80px)" }}
      />
      <div
        id="hero-blob-2"
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4"
        style={{ background: "#06B6D4", opacity: 0.08, filter: "blur(80px)" }}
      />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Badge */}
          <div
            id="hero-badge"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{ borderColor: "rgba(59,79,232,0.2)", backgroundColor: "rgba(59,79,232,0.05)" }}
          >
            <span>🎓</span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary font-semibold">
              School Management Platform
            </span>
          </div>

          {/* Headline — word-by-word */}
          <h1 className="font-sora font-extrabold leading-[1.1] text-slate-900 mb-8 tracking-tight" style={{ fontSize: "clamp(3.2rem,7vw,6rem)" }}>
            {headline.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span
                  className={`hero-word inline-block mr-3 md:mr-4 ${word === "Smarter" ? "text-gradient" : ""}`}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p
            id="hero-sub"
            className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-[1.75] font-sans"
          >
            The all-in-one platform trusted by 500+ schools worldwide.
            Manage students, fees, attendance, staff, and reports — all from one beautiful dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-10 w-full sm:w-auto">
            <button
              ref={primaryBtnRef}
              className="hero-btn w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-primary text-white font-semibold text-lg shadow-[0_8px_30px_rgba(59,79,232,0.35)] hover:shadow-[0_20px_60px_rgba(59,79,232,0.45)] transition-shadow hover:-translate-y-1 active:translate-y-0"
            >
              Get Free Demo
            </button>
            <button
              ref={secondaryBtnRef}
              className="hero-btn w-full sm:w-auto px-8 py-4 rounded-full border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group"
            >
              Watch How It Works
              <span className="group-hover:translate-x-1 transition-transform">▶</span>
            </button>
          </div>

          {/* Trust line */}
          <div id="hero-trust" className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 mb-20">
            {["No credit card required", "Setup in 7 days", "Free onboarding support"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <Check size={15} className="text-emerald-500" />
                {t}
              </div>
            ))}
          </div>

          {/* ── Dashboard Mockup ─────────────────────────────── */}
          <div id="hero-dashboard" className="w-full max-w-5xl mx-auto">
            <div
              className="w-full rounded-2xl md:rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_40px_100px_rgba(59,79,232,0.18)] overflow-hidden animate-float"
            >
              {/* Browser chrome */}
              <div className="h-11 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1" />
                <div className="h-6 w-56 bg-white border border-slate-200 rounded-md shadow-sm mx-auto flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-400 font-mono">dashboard.brightscope.app</span>
                </div>
                <div className="flex-1" />
              </div>

              {/* Dashboard content */}
              <div className="flex h-[420px] md:h-[580px] bg-slate-50/60">

                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-56 p-4 border-r border-slate-100 bg-white/90 gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">BS</div>
                    <span className="text-sm font-bold text-slate-700 font-sora">BrightScope</span>
                  </div>
                  {[
                    ["📊", "Dashboard", true],
                    ["👨‍🎓", "Students", false],
                    ["📋", "Attendance", false],
                    ["💰", "Fees", false],
                    ["💬", "Messages", false],
                    ["📈", "Reports", false],
                  ].map(([icon, label, active]) => (
                    <div key={label as string} className={`h-9 rounded-lg flex items-center px-3 gap-3 cursor-default ${active ? "bg-primary/10" : "hover:bg-slate-50"}`}>
                      <span className="text-sm">{icon as string}</span>
                      <span className={`text-sm font-medium ${active ? "text-primary" : "text-slate-500"}`}>{label as string}</span>
                    </div>
                  ))}
                </div>

                {/* Main area */}
                <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
                  {/* Top bar */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold font-sora text-slate-800">Good morning, Principal! 👋</h2>
                      <p className="text-xs text-slate-500">Here's what's happening today at BrightScope Academy.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">P</div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statCards.map((s) => (
                      <div key={s.label} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                        <div className="text-xl">{s.icon}</div>
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                        <span className="text-base font-bold text-slate-800 font-sora">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart + Activity */}
                  <div className="flex gap-4 flex-1 min-h-0">
                    {/* Chart */}
                    <div className="flex-[2] bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-700">Attendance Overview</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">↑ 4.2%</span>
                      </div>
                      <div className="flex-1 relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3B4FE8" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#3B4FE8" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M0,80 C30,70 50,55 75,50 S120,30 150,35 S200,20 230,25 S270,15 300,18 L300,100 L0,100 Z" fill="url(#chartGrad)" />
                          <path d="M0,80 C30,70 50,55 75,50 S120,30 150,35 S200,20 230,25 S270,15 300,18" fill="none" stroke="#3B4FE8" strokeWidth="2.5" strokeLinecap="round" />
                          {[[0,80],[75,50],[150,35],[230,25],[300,18]].map(([x,y], idx) => (
                            <circle key={idx} cx={x} cy={y} r="3.5" fill="#3B4FE8" />
                          ))}
                        </svg>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4 hidden lg:flex flex-col gap-3">
                      <span className="text-xs font-bold text-slate-700 mb-1">Recent Activity</span>
                      {activityItems.map((a, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[11px] text-slate-700 truncate">{a.text}</span>
                            <span className="text-[10px] text-slate-400">{a.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
