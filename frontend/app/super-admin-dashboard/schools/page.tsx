"use client";

import { useState } from "react";
import { mockSchools } from "@/lib/mock-data";
import { Search, Plus, Filter, MoreVertical, Building2, MapPin, Mail, Phone } from "lucide-react";

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSchools = mockSchools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Schools Directory</h1>
          <p className="text-slate-500 text-sm">Manage all registered schools across the platform.</p>
        </div>
        <button className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2">
          <Plus size={16} /> Add School
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search schools by name or location..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Desktop Table view */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                <th className="text-left py-4 px-6 font-semibold">School</th>
                <th className="text-left py-4 px-6 font-semibold">Location</th>
                <th className="text-left py-4 px-6 font-semibold">Users</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map(school => (
                <tr key={school.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">{school.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1"><Mail size={10} /> {school.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {school.location}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-medium">{school.students.toLocaleString()} <span className="text-slate-500 text-xs font-normal">Students</span></div>
                    <div className="text-slate-900 font-medium mt-1">{school.teachers} <span className="text-slate-500 text-xs font-normal">Teachers</span></div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${school.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile card view */}
        <div className="md:hidden flex flex-col p-4 gap-4">
          {filteredSchools.map(school => (
            <div key={school.id} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{school.name}</div>
                        <div className="text-xs text-slate-500">{school.location}</div>
                      </div>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                  </button>
               </div>
               
               <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 rounded-lg p-3">
                  <div>
                    <span className="text-slate-500 block text-xs">Students</span>
                    <span className="font-semibold text-slate-900">{school.students.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Teachers</span>
                    <span className="font-semibold text-slate-900">{school.teachers}</span>
                  </div>
               </div>
               
               <div className="flex justify-between items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${school.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {school.status}
                  </span>
                  <button className="text-sm font-semibold text-primary hover:text-accent transition-colors">View Details</button>
               </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No schools found</h3>
            <p className="text-slate-500 text-sm max-w-md">We couldn't find any schools matching your search. Try adjusting your search or filters.</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
