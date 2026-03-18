"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";

const packages = [
  {
    name: "Basic",
    subtitle: "Get Your School Online",
    price: "Rs 60,000",
    duration: "7 Days Delivery",
    target: "Best for small schools testing digital management.",
    features: [
      "Complete BrightScope frontend",
      "Student Dashboard (Grades, Fees, Diary)",
      "Teacher Dashboard (Attendance, Reviews)",
      "Admin Dashboard (Manage Users, Notices)",
      "3 role-based logins",
      "Fully responsive layout",
      "1 round of revisions after delivery",
    ],
    notIncluded: [
      "No live hosting (local only)",
      "No custom domain",
      "No SEO optimization",
      "No ongoing post-handover support",
      "No backend / real database",
    ],
    popular: false,
    gradient: "from-slate-200 to-slate-300",
    buttonClass: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    name: "Professional",
    subtitle: "Launch Your School Platform",
    price: "Rs 80,000",
    duration: "10 Days Delivery",
    target: "Best for schools ready to go live professionally.",
    features: [
      "Everything in Basic, PLUS:",
      "Full deployment to live server (Vercel)",
      "Custom domain & SSL certificate setup",
      "Basic on-page SEO & Open Graph tags",
      "Google Search Console configuration",
      "Sitemap and robots.txt setup",
      "Performance optimization (Lighthouse 85+)",
      "30 days of post-launch support",
      "2 rounds of revisions before launch",
    ],
    notIncluded: [
      "No backend / real database",
      "No monthly maintenance after 30 days",
      "No content writing or photography",
    ],
    popular: true,
    gradient: "from-[#3B4FE8] to-[#7C3AED]",
    buttonClass: "bg-gradient-primary text-white shadow-[0_8px_20px_rgba(59,79,232,0.3)] hover:shadow-[0_12px_25px_rgba(59,79,232,0.4)] hover:-translate-y-0.5",
  },
  {
    name: "Premium",
    subtitle: "Full School Solution",
    price: "Rs 1,00,000",
    duration: "15 Days Delivery",
    target: "Best for schools wanting a complete production-ready system.",
    features: [
      "Everything in Professional, PLUS:",
      "Full backend integration & real database",
      "Real user authentication system",
      "Data persists permanently",
      "Advanced SEO & Local SEO (Google Maps)",
      "Monthly maintenance plan available",
      "Custom branding (colors, logos, name)",
      "1 hour dedicated video onboarding",
      "Priority WhatsApp/Email support (3mo)",
      "1st year hosting & domain managed by us",
    ],
    notIncluded: [],
    popular: false,
    gradient: "from-[#06B6D4] to-[#6366F1]",
    buttonClass: "bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white shadow-[0_8px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_12px_25px_rgba(6,182,212,0.4)] hover:-translate-y-0.5",
  }
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Simple Pricing</span>
          <h2 className="font-sora font-extrabold text-slate-900 text-3xl md:text-5xl leading-tight mb-5">
            Transparent packages for every school size.
          </h2>
          <p className="text-slate-500 text-lg">
            Choose the package that perfectly aligns with your school's digital transformation goals. No hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {packages.map((pkg, i) => (
            <div 
              key={i} 
              className={`pricing-card relative bg-white rounded-3xl p-8 border hover:-translate-y-2 transition-all duration-300 flex flex-col h-full ${
                pkg.popular 
                  ? "border-[#3B4FE8]/30 shadow-[0_20px_60px_rgba(59,79,232,0.1)] ring-1 ring-[#3B4FE8]/10" 
                  : "border-slate-100 shadow-sm hover:shadow-xl"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-sora font-bold text-2xl text-slate-900 mb-1">{pkg.name}</h3>
                <p className="text-slate-500 text-sm font-medium h-4">{pkg.subtitle}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold font-sora text-slate-900">{pkg.price}</span>
                </div>
                <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 inline-block px-2.5 py-1 rounded-md mt-2">
                  ⏱ {pkg.duration}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm text-slate-600 leading-relaxed mb-6">
                {pkg.target}
              </div>

              <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-8 ${pkg.buttonClass}`}>
                Get Started with {pkg.name}
              </button>

              <div className="flex-1 space-y-4">
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">What's Included</p>
                <ul className="space-y-3">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <Check size={16} className="text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                {pkg.notIncluded.length > 0 && (
                  <>
                    <div className="h-px bg-slate-100 my-5" />
                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Not Included</p>
                    <ul className="space-y-3">
                      {pkg.notIncluded.map((f, j) => (
                        <li key={j} className="flex items-start gap-3 opacity-60">
                          <div className="mt-0.5 flex-shrink-0">
                            <X size={16} className="text-slate-400" strokeWidth={2.5} />
                          </div>
                          <span className="text-sm text-slate-500 line-through">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
