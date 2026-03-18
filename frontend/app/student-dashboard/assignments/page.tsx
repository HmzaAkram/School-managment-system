"use client";

const assignments = [
  { title: 'Chapter 5 Exercises',   subject: 'Mathematics', due: '2026-03-20', status: 'Pending'   },
  { title: 'Essay: Climate Change', subject: 'English',     due: '2026-03-22', status: 'Submitted' },
  { title: 'Physics Lab Report',    subject: 'Physics',     due: '2026-03-25', status: 'Pending'   },
  { title: 'Cell Structure Diagram',subject: 'Biology',     due: '2026-03-10', status: 'Submitted' },
];

export default function StudentAssignments() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900">My Assignments</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Assignment</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Subject</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Due Date</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-800">{a.title}</td>
                <td className="py-4 px-6 text-slate-500">{a.subject}</td>
                <td className="py-4 px-6 text-slate-500">{a.due}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {a.status === 'Pending' ? (
                    <button className="text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all">Submit</button>
                  ) : (
                    <button className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
