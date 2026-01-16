'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showStrength?: boolean;
  className?: string;
}

function calculatePasswordStrength(password: string): {
  strength: number;
  label: string;
  color: string;
} {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const normalized = Math.min(strength / 6, 1);

  if (normalized < 0.3) return { strength: normalized, label: 'Weak', color: 'bg-red-500' };
  if (normalized < 0.6) return { strength: normalized, label: 'Fair', color: 'bg-yellow-500' };
  if (normalized < 0.8) return { strength: normalized, label: 'Good', color: 'bg-blue-500' };
  return { strength: normalized, label: 'Strong', color: 'bg-green-500' };
}

export function PasswordInput({
  value = '',
  onChange,
  placeholder = 'Enter password',
  disabled = false,
  showStrength = false,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = showStrength && value ? calculatePasswordStrength(value) : null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2 pr-10 bg-slate-900/50 border border-slate-700 rounded-lg',
            'text-white placeholder-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {passwordStrength && (
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-300', passwordStrength.color)}
              style={{ width: `${passwordStrength.strength * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Password strength: <span className="font-semibold">{passwordStrength.label}</span>
          </p>
        </div>
      )}
    </div>
  );
}
