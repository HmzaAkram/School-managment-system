"use client";

const exams = [
  { subject: 'Mathematics', date: '2026-03-28', time: '10:00 AM – 1:00 PM' },
  { subject: 'Physics',     date: '2026-03-30', time: '2:00 PM – 4:30 PM'  },
  { subject: 'Chemistry',   date: '2026-04-05', time: '10:00 AM – 12:00 PM'},
];

export default function StudentOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Welcome back, Ali! 👋</h1>
        <p className="text-slate-500 text-sm">Roll No: 10-A-042 | Class: 10-A | Academic Year 2025–26</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Overall GPA',      value: '3.9/4.0', icon: '🎓', color: 'from-[#7C3AED] to-[#EC4899]' },
          { label: 'Avg Attendance',   value: '93%',     icon: '📋', color: 'from-[#3B4FE8] to-[#7C3AED]' },
          { label: 'Assignments Done', value: '12/15',   icon: '📝', color: 'from-[#06B6D4] to-[#6366F1]' },
          { label: 'Fees Status',      value: 'Paid ✓',  icon: '💰', color: 'from-[#10B981] to-[#06B6D4]' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm mb-4`}>{s.icon}</div>
            <div className="text-2xl font-extrabold font-sora text-slate-900 mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming exams */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Upcoming Exams 📅</h2>
          <div className="space-y-3">
            {exams.map((exam, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{exam.subject}</div>
                  <div className="text-xs text-slate-400">{exam.time}</div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700">{exam.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Announcements 📢</h2>
          <div className="space-y-3">
            {[
              { text: 'Mid-term exams starting next week. Prepare well!', dot: 'bg-red-400', date: 'Today' },
              { text: 'Annual Sports Day event scheduled for April 15.',   dot: 'bg-amber-400', date: 'Yesterday' },
              { text: 'Parent-teacher meeting on April 5, 2026.',          dot: 'bg-blue-400', date: '2 days ago' },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
