'use client';

import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface Tab {
  tab: string;
  label: string;
  icon?: string;
}

interface DashboardTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardTabs({ tabs, activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {tabs.map((item) => (
        <Button
          key={item.tab}
          variant={activeTab === item.tab ? 'default' : 'outline'}
          onClick={() => onTabChange(item.tab)}
          className={`whitespace-nowrap flex items-center gap-2 ${
            activeTab === item.tab ? 'bg-primary text-white' : ''
          }`}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </Button>
      ))}
    </div>
  );
}
