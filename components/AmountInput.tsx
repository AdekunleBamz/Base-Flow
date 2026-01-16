'use client';

import React from 'react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function AmountInput({ 
  value, 
  onChange, 
  max, 
  disabled = false,
  placeholder = '0.0'
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow only numbers and decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };
  
  const handleMaxClick = () => {
    if (max) onChange(max);
  };
  
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-600 focus:outline-none"
      />
      {max && (
        <button
          onClick={handleMaxClick}
          disabled={disabled}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white font-medium transition-colors"
        >
          MAX
        </button>
      )}
    </div>
  );
}

export default AmountInput;
