"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Bell, Search, ChevronRight, Menu, X
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
  admin:   { gradient: "from-[#C4993C] to-[#D4A843]", badge: "bg-amber-100/10 text-amber-500" },
  teacher: { gradient: "from-[#A37C27] to-[#C4993C]", badge: "bg-amber-100/10 text-amber-500" },
  student: { gradient: "from-[#D4A843] to-[#E3C273]", badge: "bg-amber-100/10 text-amber-500" },
};

const roleLabels = { admin: "Administrator", teacher: "Teacher", student: "Student" };

export default function DashboardLayout({
  children, role, userName, userInitials, navItems, onLogout,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const colors = roleColors[role];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
          SK
        </div>
        <div>
          <div className="font-sora font-bold text-white text-sm">Skoolms</div>
          <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.badge} font-mono uppercase tracking-wide mt-0.5 inline-block`}>
            {roleLabels[role]}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto text-white/70 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-slate-400">{roleLabels[role]}</div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/10"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex-shrink-0 shadow-sm fixed inset-y-0 left-0 z-40">
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
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] z-50 lg:hidden shadow-xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#EBE8E2] flex items-center gap-4 px-4 md:px-6 sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden text-[#706B62] hover:text-[#23201B] p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-[#FAF8F5] border border-[#EBE8E2] rounded-xl px-3.5 py-2">
            <Search size={15} className="text-[#8C877D]" />
            <input
              placeholder="Search everywhere..."
              className="bg-transparent text-xs text-[#23201B] outline-none w-full placeholder:text-[#A8A298]"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-xl text-[#706B62] hover:bg-[#FAF8F5] transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C4993C]" />
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
