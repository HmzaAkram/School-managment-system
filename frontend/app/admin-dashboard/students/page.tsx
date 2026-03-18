"use client";

const students = [
  { id: 1, name: 'Ali Hassan',    class: '10-A', fees: true,  attendance: '98%', avatar: 'AH' },
  { id: 2, name: 'Sara Ahmed',    class: '10-A', fees: false, attendance: '92%', avatar: 'SA' },
  { id: 3, name: 'Omar Sheikh',   class: '10-B', fees: true,  attendance: '95%', avatar: 'OS' },
  { id: 4, name: 'Zara Qureshi',  class: '9-A',  fees: false, attendance: '88%', avatar: 'ZQ' },
  { id: 5, name: 'Bilal Nawaz',   class: '9-B',  fees: true,  attendance: '97%', avatar: 'BN' },
];

export default function AdminStudents() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Students</h1>
          <p className="text-slate-500 text-sm">1,248 students enrolled</p>
        </div>
        <button className="bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
          + Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Student</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Class</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Attendance</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Fees</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {s.avatar}
                    </div>
                    <div className="font-semibold text-slate-800">{s.name}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">{s.class}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED] rounded-full" style={{ width: s.attendance }} />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{s.attendance}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.fees ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {s.fees ? '✓ Paid' : '✗ Pending'}
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
