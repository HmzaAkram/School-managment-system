"use client";

const students = [
  { id: 1, name: 'Ali Hassan',    class: '10-A', grade: 'A+', score: 95, previous: 92 },
  { id: 2, name: 'Sara Ahmed',    class: '10-A', grade: 'A',  score: 88, previous: 85 },
  { id: 3, name: 'Omar Sheikh',   class: '10-A', grade: 'B+', score: 79, previous: 82 },
  { id: 4, name: 'Zara Qureshi',  class: '10-A', grade: 'A-', score: 91, previous: 89 },
];

export default function TeacherPerformance() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Student Performance</h1>
      
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-sora font-bold text-slate-800 mb-4">Class Average (10-A)</h3>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-extrabold font-sora text-slate-900">88.5%</div>
            <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-1">↑ 2.4% from last term</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-sora font-bold text-slate-800 mb-4">Top Performers</h3>
          <div className="flex gap-3">
            {['AH', 'SA', 'ZQ'].map((initials, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm ring-2 ring-slate-100 -ml-2 first:ml-0">
                {initials}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border-2 border-white shadow-sm ring-2 ring-slate-100 -ml-2">
              +5
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-sora font-bold text-slate-800">Grade Book — Term 2</h2>
          <select className="text-sm border-slate-200 rounded-lg text-slate-600 bg-slate-50 px-3 py-1.5 focus:border-cyan-400 focus:ring focus:ring-cyan-100 outline-none">
            <option>Class 10-A (Mathematics)</option>
            <option>Class 9-B (Mathematics)</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Student</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Previous Score</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Current Score</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-800">{s.name}</td>
                <td className="py-4 px-6 text-slate-500">{s.previous}%</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{s.score}%</span>
                    {s.score > s.previous ? (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">↑ {(s.score - s.previous).toFixed(1)}</span>
                    ) : (
                      <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">↓ {(s.previous - s.score).toFixed(1)}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    s.grade.startsWith('A') ? 'bg-cyan-50 text-cyan-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {s.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
