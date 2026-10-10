"use client";

import { useEffect, useState } from "react";
import { 
  Receipt, Plus, Search, Trash2, CheckCircle2, 
  Server, MessageSquare, Code, Loader2, X
} from "lucide-react";
import { api } from "@/lib/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Hosting & Cloud Infrastructure",
    amount: 10000,
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Credit Card",
    notes: "",
  });

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/super-admin/expenses?per_page=100");
      setExpenses(res?.data || []);
    } catch (err: any) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setSubmitting(true);
    try {
      await api.post("/super-admin/expenses", {
        title: formData.title,
        category: formData.category,
        amount: Number(formData.amount),
        expense_date: formData.date,
        payment_method: formData.paymentMethod,
        notes: formData.notes || "Operational expenditure",
        status: "Paid",
      });

      setIsModalOpen(false);
      setFormData({
        title: "",
        category: "Hosting & Cloud Infrastructure",
        amount: 10000,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Credit Card",
        notes: "",
      });
      await loadExpenses();
    } catch (err: any) {
      alert(err?.message || "Failed to record expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
      await api.del(`/super-admin/expenses/${id}`);
      await loadExpenses();
    } catch (err: any) {
      alert(err?.message || "Failed to delete expense.");
    }
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      (exp.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const hostingTotal = expenses.filter(e => e.category === 'Hosting & Cloud Infrastructure').reduce((a, b) => a + Number(b.amount || 0), 0);
  const smsTotal = expenses.filter(e => e.category === 'SMS & WhatsApp Gateway').reduce((a, b) => a + Number(b.amount || 0), 0);
  const devTotal = expenses.filter(e => e.category === 'Dev & Engineering').reduce((a, b) => a + Number(b.amount || 0), 0);
  const opsTotal = expenses.filter(e => e.category === 'Operations & Support' || e.category === 'Sales & Marketing').reduce((a, b) => a + Number(b.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            Operational Expenses & Costs
          </h1>
          <p className="text-[#706B62] text-sm">
            Track and log SaaS platform infrastructure, SMS gateways, development, and team costs from database.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={16} className="text-[#D4A843]" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Receipt size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded-full">
              {expenses.length} Records
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Platform Expenses</p>
          <div className="font-serif font-bold text-2xl text-red-700 mt-1">
            PKR {totalExpenseAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#706B62] mt-2">Deducted from monthly SaaS gross</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Server size={20} />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#8C847B]">AWS / Vercel</span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Cloud Infrastructure</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {hostingTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#706B62] mt-2">High-availability databases & compute</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <MessageSquare size={20} />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#8C847B]">Twilio / WhatsApp</span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">SMS & WhatsApp Gateway</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {smsTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#706B62] mt-2">Attendance & fee voucher dispatches</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Code size={20} />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#8C847B]">Engineering & Ops</span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Dev & Team Stipends</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {(devTotal + opsTotal).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#706B62] mt-2">Maintenance, support & sales bonuses</p>
        </div>

      </div>

      {/* ── Expenses Table ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs overflow-hidden flex flex-col">
        
        {/* Filters */}
        <div className="p-4 border-b border-[#EBE5D9] flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF8F5]">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C847B]" size={15} />
            <input 
              type="text" 
              placeholder="Search expenses by title or details..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs focus:outline-none focus:border-[#C4993C] text-[#23201B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Categories" },
              { id: "Hosting & Cloud Infrastructure", label: "Hosting" },
              { id: "SMS & WhatsApp Gateway", label: "SMS / WhatsApp" },
              { id: "Dev & Engineering", label: "Dev Team" },
              { id: "Sales & Marketing", label: "Marketing" },
              { id: "Operations & Support", label: "Operations" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? "bg-[#23201B] text-white"
                    : "bg-white border border-[#D9D4CC] text-[#706B62] hover:bg-[#FAF8F5]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-[#706B62]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C4993C]" />
              <p className="text-xs">Loading operational expenses from database...</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                  <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Expense Item</th>
                  <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">Category</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Date</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Payment Mode</th>
                  <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Amount (PKR)</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8C847B]">
                      No expense records found in database.
                    </td>
                  </tr>
                ) : filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    
                    <td className="py-4 px-5">
                      <div className="font-bold text-sm text-[#23201B]">{exp.title}</div>
                      <div className="text-[11px] text-[#706B62] mt-0.5">{exp.notes || "—"}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[11px] border border-[#EBE5D9]">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center text-[#706B62] font-mono">
                      {String(exp.expense_date || "").slice(0, 10)}
                    </td>

                    <td className="py-4 px-3 text-center font-semibold text-[#4A453E]">
                      {exp.payment_method || "Direct"}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-mono font-bold text-sm text-red-600">
                        - PKR {Number(exp.amount || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        <span>{exp.status || "Paid"}</span>
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-[#8C847B] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* ── Add Expense Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">Record Operational Expense</h3>
                <p className="text-xs text-[#706B62]">Saves directly into MySQL expenses table.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#8C847B] hover:text-[#23201B] rounded-xl hover:bg-[#FAF8F5]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-[#23201B] mb-1">Expense Title / Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Multi-AZ Database Hosting"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] font-bold focus:outline-none focus:border-[#C4993C]"
                  >
                    <option value="Hosting & Cloud Infrastructure">Hosting & Cloud Infrastructure</option>
                    <option value="SMS & WhatsApp Gateway">SMS & WhatsApp Gateway</option>
                    <option value="Dev & Engineering">Dev & Engineering</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Operations & Support">Operations & Support</option>
                    <option value="Office & Misc">Office & Misc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-mono font-bold text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] font-bold focus:outline-none focus:border-[#C4993C]"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">Expense Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] font-bold focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23201B] mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Monthly cloud server nodes renewal for Pakistan region"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Expense</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
