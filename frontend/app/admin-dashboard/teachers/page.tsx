"use client";

import { useState } from "react";
import { mockTeachers } from "@/lib/mock-data";
import { Search, Filter, Plus, Download, Upload, MoreVertical, Eye, Edit, Trash2, ShieldAlert, BookOpen, Clock, Mail, Phone, Calendar } from "lucide-react";

export default function AdminTeachers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTeachers = mockTeachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Teachers & Staff</h1>
          <p className="text-slate-500 text-sm">Manage {mockTeachers.length} teaching and non-teaching staff members.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2">
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search staff by name, ID or department..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter size={16} /> More Filters
            </button>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                <th className="text-left py-4 px-6 font-semibold">Staff Member</th>
                <th className="text-left py-4 px-6 font-semibold">Role & Dept</th>
                <th className="text-left py-4 px-6 font-semibold">Contact Details</th>
                <th className="text-left py-4 px-6 font-semibold">Assigned Class</th>
                <th className="text-left py-4 px-6 font-semibold">Attendance</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {teacher.name.replace('Mr. ', '').replace('Ms. ', '').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">{teacher.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{teacher.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-medium">{teacher.role}</div>
                    <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1"><BookOpen size={10} /> {teacher.department}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-600 text-xs flex items-center gap-1 mb-1"><Mail size={12} /> {teacher.email}</div>
                    <div className="text-slate-600 text-xs flex items-center gap-1"><Phone size={12} /> {teacher.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">{teacher.assignedClass}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                        <div className={`h-full rounded-full ${teacher.attendance >= 90 ? 'bg-emerald-500' : teacher.attendance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${teacher.attendance}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{teacher.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Profile">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Archive/Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to {filteredTeachers.length} of {mockTeachers.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
