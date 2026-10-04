"use client";

import { use, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Award, 
  CheckCircle2, Clock, DollarSign, BookOpen, 
  FileText, Shield, Edit3, Printer, MessageSquare, Plus, Check
} from "lucide-react";
import { mockTeachers } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default function TeacherDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const teacherId = resolvedParams.id;

  const teacher = mockTeachers.find(t => t.id === teacherId) || {
    id: teacherId,
    name: 'Mr. Ahmad Shah',
    email: 'a.shah@school.edu',
    role: 'Senior Teacher',
    department: 'Mathematics',
    phone: '+92 300 9998877',
    assignedClass: 'Class 10-A',
    attendance: 96,
    salaryStatus: 'Paid',
    status: 'Active'
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'salary' | 'performance'>('profile');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-dashboard/teachers"
            className="p-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#996B1E] bg-[#FAF3E5] px-2 py-0.5 rounded border border-[#EBE5D9]">
                {teacher.id}
              </span>
              <span className="text-xs text-[#706B62]">{teacher.role} • {teacher.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mt-0.5">
              {teacher.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer size={14} className="text-[#C4993C]" />
            <span>Print Dossier</span>
          </button>
          
          <a
            href={`https://wa.me/923152123010?text=Hello%20${encodeURIComponent(teacher.name)}%2C%20from%20Principal%20Office.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <MessageSquare size={14} className="text-[#D4A843]" />
            <span>Message Faculty</span>
          </a>
        </div>
      </div>

      {/* ── Teacher Profile Header Card ── */}
      <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-xs p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#23201B] flex items-center justify-center text-[#D4A843] font-serif font-bold text-2xl shadow-md border-2 border-white flex-shrink-0">
              {teacher.name.split(" ").map(n => n[0]).join("")}
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="font-serif font-bold text-2xl text-[#23201B]">{teacher.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Full-Time Faculty
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3E5] text-[#996B1E] border border-[#EBE5D9]">
                  Class Teacher: {teacher.assignedClass}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-[#706B62]">
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[#C4993C]" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#C4993C]" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[#C4993C]" />
                  <span>Head of Mathematics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#EBE5D9] pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Faculty Attendance</span>
              <div className="font-serif font-bold text-xl text-emerald-700">{teacher.attendance}%</div>
              <span className="text-[9px] text-emerald-600 font-semibold">Verified Biometric</span>
            </div>
            
            <div className="h-8 w-px bg-[#EBE5D9]" />

            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Monthly Salary</span>
              <div className="font-serif font-bold text-xl text-[#23201B]">PKR 65,000</div>
              <span className="text-[9px] text-emerald-700 font-bold">Status: {teacher.salaryStatus}</span>
            </div>
          </div>

        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#EBE5D9] overflow-x-auto">
          {[
            { id: 'profile', label: 'Faculty Profile & Qualifications' },
            { id: 'schedule', label: 'Weekly Timetable & Classes' },
            { id: 'salary', label: 'Payroll & Salary Slips' },
            { id: 'performance', label: 'Student Reviews & Ratings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#23201B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#706B62] hover:text-[#23201B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Academic & Professional Credentials
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Highest Degree</span>
                <strong className="text-[#23201B]">M.Sc. Mathematics (Punjab University)</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Teaching Experience</span>
                <strong className="text-[#23201B]">8+ Years in O/A-Levels & Matric</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Date of Joining</span>
                <span className="text-[#23201B]">10th January 2021</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8C847B]">CNIC</span>
                <strong className="font-mono text-[#23201B]">35201-9988223-1</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Assigned Courses & Classes
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { class: 'Class 10-A', subject: 'Advanced Mathematics', students: 45, periods: '5 periods/week' },
                { class: 'Class 10-B', subject: 'General Mathematics', students: 42, periods: '5 periods/week' },
                { class: 'Class 9-A', subject: 'Algebra & Geometry', students: 48, periods: '4 periods/week' },
              ].map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#23201B]">{c.class} • {c.subject}</div>
                    <div className="text-[10px] text-[#706B62] mt-0.5">{c.students} Students Enrolled</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-[#EBE5D9] text-[#996B1E]">
                    {c.periods}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
          <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
            Weekly Teaching Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9]">
                <div className="font-bold text-[#23201B] pb-2 border-b border-[#EBE5D9] mb-2">{day}</div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded bg-white border border-[#EBE5D9]">
                    <span className="text-[9px] text-[#8C847B] block">08:30 - 09:15</span>
                    <strong>Class 10-A</strong> (Maths)
                  </div>
                  <div className="p-2 rounded bg-white border border-[#EBE5D9]">
                    <span className="text-[9px] text-[#8C847B] block">10:00 - 10:45</span>
                    <strong>Class 10-B</strong> (Maths)
                  </div>
                  <div className="p-2 rounded bg-white border border-[#EBE5D9]">
                    <span className="text-[9px] text-[#8C847B] block">11:30 - 12:15</span>
                    <strong>Class 9-A</strong> (Algebra)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
