"use client";

const assignments = [
  { title: 'Algebra Worksheet 1',     class: '10-A', dueDate: '2026-03-20', submissions: '40/45', status: 'Active' },
  { title: 'Geometry Proofs',         class: '9-A',  dueDate: '2026-03-22', submissions: '35/48', status: 'Active' },
  { title: 'Trigonometry Quiz',       class: '10-B', dueDate: '2026-03-15', submissions: '42/42', status: 'Grading' },
  { title: 'Math Mid-Term Prep',      class: '10-A', dueDate: '2026-03-10', submissions: '45/45', status: 'Completed' },
];

export default function TeacherAssignments() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Assignments</h1>
        <button className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md">
          + Create Assignment
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Title</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Class</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Due Date</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Submissions</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="py-4 px-6 font-semibold text-slate-800">{a.title}</td>
                <td className="py-4 px-6 text-slate-500">{a.class}</td>
                <td className="py-4 px-6 text-slate-500">{a.dueDate}</td>
                <td className="py-4 px-6 text-slate-800 font-medium">{a.submissions}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    a.status === 'Active' ? 'bg-cyan-50 text-cyan-700' :
                    a.status === 'Grading' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {a.status}
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
