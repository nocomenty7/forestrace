'use client';

import React from 'react';
import { Trophy, X } from 'lucide-react';
import { getCountryFlag, getCountryName } from '@/lib/country';

export interface LeaderboardItem {
  country: string;
  score: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  topCountries: LeaderboardItem[];
  userCountry: string;
  globalScore: number;
}

export function LeaderboardModal({
  isOpen,
  onClose,
  topCountries,
  userCountry,
  globalScore,
}: LeaderboardModalProps) {
  if (!isOpen) return null;

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-md natural-glass-dark rounded-3xl p-6 text-slate-100 shadow-2xl border border-emerald-400/30 flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg text-emerald-200">
              Leaderboard (TOP 5)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-900/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Metric */}
        <div className="bg-emerald-950/60 rounded-xl p-3 flex items-center justify-between border border-emerald-500/20">
          <span className="text-xs text-emerald-300 font-medium">Global Score</span>
          <span className="font-mono font-bold text-amber-300 text-base">
            {globalScore.toLocaleString()} pts
          </span>
        </div>

        {/* Top 5 Country List */}
        <div className="space-y-2.5 my-2">
          {topCountries.length === 0 ? (
            <div className="text-center py-6 text-xs text-emerald-300/70 italic">
              Loading rankings...
            </div>
          ) : (
            topCountries.slice(0, 5).map((item, idx) => {
              const isUserCountry = item.country.toUpperCase() === userCountry.toUpperCase();
              return (
                <div
                  key={item.country}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                    isUserCountry
                      ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-emerald-950/40 border border-emerald-900/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-center font-bold text-sm">
                      {getRankBadge(idx)}
                    </span>
                    <span className="text-xl">{getCountryFlag(item.country)}</span>
                    <span className="text-sm font-medium">
                      {getCountryName(item.country)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {item.score.toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg active:scale-98"
        >
          OK
        </button>
      </div>
    </div>
  );
}
