"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CheckSquare, CreditCard,
  BarChart2, MessageSquare, Briefcase, BookOpen,
  Calendar, Menu, X, LogOut, Bell, Search, ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "teacher" | "student";
  userName: string;
  userInitials: string;
  navItems: NavItem[];
  onLogout: () => void;
}

const roleColors = {
  admin:   { gradient: "from-[#3B4FE8] to-[#7C3AED]", badge: "bg-blue-100 text-blue-700" },
  teacher: { gradient: "from-[#06B6D4] to-[#6366F1]", badge: "bg-cyan-100 text-cyan-700" },
  student: { gradient: "from-[#7C3AED] to-[#EC4899]", badge: "bg-purple-100 text-purple-700" },
};

const roleLabels = { admin: "Administrator", teacher: "Teacher", student: "Student" };

export default function DashboardLayout({
  children, role, userName, userInitials, navItems, onLogout,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const colors = roleColors[role];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
          BS
        </div>
        <div>
          <div className="font-sora font-bold text-slate-800 text-sm">BrightScope</div>
          <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.badge} font-mono uppercase tracking-wide`}>
            {roleLabels[role]}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}>
                {item.icon}
              </span>
              {item.label}
              {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{userName}</div>
            <div className="text-xs text-slate-500">{roleLabels[role]}</div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F9FE]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 flex-shrink-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 lg:hidden shadow-xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 md:px-6 sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-900 p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search size={15} className="text-slate-400" />
            <input
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
              {userInitials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
