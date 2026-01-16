'use client';

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

interface AlertProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

const alertConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
  },
};

export function Alert({ type, title, message, onClose }: AlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;
  
  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1">
          {title && <p className={`font-medium ${config.iconColor} mb-1`}>{title}</p>}
          <p className="text-sm text-slate-300">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
