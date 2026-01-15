'use client';

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

const alignClasses = {
  left: 'left-0',
  right: 'right-0',
  center: 'left-1/2 -translate-x-1/2',
};

export function Dropdown({ trigger, children, align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute ${alignClasses[align]} top-full mt-2 z-50
              min-w-[200px] bg-slate-900 border border-slate-700
              rounded-lg shadow-xl py-2
            `}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ children, onClick, icon, disabled = false }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left flex items-center gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer'}
        text-white transition-colors
      `}
    >
      {icon && <span className="flex-shrink-0 text-slate-400">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-700" />;
}

export default Dropdown;
