"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Download,
  Eye,
  AlertCircle,
  X
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  maxScore: number;
  status: "Active" | "Grading" | "Completed";
  description: string;
}

const initialAssignments: Assignment[] = [
  { id: "ASN-01", title: "Quadratic Equations & Parabolic Graphs", subject: "Mathematics", className: "Grade 10-A", dueDate: "Oct 25, 2026", submittedCount: 42, totalStudents: 45, maxScore: 100, status: "Active", description: "Solve textbook problems 1 through 15 on page 112 with detailed working steps." },
  { id: "ASN-02", title: "Newtonian Mechanics Problem Set", subject: "Physics", className: "Grade 10-A", dueDate: "Oct 22, 2026", submittedCount: 45, totalStudents: 45, maxScore: 50, status: "Grading", description: "Calculate vectors, friction coefficients and acceleration diagrams for laboratory case study." },
  { id: "ASN-03", title: "Trigonometric Identities Worksheet", subject: "Mathematics", className: "Grade 9-B", dueDate: "Oct 29, 2026", submittedCount: 30, totalStudents: 48, maxScore: 100, status: "Active", description: "Complete sin, cos, and tan transformation proofs." },
  { id: "ASN-04", title: "Kinematics & Motion Graphs", subject: "Physics", className: "Grade 10-B", dueDate: "Oct 15, 2026", submittedCount: 42, totalStudents: 42, maxScore: 50, status: "Completed", description: "Plot velocity-time curves and calculate total area under the curves." },
  { id: "ASN-05", title: "Algebraic Factorization Mid-Review", subject: "Mathematics", className: "Grade 10-A", dueDate: "Oct 10, 2026", submittedCount: 45, totalStudents: 45, maxScore: 100, status: "Completed", description: "Mastering polynomial factoring and roots verification." },
];

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [className, setClassName] = useState("Grade 10-A");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAsn: Assignment = {
      id: `ASN-${String(assignments.length + 1).padStart(2, '0')}`,
      title,
      subject,
      className,
      dueDate: dueDate || "Next Week",
      submittedCount: 0,
      totalStudents: className === "Grade 10-A" ? 45 : 42,
      maxScore,
      status: "Active",
      description,
    };

    setAssignments([newAsn, ...assignments]);
    setModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const filtered = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Curriculum Tasks</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Class Assignments & Homework</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Create homework tasks, inspect student digital uploads, and release rubric grades.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md w-fit"
        >
          <Plus size={16} /> New Assignment
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Submissions", value: "2", sub: "Open for students", icon: FileText, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Needs Grading", value: "1", sub: "45 submissions awaiting scores", icon: Clock, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Total Assigned", value: assignments.length, sub: "This semester", icon: Users, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
          { label: "Completion Rate", value: "93.8%", sub: "High adherence average", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#706B62] mt-1 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments by title or subject..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
          {["All", "Active", "Grading", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#23201B] text-white shadow-sm"
                  : "text-[#706B62] hover:text-[#23201B] hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Assignment & Details</th>
                <th className="py-4 px-6">Class & Subject</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Submissions Progress</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {filtered.map((a) => {
                const percentage = Math.round((a.submittedCount / a.totalStudents) * 100);
                return (
                  <tr key={a.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#23201B] text-sm font-sora">{a.title}</div>
                      <div className="text-[11px] text-[#706B62] line-clamp-1 mt-0.5 max-w-xs">{a.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#23201B] block">{a.className}</span>
                      <span className="text-[11px] text-[#8C877D]">{a.subject}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#23201B] flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#C4993C]" /> {a.dueDate}
                      </div>
                      <div className="text-[10px] text-[#8C877D] mt-0.5">Max: {a.maxScore} pts</div>
                    </td>
                    <td className="py-4 px-6 min-w-[180px]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#23201B] text-xs">
                          {a.submittedCount} / {a.totalStudents}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8C877D]">{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EBE8E2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        a.status === "Active"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : a.status === "Grading"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {a.status === "Grading" ? (
                          <button className="px-3 py-1.5 rounded-lg bg-[#23201B] text-white font-bold text-xs hover:bg-[#3D382F] transition-all">
                            Grade (45)
                          </button>
                        ) : (
                          <button className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-[#23201B] font-bold text-xs hover:bg-[#FAF8F5] transition-all">
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <h3 className="font-bold text-[#23201B] text-base font-sora">Create New Assignment</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Trigonometry Problem Set"
                  required
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none focus:border-[#C4993C] bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5]"
                  >
                    <option>Grade 10-A</option>
                    <option>Grade 10-B</option>
                    <option>Grade 9-A</option>
                    <option>Grade 9-B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5]"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Max Score</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Instructions</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide instructions, rubric notes, or textbook references..."
                  rows={3}
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold shadow-md"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
