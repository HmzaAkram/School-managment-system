"use client";

const exams = [
  { title: 'Mid-Term Exam',        class: '10-A', date: '2026-03-25', time: '10:00 AM', room: 'Hall A' },
  { title: 'Weekly Quiz 4',        class: '9-B',  date: '2026-03-20', time: '09:00 AM', room: 'A-102' },
  { title: 'Mock Finals',          class: '10-A', date: '2026-04-15', time: '08:00 AM', room: 'Hall B' },
];

export default function TeacherExams() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Upcoming Exams</h1>
        <button className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md">
          + Schedule Exam
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((ex, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm border-t-4 border-t-cyan-400">
            <h3 className="font-sora font-bold text-slate-800 text-lg mb-1">{ex.title}</h3>
            <p className="text-slate-500 text-sm mb-4">Class: {ex.class}</p>
            <div className="space-y-2 text-sm text-slate-600 mb-5">
              <div className="flex justify-between"><span>Date</span><span className="font-semibold text-slate-800">{ex.date}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="font-semibold text-slate-800">{ex.time}</span></div>
              <div className="flex justify-between"><span>Location</span><span className="font-semibold text-slate-800">{ex.room}</span></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-sm text-cyan-700 bg-cyan-50 rounded-xl font-semibold hover:bg-cyan-100 transition-colors">Edit</button>
              <button className="flex-1 py-2 text-sm text-slate-700 bg-slate-50 rounded-xl font-semibold border border-slate-200 hover:bg-slate-100 transition-colors">Students list</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
