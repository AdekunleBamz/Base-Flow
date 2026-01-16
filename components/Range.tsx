'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RangeProps {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Range({
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = false,
  formatValue,
  className,
}: RangeProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onValueChange?.(newValue);
  };

  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
            disabled && 'opacity-50 cursor-not-allowed',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:bg-blue-500',
            '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all',
            '[&::-moz-range-thumb]:hover:bg-blue-500'
          )}
          style={{
            background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${percentage}%, rgb(30, 41, 59) ${percentage}%, rgb(30, 41, 59) 100%)`,
          }}
        />
      </div>
      
      {showValue && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>{formatValue ? formatValue(min) : min}</span>
          <span className="font-semibold text-blue-400">
            {formatValue ? formatValue(localValue) : localValue}
          </span>
          <span>{formatValue ? formatValue(max) : max}</span>
        </div>
      )}
    </div>
  );
}
