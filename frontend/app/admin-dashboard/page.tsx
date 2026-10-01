"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users, Briefcase, TrendingUp, TrendingDown, CreditCard, AlertTriangle,
  BookOpen, CalendarDays, Bell, Clock, Plus, FileText, Eye,
  UserPlus, UserCheck, ArrowUpRight, ChevronRight, Megaphone,
  GraduationCap, Activity, DollarSign, Percent, CheckCircle2,
  XCircle, AlertCircle, Timer,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell, Tooltip,
} from "recharts";

// ────────────────────────────────────────────────────────────
// MONTHLY DATA — realistic variation across Jul–Dec 2026
// ────────────────────────────────────────────────────────────

interface MonthData {
  label: string;
  students: { total: number; change: number };
  staff: { total: number; change: number };
  attendance: { rate: number; present: number; absent: number; late: number };
  fees: { collected: number; outstanding: number; rate: number };
  classes: number;
  academic: { math: number; english: number; science: number; computer: number; urdu: number; islamiat: number };
  classAttendance: { name: string; students: number; present: number; absent: number }[];
  staffAttendance: { present: number; absent: number; onLeave: number; rate: number };
  attendanceTrend: { day: string; present: number; absent: number; late: number }[];
  feeTrend: { month: string; collected: number; outstanding: number }[];
  activities: { text: string; detail: string; time: string; type: "success" | "info" | "warning" | "primary" }[];
  events: { date: string; month: string; title: string; scope: string }[];
  notices: { title: string; date: string; description: string }[];
}

