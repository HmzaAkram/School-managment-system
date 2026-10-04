"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, CreditCard, Wallet, TrendingUp,
  Receipt, ArrowUpRight, Plus, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [schoolsList, setSchoolsList] = useState<any[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, schoolsRes, expensesRes] = await Promise.all([
          api.get("/super-admin/stats"),
          api.get("/super-admin/schools?per_page=15"),
          api.get("/super-admin/expenses?per_page=100"),
        ]);
        setStats(statsRes);
        setSchoolsList(schoolsRes?.data || []);
        const exps = expensesRes?.data || [];
        setExpensesList(exps);
        const byMonth: Record<string, number> = {};
        exps.forEach((e: any) => {
          const m = String(e.expense_date || "").slice(0, 7);
          if (m) byMonth[m] = (byMonth[m] || 0) + Number(e.amount || 0);
        });
        setMonthlyExpenses(byMonth);
      } catch (err: any) {
        if (err?.status === 401) { router.push("/login"); return; }
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const summary = stats?.summary || {};
  const monthlyRevenue: any[] = stats?.monthly_revenue || [];
  const totalStudents = summary.total_students ?? 0;
  const totalSchools = summary.total_schools ?? 0;
  const totalPaidRevenue = summary.total_revenue ?? 0;
  const totalExpensesThisMonth = summary.total_expenses ?? 0;
  const netProfit = summary.net_profit ?? 0;
  const profitMarginPercent = totalPaidRevenue > 0 ? ((netProfit / totalPaidRevenue) * 100).toFixed(1) : "0";
  const totalPendingDue = schoolsList.reduce((acc, s) => acc + Number(s.pending_amount || 0), 0);
  const totalContractValueAll = schoolsList.reduce((acc, s) => acc + Number(s.contract_amount || 0), 0);
  const latestMonth = monthlyRevenue.length > 0 ? monthlyRevenue[0] : null;
  const monthlySaaSRecurring = latestMonth ? Number(latestMonth.total || 0) : 0;

  // Contract-expiry alert: first school with contract_end within 60 days, else first with pending balance
  const now = new Date();
  const expiring = schoolsList.find((s) => {
    if (!s.contract_end) return false;
    const d = new Date(s.contract_end);
    const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 60;
  });
  const pendingBalance = !expiring ? schoolsList.find((s) => Number(s.pending_amount || 0) > 0) : null;
  const alertSchool = expiring || pendingBalance;
  const alertDays = alertSchool?.contract_end
    ? Math.max(0, Math.ceil((new Date(alertSchool.contract_end).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const pnlRows = [...monthlyRevenue].reverse().map((m) => {
    const revenue = Number(m.total || 0);
    const expenses = monthlyExpenses[m.month] || 0;
    return { month: m.month, revenue, expenses, net: revenue - expenses };
  });
  const maxVal = Math.max(1, ...pnlRows.map((r) => r.revenue));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4A843] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4993C] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#706B62] font-semibold">
              SaaS Multi-Tenant Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mt-1">
            Super Administrator Control Room
          </h1>
          <p className="text-[#706B62] text-sm">
            Real-time tracking of school contracts, per-student revenue splits, collections & operational expenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/super-admin-dashboard/expenses"
            className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white hover:bg-[#FAF8F5] text-[#23201B] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Receipt size={14} className="text-[#C4993C]" />
            <span>Manage Expenses</span>
          </Link>

          <Link
            href="/super-admin-dashboard/schools"
            className="px-5 py-2.5 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus size={14} className="text-[#D4A843]" />
            <span>New School Contract</span>
          </Link>
        </div>
      </div>

      {/* ── SaaS Contract Renewal Alert Banner ── */}
      {alertSchool && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-800 flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#23201B]">
                  {expiring ? `Upcoming Contract Expiration: ${alertSchool.name}` : `Pending Contract Balance: ${alertSchool.name}`}
                </h4>
                {alertDays !== null && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    {alertDays} Days Remaining
                  </span>
                )}
              </div>
              <p className="text-xs text-[#706B62] mt-0.5">
                {expiring
                  ? <>Contract (PKR {Number(alertSchool.contract_amount || 0).toLocaleString()} total • {alertSchool.students_count ?? 0} students) expires on <strong>{String(alertSchool.contract_end).slice(0, 10)}</strong>. Review renewal terms with {alertSchool.principal_name || "the school principal"}.</>
                  : <>PKR {Number(alertSchool.pending_amount || 0).toLocaleString()} pending of PKR {Number(alertSchool.contract_amount || 0).toLocaleString()} contract. Follow up with {alertSchool.principal_name || "the school principal"}.</>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Executive KPI Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Monthly Recurring SaaS (MRR) */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Wallet size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-0.5">
              <TrendingUp size={11} /> Latest Month
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Monthly SaaS Revenue (MRR)</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {monthlySaaSRecurring.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#706B62] mt-2 flex items-center gap-1">
            <span>From <strong>{totalStudents.toLocaleString()}</strong> billable students</span>
          </div>
        </div>

        {/* Total Contract Pipeline (ARR) */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Building2 size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-50 text-[#996B1E] rounded-full">
              {totalSchools} Partner Schools
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Contract Value (ARR)</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {(totalContractValueAll / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-[#706B62] mt-2">
            {summary.active_contracts ?? 0} active • {summary.pending_contracts ?? 0} pending contracts
          </div>
        </div>

        {/* Received vs Pending Collection */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">
              Due: PKR {totalPendingDue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Realized Collection</p>
          <div className="font-serif font-bold text-2xl text-emerald-700 mt-1">
            PKR {totalPaidRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#706B62] mt-2 flex items-center justify-between">
            <span>Recovery Rate</span>
            <span className="font-bold text-[#23201B]">
              {totalPaidRevenue + totalPendingDue > 0
                ? ((totalPaidRevenue / (totalPaidRevenue + totalPendingDue)) * 100).toFixed(1)
                : "0.0"}%
            </span>
          </div>
        </div>

        {/* Expenses & Net Profit */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#23201B]">
              <Receipt size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
              Margin: {profitMarginPercent}%
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Net Platform Profit</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {netProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#706B62] mt-2 flex items-center justify-between">
            <span>Expenses: PKR {totalExpensesThisMonth.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Middle Section: Active School Contracts ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EBE5D9]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-[#23201B]">Active School Contracts & Revenue Sharing</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3E5] text-[#996B1E]">
                Per Student Share Model
              </span>
            </div>
            <p className="text-xs text-[#706B62] mt-0.5">
              Tracking contract timeline and collections across partner schools.
            </p>
          </div>
          <Link
            href="/super-admin-dashboard/schools"
            className="text-xs font-bold text-[#996B1E] hover:text-[#23201B] inline-flex items-center gap-1 transition-colors"
          >
            <span>Manage All Contracts</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">School & Principal</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Students</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Plan</th>
                <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Contract Value</th>
                <th className="text-center py-3.5 px-4 font-bold uppercase tracking-wider">Contract Progress</th>
                <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Collected / Total</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {schoolsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8C847B]">No schools found.</td>
                </tr>
              ) : schoolsList.map((s) => {
                const start = s.contract_start ? new Date(s.contract_start) : null;
                const end = s.contract_end ? new Date(s.contract_end) : null;
                const durationMonths = start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))) : 0;
                const monthsElapsed = start ? Math.max(0, Math.min(durationMonths, Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)))) : 0;
                const progressPercent = durationMonths > 0 ? Math.min(100, Math.round((monthsElapsed / durationMonths) * 100)) : 0;
                const statusLabel = s.subscription_status || s.status || "—";
                return (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]/80 transition-colors">

                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-[#23201B]">{s.name}</div>
                      <div className="text-[11px] text-[#706B62] mt-0.5 flex items-center gap-2">
                        <span>{s.principal_name || "—"}</span>
                        <span>•</span>
                        <span>{[s.city, s.state].filter(Boolean).join(", ") || "—"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-sm text-[#23201B]">{(s.students_count ?? 0).toLocaleString()}</span>
                      <span className="block text-[10px] text-[#8C847B]">students</span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[11px] border border-[#EBE5D9]">
                        {s.plan || "—"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-sm text-[#23201B] font-mono">
                        PKR {Number(s.contract_amount || 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">total deal</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="w-36 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-1 text-[#4A453E]">
                          <span>Month {monthsElapsed} of {durationMonths || "—"}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="block text-[9px] text-[#8C847B] text-center mt-1">
                          Ends: {s.contract_end ? String(s.contract_end).slice(0, 10) : "—"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-xs text-emerald-700 font-mono">
                        PKR {Number(s.paid_amount || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#8C847B]">
                        of PKR {Number(s.contract_amount || 0).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          statusLabel === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : statusLabel === "Pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {statusLabel === "Active" && <CheckCircle2 size={11} />}
                        {statusLabel === "Pending" && <Clock size={11} />}
                        {statusLabel !== "Active" && statusLabel !== "Pending" && <AlertCircle size={11} />}
                        <span>{statusLabel}</span>
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Split: Financial Overview vs Recent Operational Expenses ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Financial Performance (P&L Summary) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#23201B]">Financial P&L Overview (Last 6 Months)</h3>
                <p className="text-xs text-[#706B62]">Gross SaaS subscription revenue vs platform expenses.</p>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-[#FAF3E5] text-[11px] font-bold text-[#996B1E]">
                Live Data
              </div>
            </div>

            <div className="space-y-3 my-4">
              {pnlRows.length === 0 && (
                <p className="text-xs text-[#8C847B] py-4 text-center">No revenue data available yet.</p>
              )}
              {pnlRows.map((m) => {
                const revWidth = (m.revenue / maxVal) * 100;
                const expWidth = (m.expenses / maxVal) * 100;

                return (
                  <div key={m.month} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9]">
                    <div className="flex items-center justify-between text-xs font-bold text-[#23201B] mb-2">
                      <span>{m.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-700">Revenue: PKR {m.revenue.toLocaleString()}</span>
                        <span className="text-red-600">Expenses: PKR {m.expenses.toLocaleString()}</span>
                        <span className="text-[#996B1E] font-extrabold">Net Profit: PKR {m.net.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Dual Stacked Progress */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${revWidth}%` }}
                        />
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-red-400 rounded-full"
                          style={{ width: `${expWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBE5D9] flex items-center justify-between text-xs text-[#706B62]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> SaaS Collections
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Platform Expenses
              </span>
            </div>
            <Link
              href="/super-admin-dashboard/ledger"
              className="font-bold text-[#996B1E] hover:underline"
            >
              View Full Audit Ledger →
            </Link>
          </div>
        </div>

        {/* Operational Expenses Quick View */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#23201B]">Active Operational Expenses</h3>
                <p className="text-xs text-[#706B62]">Cloud servers, SMS gateways & ops costs.</p>
              </div>
              <Link
                href="/super-admin-dashboard/expenses"
                className="text-xs font-bold text-[#996B1E] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {expensesList.length === 0 && (
                <p className="text-xs text-[#8C847B] py-4 text-center">No platform expenses recorded.</p>
              )}
              {expensesList.slice(0, 4).map((exp) => (
                <div key={exp.id} className="p-3 rounded-xl border border-[#EBE5D9] bg-[#FAF8F5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#EBE5D9] flex items-center justify-center text-[#C4993C] flex-shrink-0">
                      <Receipt size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#23201B] line-clamp-1">{exp.title}</div>
                      <div className="text-[10px] text-[#706B62] flex items-center gap-1.5 mt-0.5">
                        <span>{exp.category}</span>
                        <span>•</span>
                        <span>{String(exp.expense_date || "").slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-red-600 font-mono">
                      - PKR {Number(exp.amount || 0).toLocaleString()}
                    </div>
                    <span className="text-[9px] text-emerald-700 font-semibold">{exp.payment_method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBE5D9] mt-4">
            <Link
              href="/super-admin-dashboard/expenses"
              className="w-full py-2.5 rounded-xl border border-[#D9D4CC] bg-white hover:bg-[#FAF8F5] text-[#23201B] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus size={14} className="text-[#C4993C]" />
              <span>Record New Platform Expense</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ── Subdomain Whitelabeling & Custom DNS Section ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#EBE5D9]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-[#23201B]">School Subdomain & Whitelabel Portals</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Wildcard SSL Active
              </span>
            </div>
            <p className="text-xs text-[#706B62] mt-0.5">
              Dedicated isolated subdomains & custom branded login URLs for each partner school.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {schoolsList.slice(0, 3).map((d) => (
            <div key={d.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] flex flex-col justify-between">
              <div>
                <div className="font-bold text-xs text-[#23201B]">{d.name}</div>
                <div className="font-mono text-[11px] text-[#996B1E] mt-1">{d.domain || (d.code ? `${String(d.code).toLowerCase()}.skoolms.edu` : "—")}</div>
                <div className="text-[10px] text-[#706B62] mt-0.5">{[d.city, d.state].filter(Boolean).join(", ") || d.address || "—"}</div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EBE5D9] text-[10px]">
                <span className="text-emerald-700 font-bold">🔒 SSL: Active</span>
                <span className="text-[#706B62]">{d.plan}</span>
              </div>
            </div>
          ))}
          {schoolsList.length === 0 && (
            <p className="text-xs text-[#8C847B] py-4">No partner schools provisioned yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}
