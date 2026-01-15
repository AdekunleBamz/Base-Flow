'use client';

import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface InfoBoxProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
  icon?: ReactNode;
}

const typeStyles = {
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  error: 'bg-red-500/10 border-red-500/30 text-red-300',
  success: 'bg-green-500/10 border-green-500/30 text-green-300',
};

export function InfoBox({ children, type = 'info', icon }: InfoBoxProps) {
  return (
    <div className={`p-4 rounded-lg border ${typeStyles[type]} flex gap-3`}>
      <div className="flex-shrink-0">
        {icon || <Info className="w-5 h-5" />}
      </div>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

export default InfoBox;
