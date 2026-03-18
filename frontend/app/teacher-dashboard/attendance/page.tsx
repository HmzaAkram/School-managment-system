"use client";

const students = [
  { id: 1, name: 'Ali Hassan',    status: 'Present',  streak: 15, avatar: 'AH' },
  { id: 2, name: 'Sara Ahmed',    status: 'Present',  streak: 8,  avatar: 'SA' },
  { id: 3, name: 'Omar Sheikh',   status: 'Absent',   streak: 0,  avatar: 'OS' },
  { id: 4, name: 'Zara Qureshi',  status: 'Late',     streak: 0,  avatar: 'ZQ' },
  { id: 5, name: 'Bilal Nawaz',   status: 'Present',  streak: 22, avatar: 'BN' },
];

export default function TeacherAttendance() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Take Attendance</h1>
          <p className="text-slate-500 text-sm">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <select className="text-sm border-slate-200 rounded-lg text-slate-800 font-semibold bg-white p-2.5 shadow-sm outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400">
          <option>Class 10-A (Mathematics)</option>
          <option>Class 9-B (Mathematics)</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Student</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Attendance Streak</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Mark Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                      {s.avatar}
                    </div>
                    <div className="font-semibold text-slate-800">{s.name}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {s.streak > 5 ? (
                    <span className="flex items-center gap-1.5 text-orange-500 text-xs font-bold bg-orange-50 px-2.5 py-1 rounded-full w-max">
                      🔥 {s.streak} Days
                    </span>
                  ) : <span className="text-slate-400 text-xs">—</span>}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    {['Present', 'Absent', 'Late'].map((st) => (
                      <button
                        key={st}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          s.status === st && st === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          s.status === st && st === 'Absent' ? 'bg-red-50 text-red-600 border-red-200' :
                          s.status === st && st === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(6,182,212,0.25)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 transition-all">
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}
