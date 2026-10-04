"use client";

import { use, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Award, 
  CheckCircle2, Clock, AlertCircle, DollarSign, BookOpen, 
  FileText, Shield, Edit3, Printer, MessageSquare, Plus, Check
} from "lucide-react";
import { mockStudents } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const baseStudent = mockStudents.find(s => s.id === studentId) || {
    id: studentId,
    rollNo: '10-A-01',
    name: 'Ali Hassan',
    class: 'Class 10-A',
    parent: 'Muhammad Hassan',
    phone: '+92 300 1112233',
    attendance: 98,
    feeStatus: 'Paid',
    status: 'Active',
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'attendance' | 'fees' | 'diary'>('overview');
  const [feeStatus, setFeeStatus] = useState(baseStudent.feeStatus);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    setFeeStatus("Paid");
    setIsFeeModalOpen(false);
    setSuccessMsg("Fee voucher marked as PAID successfully! Receipt generated.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

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
                {baseStudent.id}
              </span>
              <span className="text-xs text-[#706B62]">Roll #{baseStudent.rollNo}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mt-0.5">
              {baseStudent.name}
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
            href={`https://wa.me/923152123010?text=Dear%20${encodeURIComponent(baseStudent.parent)}%2C%20regarding%20${encodeURIComponent(baseStudent.name)}%20(Class%20${baseStudent.class}).`}
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
              {baseStudent.name.split(" ").map(n => n[0]).join("")}
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="font-serif font-bold text-2xl text-[#23201B]">{baseStudent.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Active Student
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3E5] text-[#996B1E] border border-[#EBE5D9]">
                  {baseStudent.class}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-[#706B62]">
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-[#C4993C]" />
                  <span>Guardian: <strong className="text-[#23201B]">{baseStudent.parent}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#C4993C]" />
                  <span>{baseStudent.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#C4993C]" />
                  <span>Gulberg III, Lahore</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#EBE5D9] pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Attendance</span>
              <div className="font-serif font-bold text-xl text-emerald-700">{baseStudent.attendance}%</div>
              <span className="text-[9px] text-emerald-600 font-semibold">Excellent</span>
            </div>
            
            <div className="h-8 w-px bg-[#EBE5D9]" />

            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Current GPA</span>
              <div className="font-serif font-bold text-xl text-[#996B1E]">3.85 / 4.0</div>
              <span className="text-[9px] text-[#706B62]">Rank #3 in Class</span>
            </div>

            <div className="h-8 w-px bg-[#EBE5D9]" />

            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Fee Status</span>
              <div className={`font-serif font-bold text-lg ${feeStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {feeStatus}
              </div>
              {feeStatus !== 'Paid' && (
                <button 
                  onClick={() => setIsFeeModalOpen(true)}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#EBE5D9] overflow-x-auto">
          {[
            { id: 'overview', label: 'Student Bio & Details' },
            { id: 'academics', label: 'Academic Performance & Report Cards' },
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
                <strong className="text-[#23201B]">{baseStudent.name}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Student ID</span>
                <strong className="font-mono text-[#996B1E]">{baseStudent.id}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Assigned Class & Section</span>
                <strong className="text-[#23201B]">{baseStudent.class}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Date of Admission</span>
                <span className="text-[#23201B]">15th August 2022</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Date of Birth / Age</span>
                <span className="text-[#23201B]">12th March 2011 (15 Years)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Blood Group</span>
                <span className="text-[#23201B] font-bold text-red-600">B+ (Positive)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8C847B]">Gender</span>
                <span className="text-[#23201B]">Male</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Guardian & Emergency Contacts
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Father / Guardian Name</span>
                <strong className="text-[#23201B]">{baseStudent.parent}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Guardian CNIC</span>
                <strong className="font-mono text-[#23201B]">35202-1928374-1</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Primary Contact Phone</span>
                <strong className="text-[#23201B]">{baseStudent.phone}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Secondary Emergency Contact</span>
                <span className="text-[#23201B]">+92 321 4455667 (Uncle)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Email Address</span>
                <span className="text-[#23201B]">guardian.hassan@gmail.com</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8C847B]">Residential Address</span>
                <span className="text-[#23201B] text-right">House #42, Block B, Gulberg III, Lahore</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: ACADEMICS & EXAMINATIONS ── */}
      {activeTab === 'academics' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Term Examination Marks & Gradebook</h3>
              <p className="text-xs text-[#706B62]">Mid-Term & Final Examination transcripts for Class 10.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                Overall Grade: A+ (91.4%)
              </span>
            </div>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                <th className="text-left py-3 px-4 font-bold uppercase">Subject</th>
                <th className="text-left py-3 px-4 font-bold uppercase">Subject Teacher</th>
                <th className="text-center py-3 px-3 font-bold uppercase">Total Marks</th>
                <th className="text-center py-3 px-3 font-bold uppercase">Obtained Marks</th>
                <th className="text-center py-3 px-3 font-bold uppercase">Grade</th>
                <th className="text-right py-3 px-4 font-bold uppercase">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {[
                { subject: 'Mathematics', teacher: 'Mr. Ahmad Shah', total: 100, obtained: 96, grade: 'A+', remark: 'Outstanding mathematical reasoning' },
                { subject: 'Physics', teacher: 'Mr. Zain Khan', total: 100, obtained: 92, grade: 'A+', remark: 'Great analytical problem solving' },
                { subject: 'Chemistry', teacher: 'Mr. Usman Raza', total: 100, obtained: 89, grade: 'A', remark: 'Solid laboratory experimental skills' },
                { subject: 'English Language', teacher: 'Ms. Fatima Ali', total: 100, obtained: 91, grade: 'A+', remark: 'Excellent creative essay composition' },
                { subject: 'Biology', teacher: 'Ms. Sara Malik', total: 100, obtained: 94, grade: 'A+', remark: 'Very thorough diagrammatic precision' },
                { subject: 'Computer Science', teacher: 'Mr. Bilal Tariq', total: 100, obtained: 98, grade: 'A+', remark: 'Top in class algorithms score' },
              ].map((sub, i) => (
                <tr key={i} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-4 font-bold text-[#23201B]">{sub.subject}</td>
                  <td className="py-3 px-4 text-[#706B62]">{sub.teacher}</td>
                  <td className="py-3 px-3 text-center text-[#706B62] font-mono">{sub.total}</td>
                  <td className="py-3 px-3 text-center font-bold font-mono text-emerald-700">{sub.obtained}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">{sub.grade}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-[#706B62] italic">{sub.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 3: ATTENDANCE BREAKDOWN ── */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Monthly Attendance Tracker</h3>
              <p className="text-xs text-[#706B62]">Daily punch-in and biometric verification history.</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-emerald-700">Present: 22 Days</span>
              <span className="text-amber-700">Late: 1 Day</span>
              <span className="text-red-600">Absent: 0 Days</span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 pt-2">
            {Array.from({ length: 30 }, (_, i) => {
              const isLate = i === 14;
              const isWeekend = (i + 1) % 7 === 0 || (i + 1) % 7 === 6;
              return (
                <div 
                  key={i} 
                  className={`p-2 rounded-xl text-center border text-xs ${
                    isWeekend 
                      ? 'bg-slate-50 border-slate-200 text-slate-400' 
                      : isLate 
                      ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                  }`}
                >
                  <span className="block text-[10px] text-[#8C847B]">Oct {i + 1}</span>
                  <span>{isWeekend ? 'OFF' : isLate ? 'LATE' : 'P'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: FEES & VOUCHERS ── */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Fee Installments & Challans</h3>
              <p className="text-xs text-[#706B62]">Monthly tuition, lab charges, and exam voucher receipts.</p>
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
            {[
              { month: 'October 2026 Tuition', amount: 8500, due: '2026-10-10', status: feeStatus, id: 'CHL-1029' },
              { month: 'September 2026 Tuition', amount: 8500, due: '2026-09-10', status: 'Paid', id: 'CHL-0918' },
              { month: 'Annual Examination Fee 2026', amount: 4000, due: '2026-08-15', status: 'Paid', id: 'CHL-0805' },
            ].map((fee, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#EBE5D9] bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#23201B]">{fee.month}</div>
                  <div className="text-[10px] text-[#706B62] mt-0.5">Voucher #{fee.id} • Due: {fee.due}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-[#23201B]">PKR {fee.amount.toLocaleString()}</div>
                    <span className={`text-[10px] font-bold ${fee.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {fee.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => alert(`Receipt #${fee.id} for ${baseStudent.name} downloaded.`)}
                    className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] text-xs font-semibold"
                  >
                    <Printer size={13} className="text-[#C4993C]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: DIGITAL TEACHER DIARY ── */}
      {activeTab === 'diary' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5D9]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#23201B]">Digital Classroom Diary & Homework</h3>
              <p className="text-xs text-[#706B62]">Teacher notes, homework tasks, and guardian sign-offs.</p>
            </div>
            <span className="text-xs font-bold text-[#996B1E] bg-[#FAF3E5] px-3 py-1 rounded-lg">
              Updated Today
            </span>
          </div>

          <div className="space-y-3">
            {[
              { date: 'Today, 02 Oct 2026', subject: 'Mathematics (Mr. Ahmad)', task: 'Complete Exercise 4.2 Questions 1-8 on Quadratic equations. Test on Monday.', signed: true },
              { date: 'Yesterday, 01 Oct 2026', subject: 'Physics (Mr. Zain)', task: 'Read Chapter 5: Gravitation Laws and solve numerical problem 5.4.', signed: true },
              { date: '30 Sep 2026', subject: 'English (Ms. Fatima)', task: 'Draft a 250-word editorial essay on "Modern Education in Pakistan".', signed: true },
            ].map((d, i) => (
              <div key={i} className="p-4 rounded-xl border border-[#EBE5D9] bg-[#FAF8F5]">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <strong className="text-[#23201B]">{d.subject}</strong>
                  <span className="text-[#706B62] text-[10px]">{d.date}</span>
                </div>
                <p className="text-xs text-[#4A453E]">{d.task}</p>
                <div className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Check size={12} />
                  <span>Guardian Acknowledged & Signed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Collect Fee Modal ── */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <h3 className="font-serif font-bold text-xl text-[#23201B] mb-1">Collect Tuition Fee</h3>
            <p className="text-xs text-[#706B62] mb-4">Student: {baseStudent.name} (Class {baseStudent.class})</p>

            <form onSubmit={handlePayFee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#23201B] mb-1">Voucher Amount (PKR)</label>
                <input
                  type="text"
                  readOnly
                  value="PKR 8,500"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23201B] mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs font-medium text-[#23201B]">
                  <option>Cash (School Counter)</option>
                  <option>Bank Wire Transfer (Habib Bank)</option>
                  <option>JazzCash / EasyPaisa Online</option>
                  <option>Cheque / Pay Order</option>
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
