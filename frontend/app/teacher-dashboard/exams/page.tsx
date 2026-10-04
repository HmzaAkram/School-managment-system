"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Plus,
  CheckCircle2,
  FileText,
  Award,
  ChevronRight,
  Edit3,
  Save,
  X,
  Sparkles,
  Check
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  className: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  candidates: number;
  status: "Scheduled" | "Grading Ready" | "Published";
  topics: string;
}

interface StudentGradeRow {
  rollNo: string;
  name: string;
  theory: number;    // out of 75
  practical: number; // out of 15
  assignment: number;// out of 10
}

const initialStudentGrades: StudentGradeRow[] = [
  { rollNo: "10-A-01", name: "Ali Hassan", theory: 70, practical: 14, assignment: 10 },
  { rollNo: "10-A-02", name: "Ayesha Khan", theory: 68, practical: 13, assignment: 9 },
  { rollNo: "10-A-03", name: "Omar Sheikh", theory: 65, practical: 14, assignment: 9 },
  { rollNo: "10-A-04", name: "Zara Qureshi", theory: 62, practical: 12, assignment: 8 },
  { rollNo: "10-A-05", name: "Bilal Nawaz", theory: 72, practical: 15, assignment: 10 },
  { rollNo: "10-A-06", name: "Hamza Malik", theory: 58, practical: 11, assignment: 8 },
  { rollNo: "10-A-07", name: "Maryam Tariq", theory: 71, practical: 14, assignment: 10 },
  { rollNo: "10-A-08", name: "Usman Ghani", theory: 64, practical: 13, assignment: 9 },
  { rollNo: "10-A-09", name: "Fatima Noor", theory: 69, practical: 14, assignment: 9 },
  { rollNo: "10-A-10", name: "Zubair Ahmed", theory: 55, practical: 10, assignment: 7 },
];

const mockExams: Exam[] = [
  { id: "EX-01", title: "Term 2 Mid-Term Mathematics Assessment", className: "Grade 10-A", subject: "Advanced Mathematics", date: "Oct 28, 2026", time: "09:00 - 11:30 AM", room: "Examination Hall A", candidates: 45, status: "Scheduled", topics: "Quadratic Equations, Complex Numbers, Trigonometry" },
  { id: "EX-02", title: "Term 2 Mid-Term Mathematics Assessment", className: "Grade 10-B", subject: "Advanced Mathematics", date: "Oct 29, 2026", time: "09:00 - 11:30 AM", room: "Examination Hall B", candidates: 42, status: "Scheduled", topics: "Quadratic Equations, Complex Numbers, Trigonometry" },
  { id: "EX-03", title: "Diagnostic Geometry & Circle Theorems Quiz", className: "Grade 9-A", subject: "Pure Mathematics", date: "Oct 20, 2026", time: "10:00 - 11:00 AM", room: "Room 103", candidates: 48, status: "Grading Ready", topics: "Angles, Tangents, Chord Properties" },
  { id: "EX-04", title: "Monthly Algebra Speed Test 3", className: "Grade 10-A", subject: "Advanced Mathematics", date: "Oct 12, 2026", time: "08:45 - 09:30 AM", room: "Room 101", candidates: 45, status: "Published", topics: "Polynomial Division & Roots Factorization" },
];