const monthlyData: Record<string, MonthData> = {
  "july-2026": {
    label: "July 2026",
    students: { total: 1215, change: 2.1 },
    staff: { total: 82, change: 0 },
    attendance: { rate: 92.8, present: 1128, absent: 57, late: 30 },
    fees: { collected: 4200000, outstanding: 580000, rate: 87.9 },
    classes: 36,
    academic: { math: 74, english: 80, science: 77, computer: 85, urdu: 73, islamiat: 84 },
    classAttendance: [
      { name: "Grade 1-A", students: 30, present: 28, absent: 2 },
      { name: "Grade 2-A", students: 33, present: 31, absent: 2 },
      { name: "Grade 3-A", students: 29, present: 26, absent: 3 },
      { name: "Grade 4-A", students: 34, present: 32, absent: 2 },
      { name: "Grade 5-A", students: 31, present: 28, absent: 3 },
      { name: "Grade 6-A", students: 35, present: 33, absent: 2 },
      { name: "Grade 7-A", students: 28, present: 25, absent: 3 },
      { name: "Grade 8-A", students: 32, present: 30, absent: 2 },
    ],
    staffAttendance: { present: 74, absent: 5, onLeave: 3, rate: 90.2 },
    attendanceTrend: Array.from({ length: 22 }, (_, i) => ({
      day: `${i + 1}`,
      present: 1080 + Math.round(Math.random() * 100),
      absent: 40 + Math.round(Math.random() * 30),
      late: 15 + Math.round(Math.random() * 20),
    })),
    feeTrend: [
      { month: "Mar", collected: 3900000, outstanding: 700000 },
      { month: "Apr", collected: 4050000, outstanding: 650000 },
      { month: "May", collected: 4100000, outstanding: 620000 },
      { month: "Jun", collected: 4150000, outstanding: 600000 },
      { month: "Jul", collected: 4200000, outstanding: 580000 },
    ],
    activities: [
      { text: "New student admitted", detail: "Sara Khan — Grade 5", time: "12 min ago", type: "success" },
      { text: "Fee payment received", detail: "PKR 22,000", time: "28 min ago", type: "primary" },
      { text: "Teacher leave approved", detail: "Mr. Farhan Ali", time: "1 hr ago", type: "warning" },
      { text: "Exam schedule published", detail: "Grade 6–8", time: "2 hr ago", type: "info" },
      { text: "Notice created", detail: "Summer Camp Registration", time: "3 hr ago", type: "info" },
    ],
    events: [
      { date: "12", month: "Jul", title: "Summer Camp Starts", scope: "All Grades" },
      { date: "18", month: "Jul", title: "Staff Training Workshop", scope: "All Staff" },
      { date: "25", month: "Jul", title: "Parent Orientation", scope: "Grade 1" },
    ],
    notices: [
      { title: "Summer Camp Registration Open", date: "Jul 5, 2026", description: "Registration for the annual summer camp is now open for all grades." },
      { title: "Revised Fee Structure", date: "Jul 3, 2026", description: "Updated fee schedule for the academic year 2026-2027." },
      { title: "Staff Training Schedule", date: "Jul 1, 2026", description: "Mandatory training sessions for all teaching staff." },
    ],
  },
  "august-2026": {
    label: "August 2026",
    students: { total: 1248, change: 3.2 },
    staff: { total: 86, change: 2.4 },
    attendance: { rate: 94.2, present: 1176, absent: 54, late: 18 },
    fees: { collected: 4850000, outstanding: 350000, rate: 93.2 },
    classes: 38,
    academic: { math: 78, english: 84, science: 81, computer: 89, urdu: 76, islamiat: 88 },
    classAttendance: [
      { name: "Grade 1-A", students: 32, present: 30, absent: 2 },
      { name: "Grade 2-A", students: 35, present: 34, absent: 1 },
      { name: "Grade 3-A", students: 31, present: 28, absent: 3 },
      { name: "Grade 4-A", students: 36, present: 35, absent: 1 },
      { name: "Grade 5-A", students: 33, present: 31, absent: 2 },
      { name: "Grade 6-A", students: 37, present: 36, absent: 1 },
      { name: "Grade 7-A", students: 30, present: 27, absent: 3 },
      { name: "Grade 8-A", students: 34, present: 33, absent: 1 },
    ],
    staffAttendance: { present: 78, absent: 4, onLeave: 4, rate: 90.7 },
    attendanceTrend: Array.from({ length: 26 }, (_, i) => ({
      day: `${i + 1}`,
      present: 1120 + Math.round(Math.random() * 110),
      absent: 35 + Math.round(Math.random() * 30),
      late: 10 + Math.round(Math.random() * 15),
    })),
    feeTrend: [
      { month: "Apr", collected: 4050000, outstanding: 650000 },
      { month: "May", collected: 4100000, outstanding: 620000 },
      { month: "Jun", collected: 4150000, outstanding: 600000 },
      { month: "Jul", collected: 4200000, outstanding: 580000 },
      { month: "Aug", collected: 4850000, outstanding: 350000 },
    ],
    activities: [
      { text: "New student admitted", detail: "Ali Ahmed — Grade 6", time: "10 min ago", type: "success" },
      { text: "Fee payment received", detail: "PKR 25,000", time: "35 min ago", type: "primary" },
      { text: "Teacher leave approved", detail: "Sarah Ahmed", time: "1 hr ago", type: "warning" },
      { text: "Exam result published", detail: "Grade 8 — Mathematics", time: "2 hr ago", type: "info" },
      { text: "Notice created", detail: "Parent Teacher Meeting", time: "3 hr ago", type: "info" },
    ],
    events: [
      { date: "15", month: "Aug", title: "Monthly Test", scope: "Grade 6–8" },
      { date: "18", month: "Aug", title: "Parent Teacher Meeting", scope: "All Grades" },
      { date: "22", month: "Aug", title: "Science Exhibition", scope: "Grade 5–10" },
      { date: "25", month: "Aug", title: "Mid Term Examination", scope: "All Grades" },
    ],
    notices: [
      { title: "Parent Teacher Meeting", date: "Aug 12, 2026", description: "PTM scheduled for August 18th. All parents are requested to attend." },
      { title: "Mid Term Examination Schedule", date: "Aug 10, 2026", description: "Mid-term exams will commence from August 25th for all grades." },
      { title: "School Holiday Announcement", date: "Aug 8, 2026", description: "School will remain closed on August 14th for Independence Day." },
    ],
  },
  "september-2026": {
    label: "September 2026",
    students: { total: 1262, change: 1.1 },
    staff: { total: 86, change: 0 },
    attendance: { rate: 95.1, present: 1200, absent: 44, late: 18 },
    fees: { collected: 5100000, outstanding: 280000, rate: 94.8 },
    classes: 38,
    academic: { math: 80, english: 86, science: 83, computer: 91, urdu: 78, islamiat: 90 },
    classAttendance: [
      { name: "Grade 1-A", students: 33, present: 32, absent: 1 },
      { name: "Grade 2-A", students: 36, present: 35, absent: 1 },
      { name: "Grade 3-A", students: 31, present: 29, absent: 2 },
      { name: "Grade 4-A", students: 37, present: 36, absent: 1 },
      { name: "Grade 5-A", students: 34, present: 33, absent: 1 },
      { name: "Grade 6-A", students: 38, present: 36, absent: 2 },
      { name: "Grade 7-A", students: 31, present: 29, absent: 2 },
      { name: "Grade 8-A", students: 35, present: 34, absent: 1 },
    ],
    staffAttendance: { present: 80, absent: 3, onLeave: 3, rate: 93.0 },
    attendanceTrend: Array.from({ length: 24 }, (_, i) => ({
      day: `${i + 1}`,
      present: 1150 + Math.round(Math.random() * 100),
      absent: 30 + Math.round(Math.random() * 25),
      late: 10 + Math.round(Math.random() * 15),
    })),
    feeTrend: [
      { month: "May", collected: 4100000, outstanding: 620000 },
      { month: "Jun", collected: 4150000, outstanding: 600000 },
      { month: "Jul", collected: 4200000, outstanding: 580000 },
      { month: "Aug", collected: 4850000, outstanding: 350000 },
      { month: "Sep", collected: 5100000, outstanding: 280000 },
    ],
    activities: [
      { text: "Fee payment received", detail: "PKR 30,000 — Batch payment", time: "5 min ago", type: "primary" },
      { text: "New teacher joined", detail: "Ms. Ayesha Siddiqui — English", time: "20 min ago", type: "success" },
      { text: "Attendance marked", detail: "Grade 10-A, 10-B", time: "45 min ago", type: "info" },
      { text: "Exam result published", detail: "Mid Term — Grade 6", time: "1 hr ago", type: "info" },
      { text: "Leave request pending", detail: "Mr. Hassan Ali — 3 days", time: "2 hr ago", type: "warning" },
    ],
    events: [
      { date: "5", month: "Sep", title: "Sports Day", scope: "All Grades" },
      { date: "12", month: "Sep", title: "Quiz Competition", scope: "Grade 4–8" },
      { date: "20", month: "Sep", title: "Annual Day Rehearsal", scope: "Selected Students" },
      { date: "28", month: "Sep", title: "Monthly Assessment", scope: "All Grades" },
    ],
    notices: [
      { title: "Sports Day Preparations", date: "Sep 1, 2026", description: "Sports day scheduled for September 5th. Students must wear sports uniforms." },
      { title: "Quiz Competition Registration", date: "Sep 3, 2026", description: "Inter-class quiz competition for grades 4-8. Register by September 10th." },
      { title: "Annual Day Planning", date: "Sep 5, 2026", description: "Annual day celebrations planned for October. Rehearsals begin September 20th." },
    ],
  },
  "october-2026": {
    label: "October 2026",
    students: { total: 1270, change: 0.6 },
    staff: { total: 87, change: 1.2 },
    attendance: { rate: 93.5, present: 1188, absent: 58, late: 24 },
    fees: { collected: 4950000, outstanding: 420000, rate: 92.2 },
    classes: 38,
    academic: { math: 76, english: 82, science: 79, computer: 87, urdu: 75, islamiat: 86 },
    classAttendance: [
      { name: "Grade 1-A", students: 33, present: 31, absent: 2 },
      { name: "Grade 2-A", students: 36, present: 34, absent: 2 },
      { name: "Grade 3-A", students: 32, present: 29, absent: 3 },
      { name: "Grade 4-A", students: 37, present: 35, absent: 2 },
      { name: "Grade 5-A", students: 34, present: 32, absent: 2 },
      { name: "Grade 6-A", students: 38, present: 35, absent: 3 },
      { name: "Grade 7-A", students: 31, present: 28, absent: 3 },
      { name: "Grade 8-A", students: 35, present: 33, absent: 2 },
    ],
    staffAttendance: { present: 79, absent: 4, onLeave: 4, rate: 90.8 },
    attendanceTrend: Array.from({ length: 23 }, (_, i) => ({
      day: `${i + 1}`,
      present: 1100 + Math.round(Math.random() * 120),
      absent: 38 + Math.round(Math.random() * 32),
      late: 12 + Math.round(Math.random() * 18),
    })),
    feeTrend: [
      { month: "Jun", collected: 4150000, outstanding: 600000 },
      { month: "Jul", collected: 4200000, outstanding: 580000 },
      { month: "Aug", collected: 4850000, outstanding: 350000 },
      { month: "Sep", collected: 5100000, outstanding: 280000 },
      { month: "Oct", collected: 4950000, outstanding: 420000 },
    ],
    activities: [
      { text: "Annual day celebrated", detail: "Cultural performances", time: "8 min ago", type: "success" },
      { text: "Fee defaulter notice sent", detail: "12 students", time: "30 min ago", type: "warning" },
      { text: "New admission approved", detail: "Bilal Hussain — Grade 3", time: "1 hr ago", type: "success" },
      { text: "Exam schedule announced", detail: "Final Term — December", time: "2 hr ago", type: "info" },
      { text: "Staff meeting conducted", detail: "Academic review", time: "4 hr ago", type: "info" },
    ],
    events: [
      { date: "2", month: "Oct", title: "Annual Day Celebration", scope: "All Grades" },
      { date: "10", month: "Oct", title: "Science Fair", scope: "Grade 6–10" },
      { date: "18", month: "Oct", title: "Career Counseling Session", scope: "Grade 9–10" },
      { date: "27", month: "Oct", title: "Monthly Test", scope: "All Grades" },
    ],
    notices: [
      { title: "Annual Day Celebration", date: "Oct 1, 2026", description: "Annual day celebrations on October 2nd. All parents are cordially invited." },
      { title: "Science Fair Guidelines", date: "Oct 5, 2026", description: "Science fair projects submission deadline is October 8th." },
      { title: "Fee Payment Reminder", date: "Oct 8, 2026", description: "Last date for fee payment without late fee is October 15th." },
    ],
  },
  "november-2026": {
    label: "November 2026",
    students: { total: 1258, change: -0.9 },
    staff: { total: 85, change: -2.3 },
    attendance: { rate: 91.7, present: 1154, absent: 72, late: 32 },
    fees: { collected: 4650000, outstanding: 520000, rate: 89.9 },
    classes: 38,
    academic: { math: 72, english: 79, science: 75, computer: 84, urdu: 71, islamiat: 83 },
    classAttendance: [
      { name: "Grade 1-A", students: 32, present: 29, absent: 3 },
      { name: "Grade 2-A", students: 35, present: 32, absent: 3 },
      { name: "Grade 3-A", students: 31, present: 28, absent: 3 },
      { name: "Grade 4-A", students: 36, present: 33, absent: 3 },
      { name: "Grade 5-A", students: 33, present: 30, absent: 3 },
      { name: "Grade 6-A", students: 37, present: 34, absent: 3 },
      { name: "Grade 7-A", students: 30, present: 27, absent: 3 },
      { name: "Grade 8-A", students: 34, present: 31, absent: 3 },
    ],
    staffAttendance: { present: 75, absent: 5, onLeave: 5, rate: 88.2 },
    attendanceTrend: Array.from({ length: 21 }, (_, i) => ({
      day: `${i + 1}`,
      present: 1060 + Math.round(Math.random() * 130),
      absent: 45 + Math.round(Math.random() * 40),
      late: 15 + Math.round(Math.random() * 25),
    })),
    feeTrend: [
      { month: "Jul", collected: 4200000, outstanding: 580000 },
      { month: "Aug", collected: 4850000, outstanding: 350000 },
      { month: "Sep", collected: 5100000, outstanding: 280000 },
      { month: "Oct", collected: 4950000, outstanding: 420000 },
      { month: "Nov", collected: 4650000, outstanding: 520000 },
    ],
    activities: [
      { text: "Student withdrawn", detail: "Ahmed Raza — Grade 7 (transferred)", time: "15 min ago", type: "warning" },
      { text: "Fee collection drive", detail: "PKR 180,000 collected today", time: "40 min ago", type: "primary" },
      { text: "Teacher resigned", detail: "Ms. Fatima Noor — Physics", time: "2 hr ago", type: "warning" },
      { text: "Exam prep started", detail: "Final term revision classes", time: "3 hr ago", type: "info" },
      { text: "Notice published", detail: "Winter uniform mandatory", time: "5 hr ago", type: "info" },
    ],
    events: [
      { date: "5", month: "Nov", title: "Winter Uniform Starts", scope: "All Students" },
      { date: "15", month: "Nov", title: "Pre-Board Exams", scope: "Grade 9–10" },
      { date: "22", month: "Nov", title: "PTA Meeting", scope: "All Parents" },
      { date: "29", month: "Nov", title: "Final Term Starts", scope: "All Grades" },
    ],
    notices: [
      { title: "Winter Uniform Notification", date: "Nov 1, 2026", description: "Winter uniforms mandatory from November 5th. Ensure proper uniform compliance." },
      { title: "Final Term Exam Schedule", date: "Nov 10, 2026", description: "Final term examinations begin November 29th. Detailed schedule attached." },
      { title: "PTA Meeting Invitation", date: "Nov 15, 2026", description: "PTA meeting on November 22nd at 10:00 AM in the school auditorium." },
    ],
  },
  "december-2026": {
    label: "December 2026",
    students: { total: 1255, change: -0.2 },
    staff: { total: 84, change: -1.2 },
    attendance: { rate: 89.3, present: 1121, absent: 98, late: 36 },
    fees: { collected: 4400000, outstanding: 680000, rate: 86.6 },
    classes: 38,
    academic: { math: 70, english: 77, science: 73, computer: 82, urdu: 69, islamiat: 81 },
    classAttendance: [
      { name: "Grade 1-A", students: 31, present: 27, absent: 4 },
      { name: "Grade 2-A", students: 34, present: 30, absent: 4 },
      { name: "Grade 3-A", students: 30, present: 27, absent: 3 },
      { name: "Grade 4-A", students: 35, present: 31, absent: 4 },
      { name: "Grade 5-A", students: 32, present: 28, absent: 4 },
      { name: "Grade 6-A", students: 36, present: 32, absent: 4 },
      { name: "Grade 7-A", students: 29, present: 26, absent: 3 },
      { name: "Grade 8-A", students: 33, present: 29, absent: 4 },
    ],
    staffAttendance: { present: 72, absent: 6, onLeave: 6, rate: 85.7 },
    attendanceTrend: Array.from({ length: 18 }, (_, i) => ({
      day: `${i + 1}`,
      present: 1020 + Math.round(Math.random() * 140),
      absent: 55 + Math.round(Math.random() * 50),
      late: 18 + Math.round(Math.random() * 25),
    })),
    feeTrend: [
      { month: "Aug", collected: 4850000, outstanding: 350000 },
      { month: "Sep", collected: 5100000, outstanding: 280000 },
      { month: "Oct", collected: 4950000, outstanding: 420000 },
      { month: "Nov", collected: 4650000, outstanding: 520000 },
      { month: "Dec", collected: 4400000, outstanding: 680000 },
    ],
    activities: [
      { text: "Final exams started", detail: "Grade 1–5 today", time: "8 min ago", type: "info" },
      { text: "Fee defaulter list updated", detail: "18 students pending", time: "25 min ago", type: "warning" },
      { text: "Result compiled", detail: "Grade 9 — Pre-board", time: "1 hr ago", type: "success" },
      { text: "Winter vacation notice", detail: "Dec 20 — Jan 5", time: "2 hr ago", type: "info" },
      { text: "Staff bonus approved", detail: "Annual performance bonus", time: "4 hr ago", type: "success" },
    ],
    events: [
      { date: "1", month: "Dec", title: "Final Exams Begin", scope: "Grade 1–5" },
      { date: "8", month: "Dec", title: "Final Exams Begin", scope: "Grade 6–10" },
      { date: "18", month: "Dec", title: "Result Day", scope: "All Grades" },
      { date: "20", month: "Dec", title: "Winter Vacation Starts", scope: "All" },
    ],
    notices: [
      { title: "Final Examination Guidelines", date: "Dec 1, 2026", description: "Final examinations in progress. Ensure students follow exam hall rules." },
      { title: "Winter Vacation Announcement", date: "Dec 15, 2026", description: "Winter vacation from December 20th to January 5th, 2027." },
      { title: "Annual Result Declaration", date: "Dec 18, 2026", description: "Annual results will be declared on December 18th. Report cards available." },
    ],
  },
};

