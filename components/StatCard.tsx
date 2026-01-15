'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  loading?: boolean;
}

export function StatCard({ label, value, icon, change, loading = false }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-400">{label}</p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      
      {loading ? (
        <div className="h-8 bg-slate-700 animate-pulse rounded" />
      ) : (
        <>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}

export default StatCard;
