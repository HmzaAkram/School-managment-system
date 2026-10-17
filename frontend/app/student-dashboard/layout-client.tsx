"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { api, getStoredUser } from "@/lib/api";
import { LayoutDashboard, BookOpen, BarChart2, CheckSquare, FileText, CreditCard, Book, Sparkles } from "lucide-react";

const navItems = [
  { label: 'Overview',     href: '/student-dashboard',             icon: <LayoutDashboard size={18} /> },
  { label: 'My Classes',   href: '/student-dashboard/classes',     icon: <BookOpen size={18} /> },
  { label: 'Grades & Reports', href: '/student-dashboard/grades',      icon: <BarChart2 size={18} /> },
  { label: 'Attendance',   href: '/student-dashboard/attendance',  icon: <CheckSquare size={18} /> },
  { label: 'Assignments',  href: '/student-dashboard/assignments', icon: <FileText size={18} /> },
  { label: 'Diaries',      href: '/student-dashboard/diaries',     icon: <Book size={18} /> },
  { label: 'Fees',         href: '/student-dashboard/fees',        icon: <CreditCard size={18} /> },
  { label: 'AI Assistant', href: '/student-dashboard/ai-assistant', icon: <Sparkles size={18} /> },
];

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState('Student');
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = getStoredUser();
    if (!token || !user || (user.role !== 'student' && user.role !== 'parent')) {
      router.push('/login');
    } else {
      setUserName(user.name || 'Student');
      setSchool(user.school || null);
      setIsAuthorized(true);

      api.get('/auth/me').then((res: any) => {
        if (res?.user?.school) {
          setSchool(res.user.school);
          const updated = { ...user, ...res.user };
          localStorage.setItem('user', JSON.stringify(updated));
        }
      }).catch(() => {});
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      userInitials={userName.slice(0, 2).toUpperCase()}
      navItems={navItems}
      onLogout={handleLogout}
      school={school}
    >
      {children}
    </DashboardLayout>
  );
}
