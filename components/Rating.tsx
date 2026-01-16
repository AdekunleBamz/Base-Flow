'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  allowHalf?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  allowHalf = false,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number, half: boolean) => {
    if (readOnly) return;
    const newValue = half && allowHalf ? index + 0.5 : index + 1;
    onChange?.(newValue);
  };

  const handleMouseMove = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly || !allowHalf) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    setHoverValue(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={cn('flex gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }).map((_, index) => {
        const isFilled = index < Math.floor(displayValue);
        const isHalfFilled = index === Math.floor(displayValue) && displayValue % 1 !== 0;

        return (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const isHalf = e.clientX - rect.left < rect.width / 2;
              handleClick(index, isHalf);
            }}
            onMouseMove={(e) => handleMouseMove(index, e)}
            disabled={readOnly}
            className={cn(
              'relative transition-colors',
              !readOnly && 'cursor-pointer hover:scale-110',
              readOnly && 'cursor-default'
            )}
            aria-label={`Rate ${index + 1} star${index > 0 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-all',
                isFilled || isHalfFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-600'
              )}
            />
            {isHalfFilled && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star
                  className={cn(
                    sizeClasses[size],
                    'fill-yellow-400 text-yellow-400'
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
