"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Users,
  CreditCard,
  CheckCircle,
  ArrowUpRight,
  Printer
} from "lucide-react";

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("Academic Year 2025-2026");
  const [reportType, setReportType] = useState("all");

  const reportsList = [
    { title: "Consolidated Student Term Performance", category: "Academic", format: "PDF / Excel", size: "2.4 MB", date: "Generated Oct 01, 2026", downloads: 48 },
    { title: "Monthly Fee Collection & Defaulter Ledger", category: "Financial", format: "Excel (XLSX)", size: "1.1 MB", date: "Generated Sep 30, 2026", downloads: 112 },
    { title: "Staff Attendance, Leave & Substitute Load", category: "HR / Staff", format: "PDF", size: "850 KB", date: "Generated Sep 28, 2026", downloads: 35 },
    { title: "Student Attendance & Absentee Trends Analysis", category: "Attendance", format: "PDF / CSV", size: "3.2 MB", date: "Generated Sep 25, 2026", downloads: 89 },
    { title: "Annual Library Catalog & Circulation Audit", category: "Facilities", format: "PDF", size: "640 KB", date: "Generated Sep 20, 2026", downloads: 19 },
    { title: "Fleet & Transport Fuel Efficiency Ledger", category: "Logistics", format: "Excel (XLSX)", size: "780 KB", date: "Generated Sep 15, 2026", downloads: 22 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#C4993C]">Analytics & Audits</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Institutional Reports & Analytics</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Comprehensive audit reports, financial ledgers, and academic metric summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm">
            <Printer size={14} /> Print Executive Summary
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md">
            <Download size={14} /> Generate Custom Audit
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Attendance Rate", value: "94.2%", change: "+1.8% vs last month", icon: Users, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Fee Collection Efficiency", value: "96.4%", change: "PKR 4.8M collected", icon: CreditCard, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Academic GPA Average", value: "3.58", change: "Across Grade 6-12", icon: TrendingUp, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
          { label: "Compliance & Audits", value: "100%", change: "Zero pending alerts", icon: CheckCircle, color: "text-purple-700", bg: "bg-purple-50/60 border-purple-200/80" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#706B62] mt-1 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Available Reports Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-[#23201B] text-base font-sora">Downloadable Executive Reports</h2>
            <p className="text-xs text-[#8C877D]">Certified audit-ready logs compiled automatically by the system</p>
          </div>
          <div className="flex items-center gap-2">
            {["all", "academic", "financial", "attendance"].map((cat) => (
              <button
                key={cat}
                onClick={() => setReportType(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  reportType === cat
                    ? "bg-[#23201B] text-white"
                    : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#EBE8E2]">
          {reportsList.map((rep, i) => (
            <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center justify-center text-[#C4993C] flex-shrink-0 shadow-sm">
                  {rep.format.includes("Excel") ? <FileSpreadsheet size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#23201B] font-sora">{rep.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C877D] mt-1">
                    <span className="font-semibold text-[#4A453E] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE8E2]">
                      {rep.category}
                    </span>
                    <span>Format: {rep.format}</span>
                    <span>Size: {rep.size}</span>
                    <span>{rep.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8C877D] hidden md:inline">{rep.downloads} downloads</span>
                <button className="px-4 py-2 rounded-xl bg-white border border-[#D9D4CC] text-[#23201B] font-bold text-xs hover:border-[#C4993C] hover:text-[#C4993C] transition-all flex items-center gap-1.5 shadow-sm">
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
