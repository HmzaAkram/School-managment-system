"use client";

const attendance = [
  { subject: 'Mathematics', pct: 96 },
  { subject: 'English',     pct: 92 },
  { subject: 'Physics',     pct: 98 },
  { subject: 'Biology',     pct: 88 },
  { subject: 'Chemistry',   pct: 91 },
];

export default function StudentAttendance() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900">My Attendance</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <p className="text-sm text-slate-500 font-semibold">Overall Attendance: <span className="text-emerald-600 font-bold">93%</span></p>
        </div>
        <div className="p-6 space-y-6">
          {attendance.map((a, i) => (
            <div key={i} className="flex items-center gap-5">
              <span className="w-28 text-sm font-semibold text-slate-700 flex-shrink-0">{a.subject}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${a.pct >= 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : a.pct >= 75 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                  style={{ width: `${a.pct}%` }}
                />
              </div>
              <span className={`text-sm font-bold w-12 text-right ${a.pct >= 90 ? 'text-emerald-600' : a.pct >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                {a.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
