'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftAddon, rightAddon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftAddon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftAddon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-4 py-3
              ${leftAddon ? 'pl-10' : ''}
              ${rightAddon ? 'pr-10' : ''}
              bg-slate-800/50 
              border ${error ? 'border-red-500' : 'border-slate-700'}
              rounded-lg
              text-white placeholder-slate-500
              focus:outline-none focus:ring-2 
              ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
              transition-all duration-200
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${className}
            `}
            {...props}
          />
          
          {rightAddon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightAddon}
            </div>
          )}
        </div>
        
        {helperText && !error && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
