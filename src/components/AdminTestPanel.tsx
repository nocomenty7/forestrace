'use client';

import React, { useState } from 'react';
import { Settings, X, Zap, RefreshCw, Flag, Sparkles } from 'lucide-react';
import { COUNTRY_NAMES, getCountryFlag } from '@/lib/country';

interface AdminTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: string;
  onSelectCountry: (country: string) => void;
  onAddWater: (amount: number) => void;
}

export function AdminTestPanel({
  isOpen,
  onClose,
  currentCountry,
  onSelectCountry,
  onAddWater,
}: AdminTestPanelProps) {
  if (!isOpen) return null;

  const countryList = Object.keys(COUNTRY_NAMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900/90 rounded-3xl p-6 text-slate-100 shadow-2xl border border-amber-400/40 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400 animate-spin" />
            <h3 className="font-bold text-base text-amber-300">
              🛠️ Admin Test Control Panel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Country Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Flag className="w-4 h-4 text-emerald-400" />
            Switch Active Country (국가 변경)
          </label>
          <select
            value={currentCountry}
            onChange={(e) => onSelectCountry(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {countryList.map((code) => (
              <option key={code} value={code}>
                {getCountryFlag(code)} {code} - {COUNTRY_NAMES[code]}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Fast Growth Cheats */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Fast-Forward Growth (나무 고속 성장 테스트)
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddWater(10)}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center justify-center space-x-1"
            >
              <span>+10 Water</span>
            </button>

            <button
              onClick={() => onAddWater(100)}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center justify-center space-x-1"
            >
              <span>+100 Water (Stage 2)</span>
            </button>

            <button
              onClick={() => onAddWater(400)}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-amber-500/30 flex items-center justify-center space-x-1"
            >
              <span>+400 Water (Stage 3)</span>
            </button>

            <button
              onClick={() => onAddWater(1000)}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-emerald-500/30 flex items-center justify-center space-x-1"
            >
              <span>+1,000 Water (Stage 4)</span>
            </button>
          </div>

          {/* Complete 1 Full Tree Cheat Button */}
          <button
            onClick={() => onAddWater(2500)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete 1 Tree & Send to Forest (🌲 +1 숲으로 보내기)</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors mt-2"
        >
          Close Test Panel
        </button>
      </div>
    </div>
  );
}
