'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChartProps {
  fromToken: string;
  toToken: string;
}

interface PricePoint {
  timestamp: number;
  price: number;
}

export function PriceChart({ fromToken, toToken }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    // Generate mock price data (in production, fetch from API)
    const generateMockData = () => {
      const now = Date.now();
      const data: PricePoint[] = [];
      let basePrice = 3200; // Mock base price

      for (let i = 23; i >= 0; i--) {
        const timestamp = now - i * 60 * 60 * 1000; // Last 24 hours
        const volatility = (Math.random() - 0.5) * 100;
        const price = basePrice + volatility;
        data.push({ timestamp, price });
        basePrice = price;
      }

      return data;
    };

    const data = generateMockData();
    setPriceData(data);
    
    if (data.length > 0) {
      const latest = data[data.length - 1].price;
      const first = data[0].price;
      setCurrentPrice(latest);
      setPriceChange(((latest - first) / first) * 100);
    }
  }, [fromToken, toToken]);

  const isPositive = priceChange >= 0;
  const maxPrice = Math.max(...priceData.map(d => d.price));
  const minPrice = Math.min(...priceData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-slate-400">
            {fromToken}/{toToken}
          </p>
          <p className="text-2xl font-bold text-white">
            ${currentPrice.toFixed(2)}
          </p>
        </div>
        
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Simple SVG chart */}
      <svg className="w-full h-24" viewBox="0 0 100 30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <path
          d={`
            M 0,30
            ${priceData.map((point, i) => {
              const x = (i / (priceData.length - 1)) * 100;
              const y = 30 - ((point.price - minPrice) / priceRange) * 30;
              return `L ${x},${y}`;
            }).join(' ')}
            L 100,30
            Z
          `}
          fill="url(#priceGradient)"
        />

        {/* Price line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          d={`
            M ${priceData.map((point, i) => {
              const x = (i / (priceData.length - 1)) * 100;
              const y = 30 - ((point.price - minPrice) / priceRange) * 30;
              return `${x},${y}`;
            }).join(' L ')}
          `}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      <p className="text-xs text-slate-500 mt-2">Last 24 hours</p>
    </div>
  );
}

export default PriceChart;
