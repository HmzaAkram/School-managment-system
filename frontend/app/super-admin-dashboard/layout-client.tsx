"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Building2, CreditCard, Receipt, BookOpen, BarChart3, HelpCircle, Settings } from "lucide-react";

const navItems = [
  { label: 'Dashboard',      href: '/super-admin-dashboard',          icon: <LayoutDashboard size={18} /> },
  { label: 'Schools',        href: '/super-admin-dashboard/schools',  icon: <Building2 size={18} /> },
  { label: 'Payments',       href: '/super-admin-dashboard/payments', icon: <CreditCard size={18} /> },
  { label: 'Expenses',       href: '/super-admin-dashboard/expenses', icon: <Receipt size={18} /> },
  { label: 'Ledger',         href: '/super-admin-dashboard/ledger',   icon: <BookOpen size={18} /> },
  { label: 'Reports',        href: '/super-admin-dashboard/reports',  icon: <BarChart3 size={18} /> },
  { label: 'Support Queries',href: '/super-admin-dashboard/support',  icon: <HelpCircle size={18} /> },
  { label: 'Settings',       href: '/super-admin-dashboard/settings', icon: <Settings size={18} /> },
];

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState('Super Administrator');

  useEffect(() => {
    const token = localStorage.getItem('token');
    let user: any = null;
    try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}
    if (!token || !user || user.role !== 'super_admin') {
      router.push('/login');
    } else {
      setUserName(user.name || 'Super Administrator');
      setIsAuthorized(true);
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
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4A843] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin" userName={userName} userInitials={userName.slice(0, 2).toUpperCase()} navItems={navItems} onLogout={handleLogout}>
      {children}
    </DashboardLayout>
  );
}
