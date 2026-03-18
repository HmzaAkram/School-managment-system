"use client";

const grades = [
  { subject: 'Mathematics', marks: 92, total: 100, grade: 'A+' },
  { subject: 'English',     marks: 85, total: 100, grade: 'A'  },
  { subject: 'Physics',     marks: 88, total: 100, grade: 'A'  },
  { subject: 'Biology',     marks: 78, total: 100, grade: 'B+' },
  { subject: 'Chemistry',   marks: 86, total: 100, grade: 'A'  },
];

export default function StudentGrades() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900">My Grades</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <p className="text-sm text-slate-500 font-semibold">Term 2 — 2025/26 Academic Year</p>
        </div>
        <div className="p-6 space-y-6">
          {grades.map((g, i) => (
            <div key={i} className="flex items-center gap-5">
              <span className="w-28 text-sm font-semibold text-slate-700 flex-shrink-0">{g.subject}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-full transition-all duration-1000" style={{ width: `${g.marks}%` }} />
              </div>
              <span className="text-sm font-bold text-slate-700 w-12 text-right">{g.marks}%</span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full w-12 text-center ${g.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                {g.grade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
