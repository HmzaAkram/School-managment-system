'use client';

import { useAuth } from '@/lib/auth-context';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title = 'Dashboard', onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-muted rounded-lg"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-bold text-foreground hidden sm:inline">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full ring-2 ring-primary"
          />
        </div>
      </div>
    </header>
  );
}
