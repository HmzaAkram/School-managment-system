'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
  role: 'admin' | 'teacher' | 'student';
  onLogout: () => void;
}

export function DashboardHeader({ title, role, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                BS
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                Skoolms
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <span className="text-sm font-medium text-foreground/70">{title}</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="text-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
