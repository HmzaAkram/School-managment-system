"use client";

const diaries = [
  { date: '2026-03-18', subject: 'Mathematics', teacher: 'Mr. Ahmad Shah', note: 'Complete exercise 5.2 on page 45. Bring geometry boxes tomorrow.', type: 'Homework' },
  { date: '2026-03-18', subject: 'English',     teacher: 'Ms. Fatima Ali', note: 'Read chapter 4 and write a summary. Vocabulary quiz on Friday.', type: 'Homework' },
  { date: '2026-03-17', subject: 'Physics',     teacher: 'Mr. Zain Khan',  note: 'Revise Newton\'s laws of motion. Lab practicals starting next week.', type: 'Notice' },
  { date: '2026-03-16', subject: 'General',     teacher: 'Admin',          note: 'School timings will change to 8:00 AM - 1:00 PM starting Monday.', type: 'Announcement' },
];

export default function StudentDiaries() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">My Daily Diary</h1>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-sora font-bold text-slate-800">Recent Diary Entries</h2>
          <input type="date" className="p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400" />
        </div>
        
        <div className="divide-y divide-slate-100">
          {diaries.map((d, i) => (
            <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${d.type === 'Homework' ? 'bg-purple-500' : d.type === 'Notice' ? 'bg-cyan-500' : 'bg-blue-500'}`} />
                  <span className="font-bold text-slate-800">{d.subject}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">{d.type}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{d.date}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3 pl-5 border-l-2 border-slate-100 ml-1">{d.note}</p>
              <div className="pl-5 text-xs text-slate-400 font-medium flex items-center gap-1.5 ml-1">
                <span>By {d.teacher}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
