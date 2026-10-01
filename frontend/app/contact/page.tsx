"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", school: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contactInfo = [
    { icon: <Mail size={20} className="text-primary" />, label: "Email", value: "hello@skoolms.app" },
    { icon: <Phone size={20} className="text-primary" />, label: "Phone", value: "+1 (555) 123-4567" },
    { icon: <MapPin size={20} className="text-primary" />, label: "Address", value: "123 Education Lane, San Francisco, CA 94111" },
    { icon: <Clock size={20} className="text-primary" />, label: "Support Hours", value: "Mon–Fri, 9 AM – 6 PM PST" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE]">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-20 pb-24 bg-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none translate-y-1/3 -translate-x-1/4"
            style={{ background: "linear-gradient(135deg,#06B6D4,#3B4FE8)", filter: "blur(80px)" }} />

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-6" style={{ backgroundColor: "rgba(59,79,232,0.08)", color: "#3B4FE8" }}>
                Get In Touch
              </span>
              <h1 className="font-sora font-extrabold text-slate-900 leading-tight mb-6" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
                We'd Love to{" "}
                <span className="text-gradient">Hear From You</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                Have a question? Want a demo? Just want to say hello? We're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-14">

              {/* Form */}
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <h2 className="font-sora font-bold text-slate-900 text-3xl mb-8">Send a Message</h2>

                {sent ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-10 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-sora font-bold text-slate-900 text-xl mb-2">Message Sent!</h3>
                    <p className="text-slate-500">We'll get back to you within 1 business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        { key: "name", label: "Your Name", type: "text", placeholder: "Ahmad Raza" },
                        { key: "email", label: "Email Address", type: "email", placeholder: "ahmad@school.edu" },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={(form as any)[f.key]}
                            onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">School Name</label>
                      <input
                        type="text"
                        placeholder="Skoolms Academy"
                        value={form.school}
                        onChange={(e) => setForm((p) => ({ ...p, school: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                      <textarea
                        rows={5}
                        placeholder="Tell us about your school and what you're looking for..."
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-primary text-white font-bold text-base shadow-[0_8px_24px_rgba(59,79,232,0.25)] hover:shadow-[0_16px_40px_rgba(59,79,232,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> Send Message
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Info */}
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="flex flex-col gap-8">
                <div>
                  <h2 className="font-sora font-bold text-slate-900 text-3xl mb-4">Contact Information</h2>
                  <p className="text-slate-500 leading-relaxed">
                    Whether you have a quick question or need a full demo of the platform — our team is ready to help you.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_8px_24px_rgba(59,79,232,0.06)] transition-shadow">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(59,79,232,0.08)" }}>
                        {info.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">{info.label}</div>
                        <div className="text-slate-700 font-medium text-sm">{info.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA card */}
                <div className="bg-gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <h3 className="font-sora font-bold text-xl mb-2 relative z-10">Book a Free Demo</h3>
                  <p className="text-white/80 text-sm mb-5 relative z-10">See Skoolms in action with a personalized 30-minute walkthrough.</p>
                  <button className="relative z-10 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg transition-shadow">
                    Schedule Demo →
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
