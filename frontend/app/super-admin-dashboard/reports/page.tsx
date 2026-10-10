"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, TrendingUp, Users, Download, Calendar, 
  DollarSign, Activity, Loader2, Printer, ShieldCheck, Building2
} from "lucide-react";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState(12);

  const loadReports = async (months: number = 12) => {
    setLoading(true);
    try {
      const res = await api.get(`/super-admin/reports?months=${months}`);
      setReportData(res);
    } catch (err: any) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(selectedMonths);
  }, [selectedMonths]);

  const revenue = reportData?.revenue || {};
  const growth = reportData?.growth || {};
  const engagement = reportData?.engagement || {};
  const renewals = reportData?.renewals || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Platform Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time audited financial and operational metrics pulled directly from MySQL database.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonths}
            onChange={(e) => setSelectedMonths(Number(e.target.value))}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none"
          >
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
            <option value={24}>Last 24 Months</option>
          </select>
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Printer size={14} /> Print Audit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#D4A843]" />
          <p className="text-xs">Generating report aggregations from database...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Report Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {revenue.profit_margin || "0"}% Margin
              </span>
            </div>
            <h3 className="font-sora font-bold text-lg text-slate-900 mb-2">Revenue & Profit/Loss</h3>
            <p className="text-slate-500 text-xs mb-4">Detailed breakdown of platform collections vs infrastructure debits.</p>
            
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Realized Revenue:</span>
                <span className="font-bold text-emerald-600 font-mono">PKR {Number(revenue.total_revenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Platform Expenses:</span>
                <span className="font-bold text-red-600 font-mono">PKR {Number(revenue.total_expenses || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <span className="font-bold text-slate-800">Net Platform Profit:</span>
                <span className="font-extrabold text-slate-900 font-mono">PKR {Number(revenue.net_profit || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* School Growth & User Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={24} />
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {growth.totals?.schools ?? 0} Schools
              </span>
            </div>
            <h3 className="font-sora font-bold text-lg text-slate-900 mb-2">Institutional Growth</h3>
            <p className="text-slate-500 text-xs mb-4">Analytics on partner schools, active teachers, and enrolled students.</p>
            
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Campus Instances:</span>
                <span className="font-bold text-slate-900">{growth.totals?.schools ?? 0} Campuses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Enrolled Student Body:</span>
                <span className="font-bold text-blue-600 font-mono">{(growth.totals?.students ?? 0).toLocaleString()} Students</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Certified Faculty Members:</span>
                <span className="font-bold text-slate-900">{(growth.totals?.teachers ?? 0).toLocaleString()} Teachers</span>
              </div>
            </div>
          </div>
          
          {/* Platform Engagement */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity size={24} />
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Active
              </span>
            </div>
            <h3 className="font-sora font-bold text-lg text-slate-900 mb-2">Platform Utilization</h3>
            <p className="text-slate-500 text-xs mb-4">Multi-tenant usage metrics, student attendance logs and daily traffic.</p>
            
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total User Accounts:</span>
                <span className="font-bold text-slate-900 font-mono">{(engagement.total_users ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Today (Last 24h):</span>
                <span className="font-bold text-emerald-600 font-mono">{(engagement.active_today ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Audit Trail Actions:</span>
                <span className="font-bold text-purple-600 font-mono">{(engagement.audit_entries ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Contract Renewals */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {renewals.expiring_60_days?.length ?? 0} Expiring Soon
              </span>
            </div>
            <h3 className="font-sora font-bold text-lg text-slate-900 mb-2">Contract Pipeline</h3>
            <p className="text-slate-500 text-xs mb-4">Active multi-year agreements and renewal forecasting.</p>
            
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Contracts:</span>
                <span className="font-bold text-slate-900 font-mono">{renewals.active_contracts ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Contract Value Pipeline:</span>
                <span className="font-bold text-[#996B1E] font-mono">PKR {Number(renewals.total_pipeline_value ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Pending Renewal Actions:</span>
                <span className="font-bold text-red-600 font-mono">{renewals.pending_renewal ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
