'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionStatusProps {
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  message?: string;
}

export function TransactionStatus({ status, hash, message }: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      title: 'Transaction Pending',
      defaultMessage: 'Your transaction is being processed...',
    },
    confirmed: {
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      title: 'Transaction Confirmed',
      defaultMessage: 'Your swap was successful!',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      title: 'Transaction Failed',
      defaultMessage: 'Your transaction was reverted',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className={`font-medium ${config.color}`}>{config.title}</p>
          <p className="text-sm text-slate-300 mt-1">
            {message || config.defaultMessage}
          </p>
          {hash && (
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
            >
              View on BaseScan
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TransactionStatus;
