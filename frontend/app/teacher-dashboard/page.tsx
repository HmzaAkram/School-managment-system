"use client";

const schedule = [
  { time: '08:00 AM', subject: 'Mathematics', class: '10-A', type: 'Lecture', current: false },
  { time: '09:30 AM', subject: 'Mathematics', class: '9-B',  type: 'Lecture', current: true },
  { time: '11:00 AM', subject: 'Break',       class: '-',    type: '-',       current: false },
  { time: '11:45 AM', subject: 'Physics Lab', class: '10-A', type: 'Lab',     current: false },
];

export default function TeacherOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Welcome back, Sarah! 👋</h1>
        <p className="text-slate-500 text-sm">You have 3 classes today and 12 assignments to grade.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Total Students', value: '142', icon: '👨‍🎓', color: 'from-primary to-accent' },
          { label: 'Classes Today',  value: '3',   icon: '🏫', color: 'from-accent to-accent-cyan' },
          { label: 'To Grade',       value: '12',  icon: '📝', color: 'from-[#D4A843] to-[#E3C273]' },
          { label: 'Avg Attendance', value: '94%', icon: '📋', color: 'from-emerald-500 to-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(212,168,67,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm mb-4`}>{s.icon}</div>
            <div className="text-2xl font-extrabold font-sora text-slate-900 mb-1">{s.value}</div>
            <div className="text-sm text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Today's Schedule</h2>
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
            {schedule.map((item, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${item.current ? 'bg-primary shadow-[0_0_0_4px_rgba(212,168,67,0.2)]' : 'bg-slate-300'}`} />
                <div className="text-xs font-bold text-slate-400 mb-1">{item.time}</div>
                <div className={`p-4 rounded-xl border ${item.current ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className={`font-semibold ${item.current ? 'text-primary' : 'text-slate-700'}`}>{item.subject}</h4>
                  <div className={`text-sm mt-1 ${item.current ? 'text-accent' : 'text-slate-500'}`}>Class: {item.class} • {item.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Action Items</h2>
          <div className="space-y-3">
            {[
              { text: 'Grade Mid-Term Math Exams (10-A)', urgent: true,  icon: '📝' },
              { text: 'Submit Attendance for yesterday',  urgent: true,  icon: '📋' },
              { text: 'Review Science Project Proposals', urgent: false, icon: '🔬' },
              { text: 'Prepare notes for 9-B Lecture',    urgent: false, icon: '📚' },
            ].map((a, i) => (
              <div key={i} className="flex gap-4 items-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">{a.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">{a.text}</p>
                  {a.urgent && <span className="text-[10px] font-bold px-2 py-0.5 rounded text-red-600 bg-red-50 mt-1 inline-block">URGENT</span>}
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
