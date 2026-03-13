'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface InfoBannerProps {
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning';
  closeable?: boolean;
}

export function InfoBanner({ 
  title, 
  description, 
  type = 'info',
  closeable = true 
}: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  const textColors = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
  };

  return (
    <div className={`border rounded-lg p-4 mb-6 ${bgColors[type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`font-semibold ${textColors[type]}`}>{title}</h3>
          <p className={`text-sm mt-1 ${textColors[type]} opacity-90`}>{description}</p>
        </div>
        {closeable && (
          <button
            onClick={() => setIsVisible(false)}
            className={`ml-2 p-1 hover:bg-white/50 rounded transition-colors ${textColors[type]}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
