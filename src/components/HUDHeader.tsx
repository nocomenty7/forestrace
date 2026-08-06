'use client';

import React from 'react';
import { Trophy, Settings } from 'lucide-react';
import { getCountryFlag } from '@/lib/country';

interface HUDHeaderProps {
  userCountry: string;
  completedTrees: number;
  onOpenLeaderboard: () => void;
  onOpenAdminPanel: () => void;
}

export function HUDHeader({
  userCountry,
  completedTrees,
  onOpenLeaderboard,
  onOpenAdminPanel,
}: HUDHeaderProps) {
  return (
    <header className="absolute top-4 inset-x-0 px-4 sm:px-8 flex items-center justify-between z-20 pointer-events-none">
      {/* Top Left: Rectangular Flag + Completed Trees Count Metric (Zero Text Clutter) */}
      <div className="pointer-events-auto flex items-center space-x-3 natural-glass px-3.5 py-2 rounded-2xl shadow-lg border border-white/60">
        {/* Rectangular Flag Display */}
        <div className="flex items-center justify-center text-2xl sm:text-3xl filter drop-shadow">
          {getCountryFlag(userCountry)}
        </div>

        {/* Trees Metric: 🌲 Tree Icon + Completed Count */}
        <div className="flex items-center space-x-1.5 text-emerald-950 font-bold font-mono text-base sm:text-lg">
          <span className="text-lg sm:text-xl">🌲</span>
          <span>{completedTrees.toLocaleString()}</span>
        </div>
      </div>

      {/* Top Right: Buttons for Leaderboard (🏆) and Admin Test Panel (⚙️) */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {/* Admin Test Panel Trigger (⚙️) */}
        <button
          onClick={onOpenAdminPanel}
          className="natural-glass hover:bg-slate-200/90 active:scale-95 transition-all duration-200 w-11 h-11 rounded-2xl flex items-center justify-center text-slate-700 shadow-lg border border-slate-300/60 cursor-pointer group"
          title="Admin Test Panel"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
        </button>

        {/* Leaderboard Trigger (🏆) */}
        <button
          onClick={onOpenLeaderboard}
          className="natural-glass hover:bg-amber-100/90 active:scale-95 transition-all duration-200 w-11 h-11 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg border border-amber-300/60 cursor-pointer group"
          title="Leaderboard"
        >
          <Trophy className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </header>
  );
}
