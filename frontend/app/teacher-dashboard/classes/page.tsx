"use client";

const classes = [
  { name: 'Class 10-A', students: 45, timing: '08:00 AM – 09:30 AM',  room: 'A-101', progress: 75, topic: 'Trigonometry' },
  { name: 'Class 10-B', students: 42, timing: '10:00 AM – 11:30 AM',  room: 'A-102', progress: 68, topic: 'Algebra' },
  { name: 'Class 9-A',  students: 48, timing: '12:00 PM – 01:30 PM',  room: 'A-103', progress: 82, topic: 'Geometry' },
];

export default function TeacherClasses() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">My Classes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:translate-y-[-2px] transition-transform">
            <h3 className="font-sora font-bold text-slate-800 text-lg">{cls.name}</h3>
            <p className="text-slate-500 text-sm mb-4">Room {cls.room} • {cls.students} students</p>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 mb-4 border border-slate-100">
              <span className="font-semibold text-cyan-700">Timing:</span> {cls.timing}
            </div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-500">Syllabus Progress</span>
              <span className="text-cyan-700">{cls.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-gradient-to-r from-[#06B6D4] to-[#6366F1] rounded-full" style={{ width: `${cls.progress}%` }} />
            </div>
            <p className="text-xs text-slate-400">Current Topic: {cls.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
