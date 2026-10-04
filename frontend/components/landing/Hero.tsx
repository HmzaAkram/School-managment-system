"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Phone, ArrowUpRight, Sparkles, Check, BarChart3, Users, Clock, Award, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import 3D Educational Object with SSR disabled for optimal Next.js rendering
const Hero3DObject = dynamic(() => import("./Hero3DObject"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[500px] aspect-square flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-[#EBE5D9] animate-pulse flex items-center justify-center text-[#C4993C]">
        <Sparkles size={24} className="animate-spin" />
      </div>
    </div>
  ),
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("#hero-tag",       { y: 15, opacity: 0, duration: 0.6 })
        .from("#hero-title-1",   { y: 30, opacity: 0, duration: 0.7 }, "-=0.3")
        .from("#hero-title-2",   { y: 30, opacity: 0, duration: 0.7 }, "-=0.4")
        .from("#hero-description", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-action-btn", { y: 15, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.2")
        .from("#hero-3d-wrap",   { scale: 0.9, opacity: 0, duration: 0.9 }, "-=0.5")
        .from("#hero-ticker",     { opacity: 0, y: 10, duration: 0.5 }, "-=0.3")
        .from("#hero-dashboard-section", { y: 40, opacity: 0, duration: 0.8 }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#FAF8F5]"
    >
      {/* Ambient background lighting */}
      <div
        className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none opacity-35 blur-3xl -z-0"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.25) 0%, rgba(250,248,245,0) 70%)" }}
      />
      <div
        className="absolute top-40 right-10 w-[450px] h-[450px] rounded-full pointer-events-none opacity-30 blur-3xl -z-0"
        style={{ background: "radial-gradient(circle, rgba(196,153,60,0.2) 0%, rgba(250,248,245,0) 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* ── Main Editorial Split Layout (Reference Aesthetic) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[520px] mb-16">
          
          {/* Left Column: Editorial Typography & Schooling CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Overline Tag */}
            <div
              id="hero-tag"
              className="flex items-center gap-3 text-xs font-mono tracking-[0.14em] uppercase text-[#706B62] font-semibold mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#C4993C] animate-pulse" />
              <span>NEXT-GEN SCHOOL OPERATING SYSTEM</span>
              <span className="text-[#C4993C]">—</span>
              <span>SKOOLMS ECOSYSTEM</span>
            </div>

            {/* Editorial Headline for Schooling */}
            <h1 className="font-serif leading-[1.08] tracking-tight text-[#23201B] mb-6 text-4xl sm:text-6xl lg:text-[68px]">
              <span id="hero-title-1" className="block font-bold">
                Every school,
              </span>
              <span id="hero-title-1" className="block font-bold">
                empowered by <span className="text-[#2B5B84]">intelligence.</span>
              </span>
              <span id="hero-title-2" className="block italic font-normal text-[#23201B] mt-1">
                Every classroom & parent,
              </span>
              <span id="hero-title-2" className="block italic font-normal text-[#2E5E4E]">
                connected in one portal.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              id="hero-description"
              className="text-base sm:text-lg text-[#5C564D] max-w-xl mb-9 leading-relaxed font-sans"
            >
              The all-in-one ERP built for progressive institutions. Eliminate paper diaries, automate fee recoveries with 3-fold bank deposit challans, track biometric attendance, and give principals 360° real-time intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <a
                href="https://wa.me/923152123010?text=Hello%20Skoolms%20Team%2C%20I%20would%20like%20to%20book%20a%20demo%20for%20our%20school."
                target="_blank"
                rel="noopener noreferrer"
                className="hero-action-btn px-7 py-3.5 rounded-full bg-[#23201B] hover:bg-[#3D382F] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                <span>Book a Demo (+92 315 2123010)</span>
                <ArrowUpRight size={15} className="text-[#C4993C]" />
              </a>

              <Link
                href="/login"
                className="hero-action-btn px-6 py-3.5 rounded-full border border-[#D9D4CC] bg-white hover:bg-[#FAF8F5] text-[#23201B] font-bold text-sm transition-all shadow-xs hover:-translate-y-0.5"
              >
                Explore Live Portals
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-[#706B62]">
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-[#C4993C]" strokeWidth={2.5} />
                <span>Affordable 50/50 Revenue Share Model</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-[#C4993C]" strokeWidth={2.5} />
                <span>Zero Server Maintenance Required</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Educational Object (Knowledge Book, Graduation Cap, Diploma & Star Badge) */}
          <div id="hero-3d-wrap" className="lg:col-span-5 flex items-center justify-center relative">
            <Hero3DObject />
          </div>
        </div>

        {/* ── Bottom Section Ticker Bar ── */}
        <div
          id="hero-ticker"
          className="border-y border-[#EBE8E2] py-4 my-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#4A453E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4993C]" />
            <span>ACADEMIC GRADEBOOK</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#4A453E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4993C]" />
            <span>AUTOMATED 3-FOLD CHALLANS</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#4A453E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4993C]" />
            <span>DIGITAL PARENT DIARY</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#4A453E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4993C]" />
            <span>PRINCIPAL CONTROL ROOM</span>
          </div>
        </div>

        {/* ── Realistic Interactive School Dashboard Showcase ── */}
        <div id="hero-dashboard-section" className="w-full max-w-6xl mx-auto pt-6">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C4993C] font-bold">LIVE PREVIEW</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#23201B] mt-1">
              Autonomous Principal Control Room
            </h2>
          </div>

          <div className="w-full rounded-2xl md:rounded-3xl border border-[#EBE8E2] bg-white shadow-[0_24px_80px_rgba(35,32,27,0.08)] overflow-hidden">
            {/* Window bar */}
            <div className="h-10 bg-[#FAF8F5] border-b border-[#EBE8E2] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#E57373]" />
                <div className="w-3 h-3 rounded-full bg-[#FFB74D]" />
                <div className="w-3 h-3 rounded-full bg-[#81C784]" />
              </div>
              <div className="flex-1" />
              <div className="h-6 px-4 bg-white border border-[#EBE8E2] rounded-md shadow-xs mx-auto flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#8C877D]">
                <span className="w-2 h-2 rounded-full bg-[#C4993C]" />
                <span>app.skoolms.edu/admin-dashboard</span>
              </div>
              <div className="flex-1" />
            </div>

            {/* Dashboard content */}
            <div className="flex flex-col md:flex-row min-h-[460px] bg-[#FAF8F5]">
              {/* Sidebar */}
              <div className="w-full md:w-56 bg-[#1A1A1A] text-white p-4 flex flex-col justify-between border-r border-[#2A2A2A]">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C4993C] to-[#D4A843] flex items-center justify-center text-white font-bold text-xs">
                      SK
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Skoolms</div>
                      <div className="text-[9px] font-mono text-[#C4993C] uppercase tracking-wider">ADMINISTRATOR</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white font-bold flex items-center gap-2 shadow-sm">
                      <BarChart3 size={14} /> Overview
                    </div>
                    <div className="px-3 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-2">
                      <Users size={14} /> Students (1,248)
                    </div>
                    <div className="px-3 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-2">
                      <Clock size={14} /> Attendance (94.2%)
                    </div>
                    <div className="px-3 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-2">
                      <Award size={14} /> Fee Collection
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#C4993C] flex items-center justify-center text-white font-bold text-[10px]">
                    AD
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-white text-[11px]">Principal Office</div>
                    <div className="text-[9px] text-slate-400">Oakridge Academy</div>
                  </div>
                </div>
              </div>

              {/* Main Preview Area */}
              <div className="flex-1 p-5 md:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#EBE8E2] pb-4">
                  <div>
                    <h3 className="font-bold text-xl text-[#23201B] font-serif">Principal Dashboard</h3>
                    <p className="text-xs text-[#706B62]">Live metrics across student admissions, fee recovery, and faculty.</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white border border-[#EBE8E2] text-xs font-semibold text-[#706B62]">
                    Academic Year 2026–2027
                  </div>
                </div>

                {/* 5 Top Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-[#EBE8E2] shadow-xs">
                    <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block mb-1">Total Students</span>
                    <div className="font-bold text-lg text-[#23201B] font-serif">1,248</div>
                    <span className="text-[10px] text-emerald-600 font-bold">↗ 3.2% vs last term</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#EBE8E2] shadow-xs">
                    <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block mb-1">Total Staff</span>
                    <div className="font-bold text-lg text-[#23201B] font-serif">86</div>
                    <span className="text-[10px] text-emerald-600 font-bold">↗ 2.4% full faculty</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#EBE8E2] shadow-xs">
                    <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block mb-1">Attendance Rate</span>
                    <div className="font-bold text-lg text-[#23201B] font-serif">94.2%</div>
                    <span className="text-[10px] text-emerald-600 font-bold">↗ 1.2% daily active</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#EBE8E2] shadow-xs">
                    <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block mb-1">Fee Collection</span>
                    <div className="font-bold text-lg text-[#23201B] font-serif">PKR 4.8M</div>
                    <span className="text-[10px] text-emerald-600 font-bold">↗ 96.4% recovery</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#EBE8E2] shadow-xs col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block mb-1">Pending Fees</span>
                    <div className="font-bold text-lg text-amber-700 font-serif">PKR 350K</div>
                    <span className="text-[10px] text-amber-700 font-semibold">18 installments due</span>
                  </div>
                </div>

                {/* Graph preview */}
                <div className="bg-white rounded-xl border border-[#EBE8E2] p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#23201B]">Daily Student Attendance Trend</span>
                    <div className="flex items-center gap-3 text-[11px] text-[#706B62]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Present (94%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Absent (4%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Late (2%)</span>
                    </div>
                  </div>
                  <div className="h-28 w-full flex items-end gap-2 pt-2">
                    {[92, 95, 94, 96, 95, 93, 94, 96, 97, 95, 96, 94, 95, 96, 95].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-[#C4993C]/40 to-[#C4993C]"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
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
