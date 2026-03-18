"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Users, BookOpen, Clock, Star } from "lucide-react";

const classes = [
  {
    name: "Grade 8 — Science Stream",
    teacher: "Mr. Zain Khan",
    students: 42,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    schedule: "Mon–Fri, 8:00 AM – 2:00 PM",
    avgGrade: "A",
    color: "from-[#3B4FE8] to-[#7C3AED]",
    badge: "bg-blue-50 text-blue-700",
    icon: "🔬",
  },
  {
    name: "Grade 9-A — Arts Stream",
    teacher: "Ms. Fatima Ali",
    students: 38,
    subjects: ["English Literature", "History", "Geography", "Urdu", "Arts"],
    schedule: "Mon–Fri, 8:00 AM – 2:00 PM",
    avgGrade: "A+",
    color: "from-[#06B6D4] to-[#6366F1]",
    badge: "bg-cyan-50 text-cyan-700",
    icon: "🎨",
  },
  {
    name: "Grade 9-B — Commerce",
    teacher: "Mr. Usman Raza",
    students: 44,
    subjects: ["Accounting", "Economics", "Business Studies", "Mathematics", "English"],
    schedule: "Mon–Fri, 8:00 AM – 2:00 PM",
    avgGrade: "B+",
    color: "from-[#7C3AED] to-[#EC4899]",
    badge: "bg-purple-50 text-purple-700",
    icon: "📊",
  },
  {
    name: "Grade 10-A — Computer Science",
    teacher: "Ms. Sara Malik",
    students: 45,
    subjects: ["Computer Science", "Mathematics", "Physics", "English", "Pak Studies"],
    schedule: "Mon–Fri, 8:00 AM – 2:00 PM",
    avgGrade: "A",
    color: "from-[#0EA5E9] to-[#3B4FE8]",
    badge: "bg-sky-50 text-sky-700",
    icon: "💻",
  },
  {
    name: "Grade 10-B — Pre-Medical",
    teacher: "Mr. Ahmad Shah",
    students: 48,
    subjects: ["Biology", "Chemistry", "Physics", "Mathematics", "English"],
    schedule: "Mon–Fri, 8:00 AM – 2:00 PM",
    avgGrade: "A+",
    color: "from-[#10B981] to-[#06B6D4]",
    badge: "bg-emerald-50 text-emerald-700",
    icon: "🧬",
  },
  {
    name: "Grade 11 — Engineering",
    teacher: "Dr. Imran Khan",
    students: 36,
    subjects: ["Advanced Mathematics", "Physics", "Chemistry", "Engineering Drawing", "English"],
    schedule: "Mon–Fri, 8:00 AM – 3:00 PM",
    avgGrade: "A",
    color: "from-[#F59E0B] to-[#EF4444]",
    badge: "bg-amber-50 text-amber-700",
    icon: "⚙️",
  },
];

export default function Classes() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE]">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-20 pb-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none -translate-y-1/3 -translate-x-1/4"
            style={{ background: "linear-gradient(135deg,#06B6D4,#6366F1)", filter: "blur(80px)" }} />

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-6" style={{ backgroundColor: "rgba(59,79,232,0.08)", color: "#3B4FE8" }}>
                Academic Programs
              </span>
              <h1 className="font-sora font-extrabold text-slate-900 leading-tight mb-6" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
                World-Class{" "}
                <span className="text-gradient">Classes</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                Discover our diverse academic programs designed to unlock every student's full potential.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Classes grid */}
        <section id="classes" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
              {classes.map((cls, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_16px_50px_rgba(59,79,232,0.10)] transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  {/* Colored top bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${cls.color}`} />

                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-5">
                      <span className="text-4xl">{cls.icon}</span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${cls.badge}`}>Avg Grade: {cls.avgGrade}</span>
                    </div>

                    <h3 className="font-sora font-bold text-slate-900 text-xl mb-1">{cls.name}</h3>
                    <p className="text-slate-500 text-sm mb-5">Class Teacher: {cls.teacher}</p>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {cls.subjects.map((sub) => (
                        <span key={sub} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">{sub}</span>
                      ))}
                    </div>

                    <div className="mt-auto space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-5">
                      <div className="flex items-center gap-2"><Users size={14} className="text-primary" />{cls.students} Students enrolled</div>
                      <div className="flex items-center gap-2"><Clock size={14} className="text-primary" />{cls.schedule}</div>
                    </div>

                    <button className={`w-full mt-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${cls.color} shadow-sm hover:shadow-md transition-shadow`}>
                      View Curriculum →
                    </button>
                  </div>
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
