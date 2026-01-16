'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  onOpenChange,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full p-3 text-left bg-slate-900/50 hover:bg-slate-900 rounded-lg transition-colors"
        aria-expanded={isOpen}
      >
        <span>{trigger}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform text-slate-400',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      
      {isOpen && (
        <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}
