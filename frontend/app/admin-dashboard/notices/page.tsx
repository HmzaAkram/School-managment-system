"use client";

import { useState } from "react";
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
  X
} from "lucide-react";

interface NoticeItem {
  id: string;
  title: string;
  recipient: string;
  priority: "High" | "Normal" | "Important";
  category: "Academic" | "Event" | "Administrative" | "Urgent";
  date: string;
  content: string;
  pinned: boolean;
  reads: number;
  totalRecipients: number;
}

const initialNotices: NoticeItem[] = [
  {
    id: "NOT-001",
    title: "Mid-Term Examination Schedule Announced",
    recipient: "All Users (Teachers & Students)",
    priority: "Important",
    category: "Academic",
    date: "Today, 09:30 AM",
    content: "The mid-term examination timetable for grades 6 through 12 has been officially published. Please review the schedule and submit any conflict petitions by Friday.",
    pinned: true,
    reads: 482,
    totalRecipients: 520,
  },
  {
    id: "NOT-002",
    title: "Mandatory Faculty Development Seminar",
    recipient: "All Teaching Staff",
    priority: "High",
    category: "Administrative",
    date: "Yesterday, 04:15 PM",
    content: "All academic staff are required to attend the digital curriculum workshop this Thursday at 3:30 PM in Auditorium B. Attendance is mandatory.",
    pinned: true,
    reads: 42,
    totalRecipients: 45,
  },
  {
    id: "NOT-003",
    title: "Annual Sports Gala 2026 Registrations Open",
    recipient: "All Students",
    priority: "Normal",
    category: "Event",
    date: "Mar 12, 2026",
    content: "House captains have begun sign-ups for track and field events, soccer, and chess. Visit the sports department office during recess.",
    pinned: false,
    reads: 310,
    totalRecipients: 475,
  },
  {
    id: "NOT-004",
    title: "Campus Maintenance & Early Dismissal",
    recipient: "All Users (Teachers & Students)",
    priority: "High",
    category: "Urgent",
    date: "Mar 08, 2026",
    content: "Due to scheduled electrical infrastructure maintenance, classes will conclude at 1:00 PM on Friday. School transport will depart promptly at 1:15 PM.",
    pinned: false,
    reads: 512,
    totalRecipients: 520,
  },
];

