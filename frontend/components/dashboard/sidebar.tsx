'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  BookOpen,
  Clock,
  FileText,
  DollarSign,
  Library,
  Box,
  PieChart,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = {
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Students', href: '/dashboard/students', icon: Users },
    { label: 'Teachers', href: '/dashboard/teachers', icon: Users },
    { label: 'Classes', href: '/dashboard/classes', icon: BookOpen },
    { label: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { label: 'Exams', href: '/dashboard/exams', icon: FileText },
    { label: 'Fees', href: '/dashboard/fees', icon: DollarSign },
    { label: 'Library', href: '/dashboard/library', icon: Library },
    { label: 'Inventory', href: '/dashboard/inventory', icon: Box },
    { label: 'Accounts', href: '/dashboard/accounts', icon: PieChart },
    { label: 'Notices', href: '/dashboard/notices', icon: Bell },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  teacher: [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'My Classes', href: '/dashboard/classes', icon: BookOpen },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { label: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { label: 'Marks', href: '/dashboard/marks', icon: BarChart3 },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { label: 'Profile', href: '/dashboard/settings', icon: Settings },
  ],
  student: [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { label: 'Results', href: '/dashboard/results', icon: FileText },
    { label: 'Fees', href: '/dashboard/fees', icon: DollarSign },
    { label: 'Assignments', href: '/dashboard/assignments', icon: BookOpen },
    { label: 'Notices', href: '/dashboard/notices', icon: Bell },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { label: 'Profile', href: '/dashboard/settings', icon: Settings },
  ],
  parent: [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Child Progress', href: '/dashboard/progress', icon: FileText },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { label: 'Fees', href: '/dashboard/fees', icon: DollarSign },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { label: 'Profile', href: '/dashboard/settings', icon: Settings },
  ],
};

interface SidebarProps {
  onMobileClose?: () => void;
}

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const role = user?.role as UserRole;
  const items = navItems[role] || [];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ABC</span>
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">ABC School</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            'text-sidebar-foreground hover:bg-sidebar-accent'
          )}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
