"use client";

import { useState } from "react";

const initialClasses = [
  { id: 1, name: 'Class 10-A', teacher: 'Mr. Ahmad Shah',  students: 45, attendance: 92, subject: 'Mathematics' },
  { id: 2, name: 'Class 10-B', teacher: 'Ms. Fatima Ali',  students: 42, attendance: 88, subject: 'English' },
  { id: 3, name: 'Class 9-A',  teacher: 'Mr. Zain Khan',   students: 48, attendance: 95, subject: 'Physics' },
  { id: 4, name: 'Class 9-B',  teacher: 'Ms. Sara Malik',  students: 44, attendance: 90, subject: 'Biology' },
  { id: 5, name: 'Class 8-A',  teacher: 'Mr. Usman Raza',  students: 50, attendance: 87, subject: 'Chemistry' },
];

export default function AdminClasses() {
  const [classes, setClasses] = useState(initialClasses);
  const [editingId, setEditingId] = useState<number | null>(null);

  const availableTeachers = [
    'Mr. Ahmad Shah (Math)',
    'Ms. Fatima Ali (English)',
    'Mr. Zain Khan (Physics)',
    'Ms. Sara Malik (Biology)',
    'Mr. Usman Raza (Chemistry)',
    'Mr. Ali Raza (Computer)'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Classes & Assignments</h1>
          <p className="text-slate-500 text-sm">Assign teachers and manage subjects for {classes.length} active classes</p>
        </div>
        <button className="bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(59,79,232,0.25)] hover:shadow-lg transition-all">
          + Add New Class
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-extrabold text-slate-800 text-lg">{cls.name}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">{cls.students} Enrolled</span>
            </div>
            
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject</span>
                {editingId === cls.id ? (
                  <input type="text" defaultValue={cls.subject} className="w-full text-sm border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 font-medium" />
                ) : (
                  <span className="text-sm font-semibold text-slate-800">{cls.subject}</span>
                )}
              </div>
              
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Assigned Teacher</span>
                {editingId === cls.id ? (
                  <select className="w-full text-sm border border-slate-200 rounded px-2 py-1 outline-none text-blue-700 font-semibold bg-white" defaultValue={cls.teacher}>
                    <option value={cls.teacher}>{cls.teacher} (Current)</option>
                    {availableTeachers.map(t => <option key={t} value={t.split(' (')[0]}>{t}</option>)}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-700">{cls.teacher}</span>
                  </div>
                )}
              </div>
            </div>

            {editingId === cls.id ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingId(null)} 
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
                >
                  Save Assignment
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditingId(cls.id)}
                className="w-full py-2.5 rounded-xl text-sm font-bold border-2 border-slate-100 text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                Change Teacher / Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
