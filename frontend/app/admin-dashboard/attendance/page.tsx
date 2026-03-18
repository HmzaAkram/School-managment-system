"use client";

const classes = [
  { name: 'Class 10-A', teacher: 'Mr. Ahmad Shah',  students: 45, attendance: 92, subject: 'Mathematics' },
  { name: 'Class 10-B', teacher: 'Ms. Fatima Ali',  students: 42, attendance: 88, subject: 'English' },
  { name: 'Class 9-A',  teacher: 'Mr. Zain Khan',   students: 48, attendance: 95, subject: 'Physics' },
  { name: 'Class 9-B',  teacher: 'Ms. Sara Malik',  students: 44, attendance: 90, subject: 'Biology' },
  { name: 'Class 8-A',  teacher: 'Mr. Usman Raza',  students: 50, attendance: 87, subject: 'Chemistry' },
];

export default function AdminAttendance() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Attendance Tracking</h1>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-sora font-bold text-slate-800">Class Attendance Overview</h2>
        </div>
        <div className="p-6 space-y-5">
          {classes.map((cls, i) => (
            <div key={i} className="flex items-center gap-5">
              <span className="w-28 text-sm font-semibold text-slate-700 flex-shrink-0">{cls.name}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED] rounded-full transition-all"
                  style={{ width: `${cls.attendance}%` }}
                />
              </div>
              <span className="text-sm font-bold text-primary w-12 text-right">{cls.attendance}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
