'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, AlertTriangle, Info } from 'lucide-react';

export interface SwapSettings {
  slippage: number; // in percentage (e.g., 0.5 = 0.5%)
  deadline: number; // in minutes
  autoRouter: boolean;
}

interface SettingsPanelProps {
  settings: SwapSettings;
  onSettingsChange: (settings: SwapSettings) => void;
}

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0];

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');

  const handleSlippagePreset = (value: number) => {
    setCustomSlippage('');
    onSettingsChange({ ...settings, slippage: value });
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSettingsChange({ ...settings, slippage: numValue });
    }
  };

  const handleDeadlineChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 60) {
      onSettingsChange({ ...settings, deadline: numValue });
    }
  };

  const isHighSlippage = settings.slippage > 5;
  const isLowSlippage = settings.slippage < 0.1;

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    Transaction Settings
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-6">
                  {/* Slippage Tolerance */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white font-medium">Slippage Tolerance</span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                          Your transaction will revert if the price changes unfavorably by more than this percentage.
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      {SLIPPAGE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => handleSlippagePreset(preset)}
                          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                            settings.slippage === preset && !customSlippage
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          value={customSlippage}
                          onChange={(e) => handleCustomSlippage(e.target.value)}
                          placeholder="Custom"
                          className={`w-full py-2 px-3 rounded-xl text-sm font-medium bg-slate-700/50 text-white placeholder-slate-400 outline-none border transition-all ${
                            customSlippage
                              ? 'border-blue-500'
                              : 'border-transparent'
                          }`}
                          min="0"
                          max="50"
                          step="0.1"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Slippage Warnings */}
                    <AnimatePresence>
                      {isHighSlippage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 p-2 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>High slippage increases frontrunning risk</span>
                        </motion.div>
                      )}
                      {isLowSlippage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 p-2 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>Transaction may fail due to low slippage</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Transaction Deadline */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white font-medium">Transaction Deadline</span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                          Your transaction will revert if it's pending for longer than this.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={settings.deadline}
                        onChange={(e) => handleDeadlineChange(e.target.value)}
                        className="w-20 py-2 px-3 rounded-xl text-sm font-medium bg-slate-700/50 text-white outline-none border border-transparent focus:border-blue-500 transition-all"
                        min="1"
                        max="60"
                      />
                      <span className="text-slate-400">minutes</span>
                    </div>
                  </div>

                  {/* Auto Router Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">Auto Router</span>
                        <div className="group relative">
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                            Automatically finds the best route for your swap
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          onSettingsChange({ ...settings, autoRouter: !settings.autoRouter })
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.autoRouter ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: settings.autoRouter ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Current: {settings.slippage}% / {settings.deadline}min</span>
                    <button
                      onClick={() => {
                        onSettingsChange({ slippage: 0.5, deadline: 20, autoRouter: true });
                        setCustomSlippage('');
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Reset to defaults
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