export default function AdminNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("All Users (Teachers & Students)");
  const [priority, setPriority] = useState<"Normal" | "Important" | "High">("Normal");
  const [category, setCategory] = useState<"Academic" | "Event" | "Administrative" | "Urgent">("Academic");
  const [pinNotice, setPinNotice] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // WhatsApp / SMS Broadcast Center Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastAudience, setBroadcastAudience] = useState("All Guardians (1,248 Parents)");
  const [broadcastText, setBroadcastText] = useState("Dear Guardians, please be informed that school will observe a rain / smog emergency holiday tomorrow (Friday, 3rd October). Online classes will be held via LMS.");
  const [broadcastSentToast, setBroadcastSentToast] = useState("");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcastModalOpen(false);
    setBroadcastSentToast(`WhatsApp & SMS Broadcast successfully dispatched to ${broadcastAudience}!`);
    setTimeout(() => setBroadcastSentToast(""), 5000);
  };

  const applyBroadcastTemplate = (type: string) => {
    if (type === "holiday") {
      setBroadcastText("🌧️ EMERGENCY NOTICE: Due to heavy rain/weather advisory, all campuses will remain closed tomorrow. Online revision worksheets have been uploaded to student diaries.");
    } else if (type === "fees") {
      setBroadcastText("💳 FEE REMINDER: Monthly tuition fee vouchers for October 2026 are due on 10th October. Please clear via bank branch or online student portal to avoid late surcharge.");
    } else if (type === "exams") {
      setBroadcastText("📋 EXAMINATION NOTICE: Mid-Term official date sheets have been published. Morning session starts promptly at 08:30 AM. Ensure students bring official roll number slips.");
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice: NoticeItem = {
      id: `NOT-${String(notices.length + 1).padStart(3, '0')}`,
      title,
      content,
      recipient,
      priority,
      category,
      date: "Just now",
      pinned: pinNotice,
      reads: 1,
      totalRecipients: recipient.includes("All") ? 520 : recipient.includes("Staff") ? 45 : 475,
    };

    setNotices([newNotice, ...notices]);
    setTitle("");
    setContent("");
    setPinNotice(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const togglePin = (id: string) => {
    setNotices(notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const deleteNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
            <span>⚡ Send WhatsApp / SMS Broadcast</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Twilio & WhatsApp Active
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Broadcasts", value: notices.length, sub: "This semester", icon: Megaphone, color: "text-[#C4993C]", bg: "bg-[#FDFBF7] border-[#F1EAD9]" },
          { label: "Pinned Announcements", value: notices.filter(n => n.pinned).length, sub: "Top priority", icon: Pin, color: "text-amber-600", bg: "bg-[#FFFBF2] border-amber-200/60" },
          { label: "Active Recipients", value: "520", sub: "Teachers & Students", icon: Users, color: "text-emerald-700", bg: "bg-emerald-50/50 border-emerald-200/60" },
          { label: "Avg. Read Rate", value: "89.4%", sub: "Within 24 hours", icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-50/50 border-blue-200/60" },
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
              Notice successfully published and dispatched to target users!
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
              <p className="text-xs text-[#8C877D]">Push instant notification to portals and registered mobile numbers.</p>
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
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-xs font-medium border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                >
                  <option>All Users (Teachers & Students)</option>
                  <option>All Teaching Staff</option>
                  <option>All Students</option>
                  <option>High School (Grades 9-12)</option>
                  <option>Middle School (Grades 6-8)</option>
                  <option>Parents & Guardians Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
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
                {(["Normal", "Important", "High"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      priority === p
                        ? p === "High"
                          ? "bg-red-500 text-white border-red-500 shadow-sm"
                          : p === "Important"
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
                Pin to top of student & teacher portal
              </label>

              <button
                type="button"
                className="text-xs text-[#8C877D] hover:text-[#23201B] font-medium flex items-center gap-1"
              >
                <Paperclip size={13} /> Attach PDF / Circular
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send size={16} /> Broadcast Notice
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
          <div className="space-y-3">
            {filteredNotices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EBE8E2] p-12 text-center">
                <Bell size={32} className="mx-auto text-[#B5AFA6] mb-3 opacity-60" />
                <h3 className="font-bold text-[#23201B] text-sm">No notices match your filter</h3>
                <p className="text-xs text-[#8C877D] mt-1">Try resetting the search terms or category selector.</p>
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
                          : n.priority === "Important"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {n.priority}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE8E2] text-[#706B62]">
                        {n.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePin(n.id)}
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
                        <Users size={12} className="text-[#C4993C]" /> {n.recipient}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {n.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-[#4A453E]">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>{n.reads} / {n.totalRecipients} read</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Sent Notification Toast */}
      {broadcastSentToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#23201B] text-white border border-[#3D382F] shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-xs font-bold">Broadcast Dispatch Complete</div>
            <div className="text-[11px] text-slate-300">{broadcastSentToast}</div>
          </div>
        </div>
      )}

      {/* ── WhatsApp / SMS Emergency Broadcast Modal ── */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#23201B]">SMS & WhatsApp Broadcast Center</h3>
                  <p className="text-[11px] text-[#706B62]">One-click instant dispatch to parent and faculty phone numbers.</p>
                </div>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-[#8C847B] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[#23201B] mb-1">Target Phone Audience</label>
                <select
                  value={broadcastAudience}
                  onChange={e => setBroadcastAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                >
                  <option>All Guardians (1,248 Parents)</option>
                  <option>Grade 10 Parents (87 Guardians)</option>
                  <option>Grade 9 Parents (92 Guardians)</option>
                  <option>All Teaching & Support Faculty (86 Numbers)</option>
                  <option>School Bus Transport Guardians (340 Numbers)</option>
                </select>
              </div>

              {/* Quick Template Buttons */}
              <div>
                <span className="block font-bold text-[#4A453E] mb-1.5">Quick Pakistani School Templates:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate("holiday")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9] text-[#996B1E] font-bold text-[11px] hover:bg-[#F3EBD9]"
                  >
                    🌧️ Rain / Smog Holiday
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate("exams")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9] text-[#996B1E] font-bold text-[11px] hover:bg-[#F3EBD9]"
                  >
                    📋 Exam Date Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate("fees")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9] text-[#996B1E] font-bold text-[11px] hover:bg-[#F3EBD9]"
                  >
                    💳 Fee Voucher Due
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#23201B]">SMS / WhatsApp Message Text *</label>
                  <span className="text-[10px] text-[#8C847B]">{broadcastText.length} chars (1 SMS segment)</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C] leading-relaxed"
                />
              </div>

              {/* Simulation Preview */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Gateway: WhatsApp Cloud API + SMS GSM Server</span>
                </div>
                <span className="font-bold text-emerald-800">100% High Delivery Priority</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] font-bold text-[#706B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Send Broadcast Now</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
