'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { getCountryFlag } from '@/lib/country';

interface HUDHeaderProps {
  userCountry: string;
  userCountryScore: number;
  onOpenLeaderboard: () => void;
}

export function HUDHeader({
  userCountry,
  userCountryScore,
  onOpenLeaderboard,
}: HUDHeaderProps) {
  // Convert score into trees count
  const treeCount = Math.floor(userCountryScore / 10) || 0;

  return (
    <header className="absolute top-4 inset-x-0 px-4 sm:px-8 flex items-center justify-between z-20 pointer-events-none">
      {/* Top Left: Nation Flag + Tree Count Metrics (Zero Text Clutter) */}
      <div className="pointer-events-auto flex items-center space-x-2.5 natural-glass px-3.5 py-2 rounded-full shadow-lg border border-white/60">
        {/* Circular Flag Icon */}
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xl shadow-inner overflow-hidden border border-emerald-300">
          {getCountryFlag(userCountry)}
        </div>

        {/* Trees Metric: 🌲 Tree Icon + Clean Numbers */}
        <div className="flex items-center space-x-1.5 text-emerald-950 font-bold font-mono text-sm sm:text-base">
          <span className="text-base sm:text-lg">🌲</span>
          <span>{treeCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Top Right: 🏆 Trophy Leaderboard Button */}
      <button
        onClick={onOpenLeaderboard}
        className="pointer-events-auto natural-glass hover:bg-amber-100/90 active:scale-95 transition-all duration-200 w-11 h-11 rounded-full flex items-center justify-center text-amber-600 shadow-lg border border-amber-300/60 cursor-pointer group"
        title="Leaderboard"
      >
        <Trophy className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </header>
  );
}
