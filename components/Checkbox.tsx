'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  id,
  className,
}: CheckboxProps) {
  const handleChange = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        id={id}
        onClick={handleChange}
        disabled={disabled}
        className={cn(
          'h-5 w-5 rounded border-2 flex items-center justify-center transition-all',
          checked
            ? 'bg-blue-600 border-blue-600'
            : 'border-slate-600 hover:border-slate-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" />}
      </button>
      
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm text-slate-300 cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={!disabled ? handleChange : undefined}
        >
          {label}
        </label>
      )}
    </div>
  );
}
