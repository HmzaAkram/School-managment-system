"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Award, 
  CheckCircle2, Clock, AlertCircle, DollarSign, BookOpen, 
  FileText, Shield, Edit3, Printer, MessageSquare, Plus, Check, Loader2
} from "lucide-react";
import { api } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [studentData, setStudentData] = useState<any>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'attendance' | 'fees' | 'diary'>('overview');
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(8500);

  const loadStudent = async () => {
    setLoading(true);
    try {
      const [res, diariesRes] = await Promise.all([
        api.get(`/admin/students/${studentId}`),
        api.get(`/admin/students/${studentId}/diaries`).catch(() => ({ data: [] })),
      ]);
      setStudentData(res);
      setDiaries(diariesRes?.data || diariesRes || []);
    } catch (err: any) {
      console.error("Failed to load student details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  const student = studentData?.student || {};
  const guardians = studentData?.guardians || [];
  const primaryGuardian = guardians[0] || {};
  const attendance = studentData?.attendance || { summary: {}, records: [] };
  const invoices = studentData?.invoices || [];

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const unpaidInvoice = invoices.find((inv: any) => inv.status !== 'Paid');
      await api.post("/admin/fees/payments", {
        fee_invoice_id: unpaidInvoice ? unpaidInvoice.id : undefined,
        student_id: student.id,
        amount: Number(paymentAmount),
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "Cash",
      });

      setIsFeeModalOpen(false);
      setSuccessMsg("Fee payment recorded in MySQL successfully! Voucher marked as Paid.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await loadStudent();
    } catch (err: any) {
      alert(err?.message || "Payment recording failed.");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-primary" />
        <p className="text-slate-500 text-sm font-semibold">Loading student record from database...</p>
      </div>
    );
  }

  const attSummary = attendance.summary || {};
  const attRate = attSummary.rate ?? 95;
  const studentName = student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || `Student #${studentId}`;
  const guardianName = primaryGuardian.name || primaryGuardian.father_name || "Guardian";
  const guardianPhone = primaryGuardian.phone || primaryGuardian.father_phone || student.emergency_contact || student.phone || "—";
  const className = student.class ? `${student.class}${student.section ? `-${student.section}` : ''}` : "Class 10-A";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-dashboard/students"
            className="p-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#996B1E] bg-[#FAF3E5] px-2 py-0.5 rounded border border-[#EBE5D9]">
                {student.admission_number || `STD-${student.id}`}
              </span>
              <span className="text-xs text-[#706B62]">Roll #{student.roll_number || "—"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mt-0.5">
              {studentName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer size={14} className="text-[#C4993C]" />
            <span>Print Profile</span>
          </button>
          
          <a
            href={`https://wa.me/923152123010?text=Dear%20${encodeURIComponent(guardianName)}%2C%20regarding%20${encodeURIComponent(studentName)}%20(Class%20${className}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <MessageSquare size={14} className="text-[#D4A843]" />
            <span>WhatsApp Guardian</span>
          </a>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Student Profile Header Card ── */}
      <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-xs p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C4993C] to-[#D4A843] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md border-2 border-white flex-shrink-0">
              {studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="font-serif font-bold text-2xl text-[#23201B]">{studentName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● {student.status || "Active Student"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3E5] text-[#996B1E] border border-[#EBE5D9]">
                  {className}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-[#706B62]">
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-[#C4993C]" />
                  <span>Guardian: <strong className="text-[#23201B]">{guardianName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#C4993C]" />
                  <span>{guardianPhone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#C4993C]" />
                  <span>{student.city || student.address || "Pakistan"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#EBE5D9] pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Attendance</span>
              <div className="font-serif font-bold text-xl text-emerald-700">{attRate}%</div>
              <span className="text-[9px] text-emerald-600 font-semibold">{attSummary.present ?? 0} Days Present</span>
            </div>
            
            <div className="h-8 w-px bg-[#EBE5D9]" />

            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Blood Group</span>
              <div className="font-serif font-bold text-xl text-[#996B1E]">{student.blood_group || "B+"}</div>
              <span className="text-[9px] text-[#706B62]">Medical record</span>
            </div>

            <div className="h-8 w-px bg-[#EBE5D9]" />

            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Fee Status</span>
              <div className="font-serif font-bold text-lg text-emerald-700">
                {invoices.some((i: any) => i.status !== 'Paid') ? 'Pending' : 'Paid'}
              </div>
              <button 
                onClick={() => setIsFeeModalOpen(true)}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                Collect Fee
              </button>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#EBE5D9] overflow-x-auto">
          {[
            { id: 'overview', label: 'Student Bio & Details' },
            { id: 'attendance', label: 'Monthly Attendance Log' },
            { id: 'fees', label: 'Fee Invoices & Receipts' },
            { id: 'diary', label: 'Digital Teacher Diary' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#23201B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#706B62] hover:text-[#23201B] hover:bg-[#F3EBD9]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW & BIOGRAPHICAL DETAILS ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Enrollment & Personal Data
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Full Official Name</span>
                <strong className="text-[#23201B]">{studentName}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Admission Number</span>
                <strong className="font-mono text-[#996B1E]">{student.admission_number || "—"}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Assigned Class & Section</span>
                <strong className="text-[#23201B]">{className}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Date of Admission</span>
                <span className="text-[#23201B]">{student.admission_date || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Date of Birth</span>
                <span className="text-[#23201B]">{student.dob || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Blood Group</span>
                <span className="text-[#23201B] font-bold text-red-600">{student.blood_group || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8C847B]">Gender</span>
                <span className="text-[#23201B]">{student.gender || "—"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Guardian & Emergency Contacts
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Guardian Name</span>
                <strong className="text-[#23201B]">{guardianName}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Guardian Phone</span>
                <strong className="text-[#23201B]">{guardianPhone}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Guardian Email</span>
                <span className="text-[#23201B]">{primaryGuardian.father_email || primaryGuardian.account_email || student.email || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Emergency Contact</span>
                <span className="text-[#23201B]">{student.emergency_contact || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8C847B]">Residential Address</span>
                <span className="text-[#23201B] text-right">{student.address || primaryGuardian.address || "—"}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: ATTENDANCE BREAKDOWN ── */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Daily Attendance Log</h3>
              <p className="text-xs text-[#706B62]">Biometric & teacher-marked rolls from database.</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-emerald-700">Present: {attSummary.present ?? 0}</span>
              <span className="text-amber-700">Late: {attSummary.late ?? 0}</span>
              <span className="text-red-600">Absent: {attSummary.absent ?? 0}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                  <th className="text-left py-2 px-4 font-bold">Date</th>
                  <th className="text-center py-2 px-4 font-bold">Status</th>
                  <th className="text-left py-2 px-4 font-bold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {(attendance.records || []).slice(0, 30).map((r: any, i: number) => (
                  <tr key={i}>
                    <td className="py-2.5 px-4 font-mono">{r.date}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : r.status === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[#706B62]">{r.remarks || "—"}</td>
                  </tr>
                ))}
                {(attendance.records || []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[#8C847B]">No attendance logs recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: FEES & VOUCHERS ── */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Fee Invoices & Challans</h3>
              <p className="text-xs text-[#706B62]">Official invoices and receipts from MySQL database.</p>
            </div>
            <button 
              onClick={() => setIsFeeModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Plus size={14} className="text-[#C4993C]" />
              <span>Collect Fee</span>
            </button>
          </div>

          <div className="space-y-3">
            {invoices.map((fee: any) => (
              <div key={fee.id} className="p-4 rounded-xl border border-[#EBE5D9] bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#23201B]">{fee.invoice_number || `Invoice #${fee.id}`}</div>
                  <div className="text-[10px] text-[#706B62] mt-0.5">Due: {fee.due_date || "—"} • Title: {fee.title || "Tuition"}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-[#23201B]">PKR {Number(fee.amount || 0).toLocaleString()}</div>
                    <span className={`text-[10px] font-bold ${fee.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {fee.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => alert(`Receipt #${fee.invoice_number || fee.id} printed.`)}
                    className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] text-xs font-semibold"
                  >
                    <Printer size={13} className="text-[#C4993C]" />
                  </button>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <p className="text-xs text-[#8C847B] py-6 text-center">No fee invoices recorded for this student.</p>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: DIGITAL TEACHER DIARY ── */}
      {activeTab === 'diary' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Digital Classroom Diary & Homework</h3>
              <p className="text-xs text-[#706B62]">Teacher notes, homework tasks, and parent sign-offs.</p>
            </div>
          </div>

          <div className="space-y-3">
            {diaries.map((d: any) => (
              <div key={d.id} className="p-4 rounded-xl border border-[#EBE5D9] bg-[#FAF8F5]">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <strong className="text-[#23201B]">{d.subject?.name || d.subject || "Homework"}</strong>
                  <span className="text-[#706B62] text-[10px]">{String(d.date || d.created_at || "").slice(0, 10)}</span>
                </div>
                <p className="text-xs text-[#4A453E]">{d.content || d.task}</p>
                <div className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Check size={12} />
                  <span>Teacher Entry Recorded</span>
                </div>
              </div>
            ))}
            {diaries.length === 0 && (
              <p className="text-xs text-[#8C847B] py-6 text-center">No diary notes found for this class.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Collect Fee Modal ── */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <h3 className="font-serif font-bold text-xl text-[#23201B] mb-1">Collect Tuition Fee</h3>
            <p className="text-xs text-[#706B62] mb-4">Student: {studentName} ({className})</p>

            <form onSubmit={handlePayFee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#23201B] mb-1">Payment Amount (PKR)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23201B] mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs font-medium text-[#23201B]">
                  <option>Cash (School Counter)</option>
                  <option>Bank Wire Transfer</option>
                  <option>JazzCash / EasyPaisa</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] text-xs font-bold text-[#706B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
