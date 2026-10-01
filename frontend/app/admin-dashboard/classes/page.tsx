"use client";

import { useState } from "react";
import { mockClasses } from "@/lib/mock-data";
import { Search, Plus, Filter, Users, UserCheck, Activity, BookOpen, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminClasses() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredClasses = mockClasses.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Classes & Sections</h1>
          <p className="text-slate-500 text-sm">Manage academic classes, sections, and assigned teachers.</p>
        </div>
        <button className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2">
          <Plus size={16} /> Create Class
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search classes or teachers..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-sora font-extrabold text-slate-900 text-xl flex items-center gap-2">
                  {cls.name} <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-bold">{cls.section}</span>
                </h3>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                  <UserCheck size={14} /> {cls.classTeacher}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${cls.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {cls.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-center text-center">
                <Users size={18} className="text-blue-500 mb-1" />
                <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{cls.studentsCount}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Students</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-center text-center">
                <Activity size={18} className={`${cls.avgAttendance >= 90 ? 'text-emerald-500' : 'text-amber-500'} mb-1`} />
                <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{cls.avgAttendance}%</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attendance</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button className="py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Edit Class
              </button>
              <Link href={`/admin-dashboard/classes/${cls.id}`} className="py-2.5 rounded-xl text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 text-center transition-colors">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
