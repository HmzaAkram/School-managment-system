"use client";

import { useState } from "react";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { Calendar, Filter, Users, UserCheck, Search, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function AdminAttendance() {
  const [view, setView] = useState<'students' | 'staff'>('students');
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [date, setDate] = useState("2026-10-01");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Attendance Management</h1>
          <p className="text-slate-500 text-sm">Monitor and manage daily attendance for students and staff.</p>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('students')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'students' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Students
          </button>
          <button 
            onClick={() => setView('staff')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'staff' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Staff
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total {view === 'students' ? 'Students' : 'Staff'}</div>
            <div className="text-2xl font-extrabold text-slate-900">{view === 'students' ? mockStudents.length : mockTeachers.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Present</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {view === 'students' ? Math.floor(mockStudents.length * 0.92) : Math.floor(mockTeachers.length * 0.95)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Absent</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {view === 'students' ? Math.floor(mockStudents.length * 0.05) : Math.floor(mockTeachers.length * 0.03)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Late / Leave</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {view === 'students' ? Math.floor(mockStudents.length * 0.03) : Math.floor(mockTeachers.length * 0.02)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 w-full sm:w-auto"
              />
            </div>
            
            {view === 'students' && (
              <select 
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
              >
                {mockClasses.map(c => (
                  <option key={c.id} value={`${c.name.split(' ')[1]}-${c.section}`}>{c.name} - {c.section}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={`Search ${view}...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                <th className="text-left py-4 px-6 font-semibold">{view === 'students' ? 'Student & Roll No' : 'Staff Member & ID'}</th>
                {view === 'students' && <th className="text-left py-4 px-6 font-semibold">Class</th>}
                <th className="text-left py-4 px-6 font-semibold">Status (Today)</th>
                <th className="text-right py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {(view === 'students' ? mockStudents : mockTeachers).map((person, idx) => {
                // Randomly assign a status for demo purposes based on index
                const demoStatus = idx % 5 === 0 ? 'Absent' : idx % 7 === 0 ? 'Late' : 'Present';
                
                return (
                  <tr key={person.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                          {person.name.replace('Mr. ', '').replace('Ms. ', '').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{person.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{view === 'students' ? (person as any).rollNo : person.id}</div>
                        </div>
                      </div>
                    </td>
                    {view === 'students' && (
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">{(person as any).class}</span>
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        demoStatus === 'Present' ? 'bg-emerald-50 text-emerald-700' : 
                        demoStatus === 'Absent' ? 'bg-red-50 text-red-700' : 
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {demoStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select 
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
                        defaultValue={demoStatus.toLowerCase()}
                      >
                        <option value="present">Mark Present</option>
                        <option value="absent">Mark Absent</option>
                        <option value="late">Mark Late</option>
                        <option value="leave">On Leave</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
