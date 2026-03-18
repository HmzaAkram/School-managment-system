"use client";

const teachers = [
  { id: 1, name: 'Mr. Ahmad Shah',   email: 'a.shah@school.edu',   subject: 'Mathematics',   classes: 3, avatar: 'AS' },
  { id: 2, name: 'Ms. Fatima Ali',   email: 'f.ali@school.edu',    subject: 'English',       classes: 2, avatar: 'FA' },
  { id: 3, name: 'Mr. Zain Khan',    email: 'z.khan@school.edu',   subject: 'Physics',       classes: 2, avatar: 'ZK' },
  { id: 4, name: 'Ms. Sara Malik',   email: 's.malik@school.edu',  subject: 'Biology',       classes: 2, avatar: 'SM' },
  { id: 5, name: 'Mr. Usman Raza',   email: 'u.raza@school.edu',   subject: 'Chemistry',     classes: 3, avatar: 'UR' },
];

export default function AdminTeachers() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Teachers</h1>
          <p className="text-slate-500 text-sm">{teachers.length} teachers registered</p>
        </div>
        <button className="bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
          + Add Teacher
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Teacher</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Subject</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Classes</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B4FE8] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">{t.subject}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">{t.classes} classes</span>
                </td>
                <td className="py-4 px-6">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
