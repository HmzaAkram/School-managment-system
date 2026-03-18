"use client";

const myClasses = [
  { subject: 'Mathematics',       teacher: 'Mr. Ahmad Shah',  room: 'A-101', icon: '📐', grade: 'A+' },
  { subject: 'English',           teacher: 'Ms. Fatima Ali',  room: 'A-102', icon: '📖', grade: 'A'  },
  { subject: 'Physics',           teacher: 'Mr. Zain Khan',   room: 'A-103', icon: '🔬', grade: 'A'  },
  { subject: 'Biology',           teacher: 'Ms. Sara Malik',  room: 'A-104', icon: '🧬', grade: 'B+' },
  { subject: 'Chemistry',         teacher: 'Mr. Usman Raza',  room: 'A-105', icon: '⚗️', grade: 'A'  },
  { subject: 'Physical Education',teacher: 'Mr. Hassan',      room: 'Gym',   icon: '⚽', grade: 'A+' },
];

export default function StudentClasses() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900">My Classes</h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {myClasses.map((cls, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.09)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="text-3xl mb-4">{cls.icon}</div>
            <h3 className="font-sora font-bold text-slate-800 mb-3">{cls.subject}</h3>
            <div className="space-y-2 text-sm text-slate-500 mb-4">
              <div className="flex justify-between"><span>Teacher</span><span className="font-medium text-slate-700">{cls.teacher}</span></div>
              <div className="flex justify-between"><span>Room</span><span className="font-medium text-slate-700">{cls.room}</span></div>
              <div className="flex justify-between"><span>Current Grade</span>
                <span className={`font-bold ${cls.grade.startsWith('A') ? 'text-emerald-600' : 'text-blue-600'}`}>{cls.grade}</span>
              </div>
            </div>
            <button className="w-full py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-purple-400 hover:text-purple-600 transition-colors">
              View Syllabus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
