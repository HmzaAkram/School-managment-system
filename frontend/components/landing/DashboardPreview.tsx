"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TrendingUp, CheckCircle } from "lucide-react";

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-headline-dash", {
        y: 50, opacity: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".section-headline-dash", start: "top 85%" },
      });
      gsap.fromTo(
        "#dashboard-screen",
        { scale: 0.94, opacity: 0.5 },
        {
          scale: 1, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: "#dashboard-preview",
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
      gsap.to("#float-badge-1", {
        y: -25, ease: "none",
        scrollTrigger: {
          trigger: "#dashboard-preview",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to("#float-badge-2", {
        y: -40, ease: "none",
        scrollTrigger: {
          trigger: "#dashboard-preview",
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="dashboard-preview" ref={sectionRef} className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "linear-gradient(135deg,#6366F1,#06B6D4)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="section-headline-dash text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="font-sora font-bold text-white leading-tight mb-5" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
            See <span className="text-gradient-cyan">BrightScope</span> in Action
          </h2>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-sans">
            A modern, intuitive dashboard your entire team will love from day one.
          </p>
        </div>

        {/* Laptop + floating badges */}
        <div className="relative max-w-5xl mx-auto">

          {/* Badge 1 — top right */}
          <div id="float-badge-1"
            className="absolute -top-6 -right-2 md:-right-10 z-20 hidden md:flex items-center gap-3 animate-float
              bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Attendance Up 12%</div>
              <div className="text-xs text-slate-400">vs last month</div>
            </div>
          </div>

          {/* Badge 2 — bottom left */}
          <div id="float-badge-2"
            className="absolute -bottom-8 -left-2 md:-left-10 z-20 hidden md:flex items-center gap-3 animate-float-reverse
              bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">47 Fees Collected Today</div>
              <div className="text-xs text-slate-400">All automated</div>
            </div>
          </div>

          {/* Laptop frame */}
          <div id="dashboard-screen" className="relative mx-auto max-w-4xl">
            {/* Screen */}
            <div className="border-[8px] border-slate-700 rounded-t-[1.75rem] bg-slate-900 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] w-full flex flex-col box-border" style={{ aspectRatio: "16/9" }}>
              {/* Tabs bar */}
              <div className="h-10 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700 flex-shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 px-4 flex">
                  <div className="bg-slate-700 rounded-md h-5 w-full max-w-xs mx-auto flex items-center justify-center">
                    <span className="text-slate-400 text-[9px] font-mono">dashboard.brightscope.app</span>
                  </div>
                </div>
              </div>

              {/* App content */}
              <div className="flex-1 flex min-h-0 bg-[#F8F9FE]">
                {/* Sidebar */}
                <div className="w-44 bg-white border-r border-slate-200 hidden sm:flex flex-col p-3 gap-1">
                  <div className="flex items-center gap-2 mb-3 p-1">
                    <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center text-white text-[9px] font-bold">BS</div>
                    <span className="text-[11px] font-bold text-slate-700">BrightScope</span>
                  </div>
                  {[["📊","Dashboard",true],["👨‍🎓","Students",false],["📋","Attendance",false],["💰","Fees",false],["💬","Messages",false],["📈","Reports",false]].map(([icon, label, active]) => (
                    <div key={label as string} className={`h-8 rounded-lg flex items-center px-2 gap-2 ${active ? "bg-primary/10" : ""}`}>
                      <span className="text-xs">{icon as string}</span>
                      <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-slate-500"}`}>{label as string}</span>
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Good morning, Principal! 👋</div>
                      <div className="text-[9px] text-slate-500">BrightScope Academy Dashboard</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[9px] font-bold">P</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[["👨‍🎓","1,248","Students"],["📋","96.4%","Attendance"],["💰","$42.5k","Fees"],["👨‍🏫","84","Staff"]].map(([icon,val,lbl]) => (
                      <div key={lbl as string} className="bg-white rounded-lg p-2 border border-slate-100 shadow-sm">
                        <div className="text-sm">{icon as string}</div>
                        <div className="text-[11px] font-bold text-slate-800">{val as string}</div>
                        <div className="text-[9px] text-slate-400">{lbl as string}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-1 min-h-0">
                    <div className="flex-[2] bg-white rounded-lg border border-slate-100 shadow-sm p-2 flex flex-col">
                      <div className="text-[10px] font-bold text-slate-700 mb-1">Attendance Overview</div>
                      <div className="flex-1 relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M0,65 C40,55 70,40 100,38 S160,20 200,22 S260,10 300,12 L300,80 L0,80 Z" fill="url(#dashGrad)" />
                          <path d="M0,65 C40,55 70,40 100,38 S160,20 200,22 S260,10 300,12" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm p-2 hidden md:flex flex-col gap-2">
                      <div className="text-[10px] font-bold text-slate-700">Recent Activity</div>
                      {[["Fee received — Ali H.","2m","bg-emerald-400"],["Attendance marked — 9A","15m","bg-blue-400"],["New student enrolled","1h","bg-purple-400"]].map(([t,time,dot]) => (
                        <div key={t as string} className="flex gap-2 items-center">
                          <div className={`w-1.5 h-1.5 rounded-full ${dot as string} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] text-slate-600 truncate">{t as string}</div>
                            <div className="text-[8px] text-slate-400">{time as string} ago</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop base */}
            <div className="relative w-full h-4 md:h-5 bg-slate-600 rounded-b-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex justify-center -mt-[1px]">
              <div className="w-16 md:w-24 h-2 md:h-3 bg-slate-700 rounded-b-md" />
            </div>
            {/* Glow under laptop */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl opacity-30"
              style={{ background: "linear-gradient(90deg,#3B4FE8,#7C3AED)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
