'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className = '' }: DividerProps) {
  if (text) {
    return (
      <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-sm text-slate-400">{text}</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>
    );
  }

  return <div className={`h-px bg-slate-700 my-6 ${className}`} />;
}

export default Divider;
