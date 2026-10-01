"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const events = [
  {
    date: "Mar 28, 2026",
    day: "28",
    month: "MAR",
    title: "Annual Science Exhibition",
    desc: "Students showcase their innovative science projects. Open to parents and the public. Awards for top 3 projects in each category.",
    time: "9:00 AM – 4:00 PM",
    location: "Skoolms Academy Main Hall",
    attendees: "500+ expected",
    category: "Academic",
    color: "from-[#3B4FE8] to-[#7C3AED]",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    date: "Apr 05, 2026",
    day: "5",
    month: "APR",
    title: "Parent-Teacher Conference",
    desc: "Meet your child's teachers, review academic progress, and discuss development opportunities for the upcoming term.",
    time: "10:00 AM – 1:00 PM",
    location: "School Conference Rooms",
    attendees: "All Parents",
    category: "Meeting",
    color: "from-[#06B6D4] to-[#6366F1]",
    badge: "bg-cyan-100 text-cyan-700",
  },
  {
    date: "Apr 15, 2026",
    day: "15",
    month: "APR",
    title: "Annual Sports Day",
    desc: "The biggest sporting event of the year! Students compete in track & field, football, cricket, and swimming events.",
    time: "8:00 AM – 6:00 PM",
    location: "School Sports Ground",
    attendees: "1,200+ expected",
    category: "Sports",
    color: "from-[#7C3AED] to-[#EC4899]",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    date: "Apr 25, 2026",
    day: "25",
    month: "APR",
    title: "Mid-Term Exams Begin",
    desc: "Term 2 mid-term examination period. All students must bring their admit cards and stationery. No electronic devices allowed.",
    time: "9:00 AM – 2:00 PM",
    location: "All Classrooms",
    attendees: "All Students",
    category: "Exams",
    color: "from-[#F59E0B] to-[#EF4444]",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    date: "May 10, 2026",
    day: "10",
    month: "MAY",
    title: "Cultural Fest 2026",
    desc: "A celebration of art, drama, music, and talent. Students perform in front of the school community. All are welcome!",
    time: "3:00 PM – 8:00 PM",
    location: "School Auditorium",
    attendees: "800+ expected",
    category: "Cultural",
    color: "from-[#10B981] to-[#06B6D4]",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    date: "May 30, 2026",
    day: "30",
    month: "MAY",
    title: "Graduation Ceremony",
    desc: "Celebrating the graduating class of 2026. Join us in honoring our students' hard work, dedication, and achievement.",
    time: "5:00 PM – 9:00 PM",
    location: "International Convention Center",
    attendees: "2,000+ guests",
    category: "Ceremony",
    color: "from-[#3B4FE8] to-[#06B6D4]",
    badge: "bg-blue-100 text-blue-700",
  },
];

export default function Events() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE]">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-20 pb-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none -translate-y-1/3 translate-x-1/4"
            style={{ background: "linear-gradient(135deg,#3B4FE8,#7C3AED)", filter: "blur(80px)" }} />
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block font-mono text-xs uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-6" style={{ backgroundColor: "rgba(59,79,232,0.08)", color: "#3B4FE8" }}>
                School Events
              </span>
              <h1 className="font-sora font-extrabold text-slate-900 leading-tight mb-6" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
                What's Happening at{" "}
                <span className="text-gradient">Skoolms</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                Stay up to date with school events, parent meetings, exams, and celebrations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events list */}
        <section id="events" className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col gap-8">
              {events.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_16px_50px_rgba(59,79,232,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Date block */}
                    <div className={`flex-shrink-0 w-full md:w-28 min-h-[80px] md:min-h-full bg-gradient-to-br ${ev.color} flex flex-row md:flex-col items-center justify-center gap-3 md:gap-1 p-4 md:p-6`}>
                      <span className="text-white/80 font-mono text-xs tracking-widest font-bold">{ev.month}</span>
                      <span className="text-white font-sora font-extrabold text-4xl leading-none">{ev.day}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                        <h3 className="font-sora font-bold text-slate-900 text-xl">{ev.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${ev.badge} flex-shrink-0`}>{ev.category}</span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-5">{ev.desc}</p>
                      <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" />{ev.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" />{ev.location}</span>
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" />{ev.attendees}</span>
                      </div>
                    </div>
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
