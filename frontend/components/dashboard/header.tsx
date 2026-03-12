'use client';

import { useAuth } from '@/lib/auth-context';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title = 'Dashboard', onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <Menu size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground hidden sm:inline tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Search */}
        <div className="hidden md:flex items-center max-w-xs w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search..."
              className="pl-9 bg-muted border-0 rounded-full text-sm focus-visible:ring-2 focus-visible:ring-primary/40 h-9"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-muted rounded-xl transition-colors">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full ring-2 ring-primary/30 ring-offset-1"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
