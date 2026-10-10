"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MessageSquare, AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, open: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        api.get("/super-admin/tickets?per_page=50"),
        api.get("/super-admin/tickets/stats"),
      ]);
      setTickets(ticketsRes?.data || []);
      setStats(statsRes || { total: 0, open: 0, in_progress: 0, resolved: 0 });
    } catch (err: any) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: number, newStatus: string) => {
    try {
      await api.put(`/super-admin/tickets/${ticketId}`, { status: newStatus });
      await loadTickets();
    } catch (err: any) {
      alert(err?.message || "Failed to update ticket status.");
    }
  };

  const filteredQueries = tickets.filter(query => {
    const matchesSearch = 
      (query.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (query.ticket_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (query.school?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (query.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || (query.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
      case 'High':
      case 'Urgent':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'Medium': return <Clock size={14} className="text-amber-500" />;
      case 'Low': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Support Queries & Tickets</h1>
          <p className="text-slate-500 text-sm">Manage and respond to live school admin support tickets recorded in MySQL.</p>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
          <div className="font-sora font-extrabold text-xl text-slate-900 mt-1">{stats.total ?? tickets.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Open Tickets</span>
          <div className="font-sora font-extrabold text-xl text-red-600 mt-1">{stats.open ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
          <div className="font-sora font-extrabold text-xl text-amber-600 mt-1">{stats.in_progress ?? 0}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Resolved</span>
          <div className="font-sora font-extrabold text-xl text-emerald-600 mt-1">{stats.resolved ?? 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets by subject, ticket ID, school..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {["all", "open", "in progress", "resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* List view */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#D4A843]" />
              <p className="text-xs">Loading support tickets from database...</p>
            </div>
          ) : filteredQueries.map(query => (
            <div key={query.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C] font-bold flex-shrink-0 mt-1">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-slate-500">{query.ticket_id || `TKT-${query.id}`}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">{String(query.created_at || "").slice(0, 10)}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mb-1">{query.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{query.user?.name || "School User"}</span>
                    <span className="text-slate-400">({query.school?.name || query.user?.role || "Partner School"})</span>
                  </div>
                  {query.description && (
                    <p className="text-xs text-slate-500 mt-1 max-w-xl line-clamp-2">{query.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 ml-14 sm:ml-0">
                <select
                  value={query.status || "Open"}
                  onChange={(e) => handleUpdateStatus(query.id, e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${getStatusColor(query.status)} focus:outline-none`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {getPriorityIcon(query.priority)} {query.priority || "Medium"} Priority
                </div>
              </div>
            </div>
          ))}
          
          {!loading && filteredQueries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No tickets found</h3>
              <p className="text-slate-500 text-sm max-w-md">We couldn't find any support tickets matching your search criteria in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
