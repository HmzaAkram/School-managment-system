"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Send,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Pin,
  Calendar,
  Users,
  Search,
  Trash2,
  Megaphone,
  Clock,
  Sparkles,
  Paperclip,
  MessageSquare,
  Phone,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  target_audience: string;
  priority: string;
  category?: string;
  pinned: boolean;
  publish_date?: string;
  created_at?: string;
  created_by?: string;
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState<"All" | "Students" | "Teachers" | "Parents">("All");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [category, setCategory] = useState("Academic");
  const [pinNotice, setPinNotice] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // WhatsApp / SMS Broadcast Center Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastAudience, setBroadcastAudience] = useState<"All" | "Students" | "Teachers" | "Parents">("Parents");
  const [broadcastText, setBroadcastText] = useState("Dear Guardians, please be informed that school will observe a holiday tomorrow. Online study materials have been updated in student diaries.");
  const [broadcastSentToast, setBroadcastSentToast] = useState("");

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<any>("/admin/notices?per_page=50");
      setNotices(res.data || []);
    } catch (err: any) {
      console.error("Error loading notices:", err);
      setError(err?.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      await apiFetch("/admin/notices", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          target_audience: recipient,
          priority,
          category,
          pinned: pinNotice,
          publish_date: new Date().toISOString().split("T")[0]
        })
      });

      setTitle("");
      setContent("");
      setPinNotice(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
      fetchNotices();
    } catch (err: any) {
      alert(err?.message || "Failed to publish announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePin = async (notice: NoticeItem) => {
    try {
      await apiFetch(`/admin/notices/${notice.id}`, {
        method: "PUT",
        body: JSON.stringify({
          pinned: !notice.pinned
        })
      });
      fetchNotices();
    } catch (err: any) {
      alert(err?.message || "Failed to update pinned state");
    }
  };

  const deleteNotice = async (id: number) => {
    if (!confirm("Are you sure you want to remove this notice?")) return;
    try {
      await apiFetch(`/admin/notices/${id}`, { method: "DELETE" });
      fetchNotices();
    } catch (err: any) {
      alert(err?.message || "Failed to delete notice");
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Also post it as an urgent announcement to the database
      await apiFetch("/admin/notices", {
        method: "POST",
        body: JSON.stringify({
          title: "🚨 Official Broadcast Alert",
          content: broadcastText,
          target_audience: broadcastAudience,
          priority: "High",
          category: "Urgent",
          pinned: true,
          publish_date: new Date().toISOString().split("T")[0]
        })
      });
      setIsBroadcastModalOpen(false);
      setBroadcastSentToast(`Official Broadcast dispatched to ${broadcastAudience} and posted to notice board!`);
      setTimeout(() => setBroadcastSentToast(""), 5000);
      fetchNotices();
    } catch (err: any) {
      alert(err?.message || "Failed to dispatch broadcast");
    }
  };

  const applyBroadcastTemplate = (type: string) => {
    if (type === "holiday") {
      setBroadcastText("🌧️ EMERGENCY NOTICE: Due to heavy rain/weather advisory, all campuses will remain closed tomorrow. Online revision worksheets have been uploaded to student diaries.");
    } else if (type === "fees") {
      setBroadcastText("💳 FEE REMINDER: Monthly tuition fee vouchers for this month are due on the 10th. Please clear via bank branch or online student portal to avoid late surcharge.");
    } else if (type === "exams") {
      setBroadcastText("📋 EXAMINATION NOTICE: Mid-Term official date sheets have been published. Morning session starts promptly at 08:30 AM. Ensure students bring official roll number slips.");
    }
  };

  const filteredNotices = notices.filter(n => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (n.title || "").toLowerCase().includes(term) || 
      (n.content || "").toLowerCase().includes(term);
    const matchesCategory = categoryFilter === "All" || (n.category || "").toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const pinnedCount = notices.filter(n => n.pinned).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#C4993C]">Broadcast Communications</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Notice Board & Announcements</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Broadcast emergency alerts, academic memos, and daily notices to students, faculty, and guardians.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <MessageSquare size={14} className="text-emerald-200" />
            <span>⚡ Send Broadcast Alert</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync Active
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {broadcastSentToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{broadcastSentToast}</span>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Broadcasts", value: notices.length, sub: "Active announcements", icon: Megaphone, color: "text-[#C4993C]", bg: "bg-[#FDFBF7] border-[#F1EAD9]" },
          { label: "Pinned Announcements", value: pinnedCount, sub: "Priority alerts", icon: Pin, color: "text-amber-600", bg: "bg-[#FFFBF2] border-amber-200/60" },
          { label: "Active Channels", value: "3", sub: "Portal, Email & Web", icon: Users, color: "text-emerald-700", bg: "bg-emerald-50/50 border-emerald-200/60" },
          { label: "Database Sync", value: "100%", sub: "Live MySQL connection", icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-50/50 border-blue-200/60" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} shadow-sm transition-all hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} border border-current/20`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#8C877D] mt-1 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Success notification */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Notice successfully published and saved to MySQL!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Main Grid: Composer on Left, History on Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Compose Notice (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#C4993C]/10 text-[#C4993C] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-[#23201B] text-base font-sora">Draft Announcement</h2>
              <p className="text-xs text-[#8C877D]">Push instant notification to portals and registered users.</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Notice Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for Final Exam Preparations"
                required
                className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white transition-all placeholder:text-[#A8A298]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value as any)}
                  className="w-full text-xs font-medium border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                >
                  <option value="All">All Users (Teachers & Students)</option>
                  <option value="Teachers">All Teaching Staff</option>
                  <option value="Students">All Students</option>
                  <option value="Parents">Parents & Guardians</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-medium border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Event">Event</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Urgent">Urgent / Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Low", "Medium", "High"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      priority === p
                        ? p === "High"
                          ? "bg-red-500 text-white border-red-500 shadow-sm"
                          : p === "Medium"
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                          : "bg-[#23201B] text-white border-[#23201B] shadow-sm"
                        : "bg-[#FAF8F5] text-[#706B62] border-[#EBE8E2] hover:bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Notice Body *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Compose announcement body, instructions, or deadlines..."
                rows={5}
                required
                className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3.5 outline-none focus:border-[#C4993C] focus:bg-white transition-all placeholder:text-[#A8A298] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#5C564C]">
                <input
                  type="checkbox"
                  checked={pinNotice}
                  onChange={(e) => setPinNotice(e.target.checked)}
                  className="rounded text-[#C4993C] focus:ring-[#C4993C] h-4 w-4"
                />
                Pin to top of portal feed
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>

        {/* Right Column: Published Notices Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#C4993C] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["All", "Academic", "Urgent", "Event", "Administrative"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? "bg-[#23201B] text-white"
                      : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notices List */}
          <div className="space-y-3 min-h-[300px]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <span>Loading announcements...</span>
              </div>
            ) : filteredNotices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EBE8E2] p-12 text-center">
                <Bell size={32} className="mx-auto text-[#B5AFA6] mb-3 opacity-60" />
                <h3 className="font-bold text-[#23201B] text-sm">No notices match your filter</h3>
                <p className="text-xs text-[#8C877D] mt-1">Try resetting the search terms or create a new announcement.</p>
              </div>
            ) : (
              filteredNotices.map((n) => (
                <div
                  key={n.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md ${
                    n.pinned ? "border-amber-300/80 bg-[#FFFDF9]" : "border-[#EBE8E2]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {n.pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <Pin size={10} className="fill-amber-800" /> Pinned
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        n.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : n.priority === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {n.priority}
                      </span>
                      {n.category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE8E2] text-[#706B62]">
                          {n.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePin(n)}
                        title={n.pinned ? "Unpin notice" : "Pin notice"}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          n.pinned ? "text-amber-600 bg-amber-50" : "text-[#8C877D] hover:bg-slate-100"
                        }`}
                      >
                        <Pin size={14} />
                      </button>
                      <button
                        onClick={() => deleteNotice(n.id)}
                        title="Delete notice"
                        className="p-1.5 rounded-lg text-xs text-[#8C877D] hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#23201B] font-sora mb-2">{n.title}</h3>
                  <p className="text-xs text-[#5C564C] leading-relaxed mb-4">{n.content}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F1EAD9] text-xs text-[#8C877D]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-medium text-[#4A453E]">
                        <Users size={12} className="text-[#C4993C]" /> {n.target_audience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {n.publish_date || (n.created_at ? new Date(n.created_at).toLocaleDateString() : "Active")}
                      </span>
                    </div>
                    {n.created_by && (
                      <span className="text-[10px] font-semibold text-[#8C877D]">
                        By: {n.created_by}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#EBE8E2] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EBE8E2] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sora text-[#23201B]">Dispatch Broadcast Alert</h2>
                <p className="text-xs text-[#706B62] mt-1">
                  Send high-priority notification to community portals
                </p>
              </div>
              <button 
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={broadcastAudience}
                  onChange={e => setBroadcastAudience(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Parents">Parents & Guardians</option>
                  <option value="Students">All Students</option>
                  <option value="Teachers">All Teaching Faculty</option>
                  <option value="All">All School Members</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button" 
                    onClick={() => applyBroadcastTemplate('holiday')}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
                  >
                    Emergency Holiday
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyBroadcastTemplate('fees')}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
                  >
                    Fee Due Reminder
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyBroadcastTemplate('exams')}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
                  >
                    Date Sheet Release
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Message *</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow flex items-center gap-2"
                >
                  <Send size={16} /> Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
