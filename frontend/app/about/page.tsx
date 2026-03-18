"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Check, Users, Globe, Shield, Zap, Award } from "lucide-react";

const team = [
  { name: "Dr. Imran Khalid",   role: "CEO & Founder",              initials: "IK", grad: "from-[#3B4FE8] to-[#7C3AED]" },
  { name: "Ms. Ayesha Noor",    role: "Chief Technology Officer",   initials: "AN", grad: "from-[#06B6D4] to-[#6366F1]" },
  { name: "Mr. Bilal Hassan",   role: "Head of Product",            initials: "BH", grad: "from-[#7C3AED] to-[#EC4899]" },
  { name: "Ms. Zara Siddiqui",  role: "Head of Customer Success",   initials: "ZS", grad: "from-[#0EA5E9] to-[#3B4FE8]" },
  { name: "Mr. Saad Farooq",    role: "Lead Engineer",              initials: "SF", grad: "from-[#10B981] to-[#06B6D4]" },
  { name: "Ms. Hira Malik",     role: "UX Design Lead",             initials: "HM", grad: "from-[#F59E0B] to-[#EF4444]" },
];

const values = [
  { icon: <Users size={24} className="text-white" />, title: "Student First",   desc: "Every feature we build starts with how it will benefit the student.",      color: "from-[#3B4FE8] to-[#7C3AED]" },
  { icon: <Globe size={24} className="text-white" />, title: "Accessible",      desc: "Education technology should be affordable and accessible to all schools.", color: "from-[#06B6D4] to-[#6366F1]" },
  { icon: <Shield size={24} className="text-white" />,title: "Trustworthy",     desc: "Your school's data is protected with enterprise-grade security.",          color: "from-[#7C3AED] to-[#EC4899]" },
  { icon: <Zap size={24} className="text-white" />,   title: "Innovative",      desc: "We constantly improve and add features driven by your feedback.",          color: "from-[#0EA5E9] to-[#3B4FE8]" },
  { icon: <Award size={24} className="text-white" />, title: "Excellence",      desc: "We hold ourselves to the highest standard in everything we do.",           color: "from-[#10B981] to-[#06B6D4]" },
  { icon: <Check size={24} className="text-white" />, title: "Reliable",        desc: "99.9% uptime. Built to never let your school down.",                       color: "from-[#F59E0B] to-[#EF4444]" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE]">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-20 pb-28 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none -translate-y-1/3 translate-x-1/4"
            style={{ background: "linear-gradient(135deg,#3B4FE8,#7C3AED)", filter: "blur(80px)" }} />
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-6" style={{ backgroundColor: "rgba(59,79,232,0.08)", color: "#3B4FE8" }}>
                About BrightScope
              </span>
              <h1 className="font-sora font-extrabold text-slate-900 leading-tight mb-6" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
                Built by Educators,{" "}
                <span className="text-gradient">for Educators</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                BrightScope was founded by a team of educators and engineers who believed schools deserved better than spreadsheets and paper forms.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 md:py-32 bg-[#F8F9FE]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <h2 className="font-sora font-bold text-slate-900 text-4xl mb-6">Our Mission</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  We believe that when administrators spend less time on paperwork, they have more time for what truly matters — nurturing students and supporting teachers.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  BrightScope is dedicated to making world-class school management tools accessible to every school, regardless of size or budget.
                </p>
                <ul className="space-y-3">
                  {["Total transparency for parents and students", "Less admin work, more teaching", "Real-time data to catch problems early", "Designed for schools in emerging markets"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    {[["🏫","500+ Schools","Across 20+ countries"],["👨‍🎓","50,000+","Students served"],["⭐","98%","Satisfaction rate"],["🚀","7 Days","Average setup time"]].map(([icon, val, lbl], i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                        <div className="text-3xl mb-3">{icon as string}</div>
                        <div className="font-sora font-extrabold text-2xl text-slate-900">{val as string}</div>
                        <div className="text-sm text-slate-500 mt-1">{lbl as string}</div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                    style={{ background: "linear-gradient(135deg,#3B4FE8,#7C3AED)", filter: "blur(40px)" }} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="text-center mb-16">
              <h2 className="font-sora font-bold text-slate-900 text-4xl mb-4">Our Values</h2>
              <p className="text-lg text-slate-500">Principles that guide every decision we make.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="bg-[#F8F9FE] rounded-2xl p-7 border border-slate-100 hover:shadow-[0_12px_40px_rgba(59,79,232,0.08)] hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-5 shadow-sm`}>{v.icon}</div>
                  <h3 className="font-sora font-bold text-slate-900 text-xl mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="about" className="py-24 bg-[#F8F9FE]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="text-center mb-16">
              <h2 className="font-sora font-bold text-slate-900 text-4xl mb-4">Meet the Team</h2>
              <p className="text-lg text-slate-500">educators, engineers, and designers on a mission.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-[0_12px_40px_rgba(59,79,232,0.08)] hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.grad} flex items-center justify-center font-sora font-bold text-white text-xl shadow-lg mx-auto mb-5`}>
                    {member.initials}
                  </div>
                  <h3 className="font-sora font-bold text-slate-900 text-lg">{member.name}</h3>
                  <p className="text-slate-500 mt-1 text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
