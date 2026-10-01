"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", school: "", role: "admin", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const benefits = [
    "Free 30-day trial — no credit card needed",
    "Setup assistance included",
    "Unlimited students in trial",
    "Cancel anytime, no lock-in",
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9FE] overflow-hidden">
      {/* Left panel — benefits */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 animate-gradient-shift p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center font-sora font-bold text-white text-sm">
            SK
          </div>
          <span className="font-sora font-bold text-xl text-white">Skoolms</span>
        </Link>

        {/* Middle content */}
        <div className="relative z-10">
          <h2 className="font-sora font-extrabold text-white text-4xl leading-tight mb-6">
            The smartest way to run your school.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Join 500+ schools already saving time and improving outcomes with Skoolms.
          </p>

          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-white/90 text-sm font-medium">{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 border border-white/20 backdrop-blur rounded-2xl p-5">
          <p className="text-white/90 text-sm italic mb-4">
            "We set up Skoolms in 5 days. The support team was incredible. Now I can manage everything from my phone."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center font-bold text-white text-xs">AR</div>
            <div>
              <div className="text-white text-sm font-semibold">Ahmad Raza</div>
              <div className="text-white/60 text-xs">Principal, Al-Noor School</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center font-sora font-bold text-white text-xs shadow-md">SK</div>
            <span className="font-sora font-bold text-lg text-slate-800">Skoolms</span>
          </Link>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white rounded-3xl border border-slate-100 shadow-sm p-12">
              <div className="text-6xl mb-5">🎉</div>
              <h2 className="font-sora font-bold text-slate-900 text-2xl mb-3">Account Created!</h2>
              <p className="text-slate-500 mb-8">Your free trial is now active. Check your email to verify and get started.</p>
              <Link href="/login" className="block w-full py-3 rounded-xl bg-gradient-primary text-white font-bold text-center shadow-md hover:shadow-lg transition-shadow">
                Go to Login →
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="font-sora font-extrabold text-slate-900 text-3xl mb-2">Create your account</h1>
              <p className="text-slate-500 mb-8">Start your 30-day free trial. No credit card required.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ key: "name", label: "Full Name", type: "text", placeholder: "Ahmad Raza" }, { key: "email", label: "Email", type: "email", placeholder: "you@school.edu" }].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        required
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                  ))}
                </div>

                {/* School name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">School Name</label>
                  <input
                    type="text" placeholder="Skoolms Academy" required
                    value={form.school}
                    onChange={(e) => setForm((p) => ({ ...p, school: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                {/* Role select */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="admin">Principal / Administrator</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Create a strong password"
                      minLength={8} required
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-primary text-white font-bold text-base shadow-[0_8px_24px_rgba(59,79,232,0.25)] hover:shadow-[0_16px_40px_rgba(59,79,232,0.35)] hover:-translate-y-0.5 transition-all"
                >
                  Create Free Account →
                </button>

                <p className="text-xs text-slate-400 text-center">
                  By signing up you agree to our{" "}
                  <a href="#" className="underline hover:text-slate-600">Terms</a> and{" "}
                  <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
                </p>
              </form>

              <p className="text-center text-sm text-slate-500 mt-8">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-accent transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
