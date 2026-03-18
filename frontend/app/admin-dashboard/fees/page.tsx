"use client";

const students = [
  { id: 1, name: 'Ali Hassan',    class: '10-A', fees: true,  attendance: '98%', avatar: 'AH' },
  { id: 2, name: 'Sara Ahmed',    class: '10-A', fees: false, attendance: '92%', avatar: 'SA' },
  { id: 3, name: 'Omar Sheikh',   class: '10-B', fees: true,  attendance: '95%', avatar: 'OS' },
  { id: 4, name: 'Zara Qureshi',  class: '9-A',  fees: false, attendance: '88%', avatar: 'ZQ' },
  { id: 5, name: 'Bilal Nawaz',   class: '9-B',  fees: true,  attendance: '97%', avatar: 'BN' },
];

export default function AdminFees() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Fees Management</h1>
      
      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Fees', value: '$82,500', color: 'from-[#3B4FE8] to-[#7C3AED]', icon: '💵' },
          { label: 'Collected',  value: '$73,500', color: 'from-[#06B6D4] to-[#6366F1]', icon: '✅' },
          { label: 'Pending',    value: '$9,000',  color: 'from-[#F59E0B] to-[#EF4444]', icon: '⏳' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-4 shadow-sm`}>{f.icon}</div>
            <div className="text-sm text-slate-500 mb-1">{f.label}</div>
            <div className="text-3xl font-extrabold font-sora text-slate-900">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-sora font-bold text-slate-800">Fee Records</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-3 px-6 font-semibold text-slate-600">Student</th>
              <th className="text-left py-3 px-6 font-semibold text-slate-600">Class</th>
              <th className="text-left py-3 px-6 font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-6 font-medium text-slate-800">{s.name}</td>
                <td className="py-3 px-6 text-slate-500">{s.class}</td>
                <td className="py-3 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.fees ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {s.fees ? 'Paid' : 'Pending'}
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
