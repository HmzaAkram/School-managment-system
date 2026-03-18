"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Users, Briefcase, BookOpen, CheckSquare, CreditCard, BellRing } from "lucide-react";

const navItems = [
  { label: 'Overview',    href: '/admin-dashboard',            icon: <LayoutDashboard size={18} /> },
  { label: 'Students',    href: '/admin-dashboard/students',   icon: <Users size={18} /> },
  { label: 'Teachers',    href: '/admin-dashboard/teachers',   icon: <Briefcase size={18} /> },
  { label: 'Classes',     href: '/admin-dashboard/classes',    icon: <BookOpen size={18} /> },
  { label: 'Attendance',  href: '/admin-dashboard/attendance', icon: <CheckSquare size={18} /> },
  { label: 'Fees',        href: '/admin-dashboard/fees',       icon: <CreditCard size={18} /> },
  { label: 'Notices',     href: '/admin-dashboard/notices',    icon: <BellRing size={18} /> },
];

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') router.push('/login');
    else setIsAuthorized(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin" userName="Administrator" userInitials="AD" navItems={navItems} onLogout={handleLogout}>
      {children}
    </DashboardLayout>
  );
}