const months = [
  { value: "july-2026", label: "July 2026" },
  { value: "august-2026", label: "August 2026" },
  { value: "september-2026", label: "September 2026" },
  { value: "october-2026", label: "October 2026" },
  { value: "november-2026", label: "November 2026" },
  { value: "december-2026", label: "December 2026" },
];

const academicYears = [
  { value: "2026-2027", label: "2026 – 2027" },
  { value: "2025-2026", label: "2025 – 2026" },
];

// ────────────────────────────────────────────────────────────
// FORMATTING HELPERS
// ────────────────────────────────────────────────────────────

function formatPKR(value: number): string {
  if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(0)}K`;
  return `PKR ${value.toLocaleString()}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function getAttendanceBadge(rate: number) {
  if (rate >= 95) return { color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  if (rate >= 90) return { color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-400" };
  if (rate >= 85) return { color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
  return { color: "bg-red-50 text-red-700", dot: "bg-red-500" };
}

function getActivityIcon(type: "success" | "info" | "warning" | "primary") {
  const styles: Record<typeof type, string> = {
    success: "bg-emerald-100 text-emerald-600",
    info: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
    primary: "bg-violet-100 text-violet-600",
  };
  return styles[type];
}

// ────────────────────────────────────────────────────────────
// CHART CONFIGS
// ────────────────────────────────────────────────────────────

const attendanceChartConfig = {
  present: { label: "Present", color: "#3B82F6" },
  absent: { label: "Absent", color: "#F43F5E" },
  late: { label: "Late", color: "#F59E0B" },
};

const feeChartConfig = {
  collected: { label: "Collected", color: "#3B82F6" },
  outstanding: { label: "Outstanding", color: "#F59E0B" },
};

const subjectColors = ["#3B82F6", "#06B6D4", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"];

// ────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ────────────────────────────────────────────────────────────

export default function AdminOverview() {
  const [selectedMonth, setSelectedMonth] = useState("august-2026");
  const [selectedYear, setSelectedYear] = useState("2026-2027");

  const data = useMemo(() => monthlyData[selectedMonth], [selectedMonth]);

  const subjectData = useMemo(() => [
    { subject: "Mathematics", score: data.academic.math },
    { subject: "English", score: data.academic.english },
    { subject: "Science", score: data.academic.science },
    { subject: "Computer", score: data.academic.computer },
    { subject: "Urdu", score: data.academic.urdu },
    { subject: "Islamiat", score: data.academic.islamiat },
  ], [data]);

  const kpiCards = useMemo(() => [
    {
      label: "Total Students",
      value: formatNumber(data.students.total),
      change: data.students.change,
      icon: <GraduationCap size={20} />,
      iconBg: "bg-blue-50 text-blue-600",
      accent: "border-l-blue-500",
    },
    {
      label: "Total Staff",
      value: formatNumber(data.staff.total),
      change: data.staff.change,
      icon: <Briefcase size={20} />,
      iconBg: "bg-teal-50 text-teal-600",
      accent: "border-l-teal-500",
    },
    {
      label: "Attendance Rate",
      value: `${data.attendance.rate}%`,
      change: data.attendance.rate > 93 ? data.attendance.rate - 93 : -(93 - data.attendance.rate),
      icon: <CheckCircle2 size={20} />,
      iconBg: "bg-emerald-50 text-emerald-600",
      accent: "border-l-emerald-500",
    },
    {
      label: "Fee Collection",
      value: formatPKR(data.fees.collected),
      change: data.fees.rate > 90 ? 2.4 : -1.2,
      icon: <CreditCard size={20} />,
      iconBg: "bg-violet-50 text-violet-600",
      accent: "border-l-violet-500",
    },
    {
      label: "Pending Fees",
      value: formatPKR(data.fees.outstanding),
      change: data.fees.outstanding > 400000 ? 3.1 : -2.8,
      invertChange: true,
      icon: <AlertTriangle size={20} />,
      iconBg: "bg-amber-50 text-amber-600",
      accent: "border-l-amber-500",
    },
    {
      label: "Active Classes",
      value: String(data.classes),
      change: 0,
      icon: <BookOpen size={20} />,
      iconBg: "bg-slate-100 text-slate-600",
      accent: "border-l-slate-400",
    },
  ], [data]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── HEADER ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sora text-slate-900 tracking-tight">
            Principal Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your school&apos;s academic and operational performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 text-sm bg-white min-w-[140px]">
              <CalendarDays size={14} className="text-slate-400 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((y) => (
                <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="h-9 text-sm bg-white min-w-[160px]">
              <CalendarDays size={14} className="text-slate-400 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── KPI CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl border border-slate-100 border-l-[3px] ${card.accent} p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
              {card.change !== 0 && (
                <span
                  className={`text-[11px] font-semibold flex items-center gap-0.5 ${
                    (card as any).invertChange
                      ? card.change > 0 ? "text-red-500" : "text-emerald-600"
                      : card.change > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {card.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(card.change).toFixed(1)}%
                </span>
              )}
            </div>
            <div className="text-xl font-bold font-sora text-slate-900 leading-tight">{card.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── ROW: ATTENDANCE CHART + STAFF ATTENDANCE ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-sora font-semibold text-slate-800 text-[15px]">Attendance Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">{data.label} — Daily trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Late</span>
            </div>
          </div>
          <ChartContainer config={attendanceChartConfig} className="h-[240px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[11px]">
            <AreaChart data={data.attendanceTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={2} fill="url(#gradPresent)" />
              <Area type="monotone" dataKey="absent" stroke="#F43F5E" strokeWidth={1.5} fill="transparent" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={1.5} fill="transparent" strokeDasharray="4 2" />
            </AreaChart>
          </ChartContainer>
          {/* Summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-medium">Avg. Attendance</p>
              <p className="text-lg font-bold text-slate-800">{data.attendance.rate}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Present</p>
              <p className="text-lg font-bold text-blue-600">{formatNumber(data.attendance.present)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Absent</p>
              <p className="text-lg font-bold text-rose-500">{formatNumber(data.attendance.absent)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Late</p>
              <p className="text-lg font-bold text-amber-500">{formatNumber(data.attendance.late)}</p>
            </div>
          </div>
        </div>

        {/* Staff Attendance */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 flex flex-col">
          <h2 className="font-sora font-semibold text-slate-800 text-[15px] mb-1">Staff Attendance</h2>
          <p className="text-xs text-slate-400 mb-5">{data.label}</p>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            <div className="text-center">
              <div className="text-3xl font-bold font-sora text-slate-900">{data.staffAttendance.rate}%</div>
              <p className="text-xs text-slate-400 mt-1">Attendance Rate</p>
            </div>
            <Progress value={data.staffAttendance.rate} className="h-2.5 rounded-full bg-slate-100" />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-50/70 rounded-lg py-3 px-2">
                <div className="text-lg font-bold text-emerald-700">{data.staffAttendance.present}</div>
                <div className="text-[11px] text-emerald-600 font-medium">Present</div>
              </div>
              <div className="bg-rose-50/70 rounded-lg py-3 px-2">
                <div className="text-lg font-bold text-rose-600">{data.staffAttendance.absent}</div>
                <div className="text-[11px] text-rose-500 font-medium">Absent</div>
              </div>
              <div className="bg-amber-50/70 rounded-lg py-3 px-2">
                <div className="text-lg font-bold text-amber-600">{data.staffAttendance.onLeave}</div>
                <div className="text-[11px] text-amber-500 font-medium">On Leave</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW: ACADEMIC PERFORMANCE + FEE COLLECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Academic Performance */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-sora font-semibold text-slate-800 text-[15px]">Academic Performance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Average scores by subject</p>
            </div>
            <Link
              href="#"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View Reports <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }} width={85} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {subjectData.map((_, i) => (
                    <Cell key={i} fill={subjectColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-sora font-semibold text-slate-800 text-[15px]">Fee Collection</h2>
              <p className="text-xs text-slate-400 mt-0.5">{data.label} — Collection overview</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
              <Percent size={14} />
              {data.fees.rate}%
            </div>
          </div>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50/60 rounded-lg p-3">
              <p className="text-[11px] text-blue-500 font-medium mb-0.5">Collected</p>
              <p className="text-sm font-bold text-blue-700">{formatPKR(data.fees.collected)}</p>
            </div>
            <div className="bg-amber-50/60 rounded-lg p-3">
              <p className="text-[11px] text-amber-500 font-medium mb-0.5">Outstanding</p>
              <p className="text-sm font-bold text-amber-700">{formatPKR(data.fees.outstanding)}</p>
            </div>
            <div className="bg-emerald-50/60 rounded-lg p-3">
              <p className="text-[11px] text-emerald-500 font-medium mb-0.5">Collection Rate</p>
              <p className="text-sm font-bold text-emerald-700">{data.fees.rate}%</p>
            </div>
          </div>
          {/* Fee trend chart */}
          <ChartContainer config={feeChartConfig} className="h-[170px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[11px]">
            <BarChart data={data.feeTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="collected" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar dataKey="outstanding" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* ── CLASS ATTENDANCE TABLE ─────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-sora font-semibold text-slate-800 text-[15px]">Class Attendance</h2>
            <p className="text-xs text-slate-400 mt-0.5">{data.label} — Class-wise breakdown</p>
          </div>
          <Link
            href="/admin-dashboard/attendance"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Students</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Present</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Absent</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Attendance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.classAttendance.map((cls) => {
                const rate = parseFloat(((cls.present / cls.students) * 100).toFixed(1));
                const badge = getAttendanceBadge(rate);
                return (
                  <TableRow key={cls.name} className="border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-800 text-sm">{cls.name}</TableCell>
                    <TableCell className="text-center text-sm text-slate-600">{cls.students}</TableCell>
                    <TableCell className="text-center text-sm text-emerald-600 font-medium">{cls.present}</TableCell>
                    <TableCell className="text-center text-sm text-rose-500 font-medium">{cls.absent}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {rate}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── ROW: ACTIVITIES + EVENTS + NOTICES ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <h2 className="font-sora font-semibold text-slate-800 text-[15px] mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {data.activities.map((act, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${getActivityIcon(act.type)}`}>
                  <Activity size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium leading-snug">{act.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{act.detail}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <h2 className="font-sora font-semibold text-slate-800 text-[15px] mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {data.events.map((evt, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <span className="text-sm font-bold text-blue-700 leading-none">{evt.date}</span>
                  <span className="text-[10px] text-blue-500 font-medium uppercase">{evt.month}</span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-slate-800 font-medium">{evt.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{evt.scope}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* School Notices */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora font-semibold text-slate-800 text-[15px]">Notices</h2>
            <Link
              href="/admin-dashboard/notices"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data.notices.map((notice, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Megaphone size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 font-medium leading-snug">{notice.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{notice.date}</p>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{notice.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ──────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <h2 className="font-sora font-semibold text-slate-800 text-[15px] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2.5">
          {[
            { label: "Add Student", href: "/admin-dashboard/students", icon: <UserPlus size={15} />, color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
            { label: "Add Teacher", href: "/admin-dashboard/teachers", icon: <UserCheck size={15} />, color: "hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200" },
            { label: "Create Notice", href: "/admin-dashboard/notices", icon: <Megaphone size={15} />, color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
            { label: "View Fees", href: "/admin-dashboard/fees", icon: <CreditCard size={15} />, color: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200" },
            { label: "View Reports", href: "#", icon: <FileText size={15} />, color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 transition-all duration-150 ${action.color}`}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
