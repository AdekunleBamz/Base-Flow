'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks';
import { motion } from 'framer-motion';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({ text, size = 'md' }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => copy(text)}
      className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? (
        <Check className={`${sizeClass[size]} text-green-400`} />
      ) : (
        <Copy className={sizeClass[size]} />
      )}
    </motion.button>
  );
}

export default CopyButton;
