"use client";

import { motion } from "framer-motion";
import { Users, CheckSquare, CreditCard, BarChart2, MessageSquare, Briefcase } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    icon: <Users className="text-white" size={22} />,
    title: "Student Management",
    desc: "Complete student profiles, enrollment, academic history, and document storage in one place.",
    gradient: "from-[#C4993C] to-[#A37C27]",
  },
  {
    icon: <CheckSquare className="text-white" size={22} />,
    title: "Attendance Tracking",
    desc: "One-click digital attendance with instant SMS/email alerts to parents for absences.",
    gradient: "from-[#D4A843] to-[#C4993C]",
  },
  {
    icon: <CreditCard className="text-white" size={22} />,
    title: "Fee Management",
    desc: "Online payment portal, auto-invoicing, overdue reminders, and full financial reports.",
    gradient: "from-[#8B6914] to-[#C4993C]",
  },
  {
    icon: <BarChart2 className="text-white" size={22} />,
    title: "Reports & Analytics",
    desc: "Real-time dashboards, performance trends, attendance reports, and at-risk student alerts.",
    gradient: "from-[#C4993C] to-[#D4A843]",
  },
  {
    icon: <MessageSquare className="text-white" size={22} />,
    title: "Communication Portal",
    desc: "In-app messaging, school announcements, and parent portal — all in one secure place.",
    gradient: "from-[#A37C27] to-[#8B6914]",
  },
  {
    icon: <Briefcase className="text-white" size={22} />,
    title: "Staff Management",
    desc: "HR profiles, payroll, leave management, and performance evaluation for all staff.",
    gradient: "from-[#D4A843] to-[#A37C27]",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Subtle radial bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(196,153,60,0.07) 0%,transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] font-semibold mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(196,153,60,0.1)", color: "var(--color-accent)" }}>
            Platform Features
          </span>
          <h2 className="font-sora font-bold leading-tight mb-5" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--color-text)" }}>
            Everything Your School Needs
          </h2>
          <p className="text-lg md:text-xl leading-relaxed font-sans" style={{ color: "var(--color-text-muted)" }}>
            Built for principals, loved by teachers, trusted by parents.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feat, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(196,153,60,0.12)] transition-shadow transition-colors duration-300 group flex flex-col cursor-default"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-7 shadow-md relative overflow-hidden flex-shrink-0`}>
                <div className="absolute inset-0 bg-white/20 origin-top-left scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
                {feat.icon}
              </div>
              <h3 className="font-sora font-bold text-xl mb-3" style={{ color: "var(--color-text)" }}>{feat.title}</h3>
              <p className="font-sans leading-relaxed mb-7 flex-grow text-[0.95rem]" style={{ color: "var(--color-text-muted)" }}>{feat.desc}</p>
              <div className="mt-auto">
                <a href="#" className="inline-flex items-center font-semibold text-sm transition-colors" style={{ color: "var(--color-accent)" }}>
                  Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