export default function TeacherExams() {
  const [filter, setFilter] = useState("All");
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [selectedExamTitle, setSelectedExamTitle] = useState("Term 2 Mid-Term Mathematics Assessment (Grade 10-A)");
  const [gradesData, setGradesData] = useState<StudentGradeRow[]>(initialStudentGrades);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const handleGradeChange = (index: number, field: "theory" | "practical" | "assignment", value: number) => {
    const updated = [...gradesData];
    updated[index][field] = Math.max(0, Number(value));
    setGradesData(updated);
  };

  const getCalculatedStats = (row: StudentGradeRow) => {
    const total = row.theory + row.practical + row.assignment;
    let grade = "F";
    let gpa = "0.0";
    if (total >= 90) { grade = "A+"; gpa = "4.0"; }
    else if (total >= 80) { grade = "A"; gpa = "3.7"; }
    else if (total >= 70) { grade = "B"; gpa = "3.0"; }
    else if (total >= 60) { grade = "C"; gpa = "2.0"; }
    else if (total >= 50) { grade = "D"; gpa = "1.0"; }
    return { total, grade, gpa };
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGridModalOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 4000);
  };

  const filteredExams = mockExams.filter(e => filter === "All" || e.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Assessments & Marks Entry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Exams & Gradebook Hub</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Track midterm testing schedules, enter rubric scores, and enter bulk class marks rapidly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGridModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Edit3 size={15} className="text-[#D4A843]" />
            <span>⚡ Quick Excel Marks Grid</span>
          </button>
        </div>
      </div>

      {saveSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Marks submitted and published to student gradebook transcripts successfully!</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-2">
        {["All", "Scheduled", "Grading Ready", "Published"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === t
                ? "bg-[#23201B] text-white shadow-sm"
                : "text-[#706B62] hover:bg-[#FAF8F5] hover:text-[#23201B]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Exam Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-[#EBE8E2] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  exam.status === "Scheduled" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                  exam.status === "Grading Ready" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                  "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {exam.status}
                </span>
                <span className="font-mono text-xs text-[#8C877D]">{exam.id}</span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#23201B] font-sora">{exam.title}</h3>
                <p className="text-xs text-[#C4993C] font-semibold mt-0.5">{exam.className} • {exam.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-[#706B62] bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EBE8E2]">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#C4993C]" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#C4993C]" />
                  <span>{exam.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#C4993C]" />
                  <span>{exam.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#C4993C]" />
                  <span>{exam.candidates} Candidates</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#8C877D] uppercase tracking-wider block mb-1">Topics Tested</span>
                <p className="text-xs text-[#5C564D] leading-relaxed">{exam.topics}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EBE8E2]">
              <button 
                onClick={() => alert(`Downloading seating arrangement and roll sheet for ${exam.id}`)}
                className="text-xs font-semibold text-[#706B62] hover:text-[#23201B] flex items-center gap-1"
              >
                <Download size={13} /> Seating Plan
              </button>
              
              <button 
                onClick={() => {
                  setSelectedExamTitle(`${exam.title} (${exam.className})`);
                  setIsGridModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Edit3 size={13} className="text-[#C4993C]" />
                <span>Enter Class Marks</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Excel-Like Marks Entry Modal ── */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-4xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[10px] uppercase">
                      Fast Spreadsheet Input
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#23201B] mt-1">{selectedExamTitle}</h3>
                  <p className="text-xs text-[#706B62]">Theory (75) + Practical (15) + Assignment (10) = Total 100 Marks</p>
                </div>
                <button onClick={() => setIsGridModalOpen(false)} className="text-[#8C847B] hover:text-[#23201B]">
                  <X size={20} />
                </button>
              </div>

              {/* Excel Table Grid */}
              <div className="overflow-x-auto max-h-[50vh] border border-[#EBE5D9] rounded-2xl">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                    <tr>
                      <th className="text-left py-3 px-4 font-bold uppercase">Roll #</th>
                      <th className="text-left py-3 px-4 font-bold uppercase">Student Name</th>
                      <th className="text-center py-3 px-3 font-bold uppercase">Theory (/75)</th>
                      <th className="text-center py-3 px-3 font-bold uppercase">Practical (/15)</th>
                      <th className="text-center py-3 px-3 font-bold uppercase">Assignment (/10)</th>
                      <th className="text-center py-3 px-3 font-bold uppercase">Total (/100)</th>
                      <th className="text-center py-3 px-3 font-bold uppercase">Grade</th>
                      <th className="text-center py-3 px-3 font-bold uppercase">GPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE9] bg-white">
                    {gradesData.map((row, idx) => {
                      const { total, grade, gpa } = getCalculatedStats(row);

                      return (
                        <tr key={row.rollNo} className="hover:bg-[#FAF8F5]/80">
                          <td className="py-2.5 px-4 font-mono font-bold text-[#996B1E]">{row.rollNo}</td>
                          <td className="py-2.5 px-4 font-bold text-[#23201B]">{row.name}</td>
                          
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={75}
                              value={row.theory}
                              onChange={e => handleGradeChange(idx, "theory", Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center font-mono font-bold bg-[#FAF8F5] border border-[#D9D4CC] rounded-lg focus:outline-none focus:border-[#C4993C]"
                            />
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={15}
                              value={row.practical}
                              onChange={e => handleGradeChange(idx, "practical", Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center font-mono font-bold bg-[#FAF8F5] border border-[#D9D4CC] rounded-lg focus:outline-none focus:border-[#C4993C]"
                            />
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={row.assignment}
                              onChange={e => handleGradeChange(idx, "assignment", Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center font-mono font-bold bg-[#FAF8F5] border border-[#D9D4CC] rounded-lg focus:outline-none focus:border-[#C4993C]"
                            />
                          </td>

                          <td className="py-2.5 px-3 text-center font-mono font-bold text-sm text-emerald-700">
                            {total}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-xs">
                              {grade}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center font-mono font-bold text-[#706B62]">
                            {gpa}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-[#EBE5D9]">
              <div className="text-xs text-[#706B62]">
                Auto-computing Class Average: <strong>89.2% (Grade A+)</strong> • 10 of 10 Students Graded
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsGridModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGrades}
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Publish All Marks</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
