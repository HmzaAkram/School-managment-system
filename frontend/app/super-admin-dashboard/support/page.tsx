"use client";

import { useState } from "react";
import { mockSupportQueries } from "@/lib/mock-data";
import { Search, Filter, MessageSquare, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredQueries = mockSupportQueries.filter(query => 
    query.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    query.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-50 text-red-700 border-red-200';
      case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertCircle size={14} className="text-red-500" />;
      case 'Medium': return <Clock size={14} className="text-amber-500" />;
      case 'Low': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Support Queries</h1>
          <p className="text-slate-500 text-sm">Manage and respond to platform support tickets.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets by subject or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* List view */}
        <div className="divide-y divide-slate-100">
          {filteredQueries.map(query => (
            <div key={query.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 mt-1">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-slate-500">{query.id}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">{query.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors text-base mb-1">{query.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{query.user}</span>
                    <span className="text-slate-400">({query.role})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 ml-14 sm:ml-0">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(query.status)}`}>
                  {query.status}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {getPriorityIcon(query.priority)} {query.priority} Priority
                </div>
              </div>
            </div>
          ))}
          
          {filteredQueries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No tickets found</h3>
              <p className="text-slate-500 text-sm max-w-md">We couldn't find any support tickets matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
