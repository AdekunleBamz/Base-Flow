'use client';

import { cn } from '@/lib/utils';

interface RadioProps {
  value: string;
  checked?: boolean;
  onCheckedChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  name?: string;
  id?: string;
  className?: string;
}

export function Radio({
  value,
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  name,
  id,
  className,
}: RadioProps) {
  const handleChange = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        id={id}
        onClick={handleChange}
        disabled={disabled}
        className={cn(
          'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all',
          checked
            ? 'bg-blue-600 border-blue-600'
            : 'border-slate-600 hover:border-slate-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {checked && (
          <div className="h-2 w-2 rounded-full bg-white" />
        )}
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

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  disabled = false,
  name,
  options,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          checked={value === option.value}
          onCheckedChange={onValueChange}
          disabled={disabled || option.disabled}
          label={option.label}
          name={name}
          id={`${name}-${option.value}`}
        />
      ))}
    </div>
  );
}
