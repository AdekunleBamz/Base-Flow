'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  success: 'bg-green-500/10 border-green-500/20 text-green-400',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
};

export function Alert({
  variant = 'info',
  title,
  description,
  icon: Icon,
  onClose,
  className,
  children,
}: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <div className="flex-1 space-y-1">
          {title && (
            <h3 className="font-semibold text-sm">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="text-sm opacity-90">
              {description}
            </p>
          )}
          
          {children}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close alert"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-sm mb-1">{children}</h3>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm opacity-90">{children}</p>;
}
