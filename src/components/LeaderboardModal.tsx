'use client';

import React, { useState } from 'react';
import { Trophy, X, Search, Trees } from 'lucide-react';
import { getCountryFlag, getCountryName } from '@/lib/country';

export interface LeaderboardItem {
  country: string;
  score: number;
  completedTrees: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCountries: LeaderboardItem[];
  userCountry: string;
  globalScore: number;
}

export function LeaderboardModal({
  isOpen,
  onClose,
  allCountries,
  userCountry,
  globalScore,
}: LeaderboardModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCountries = allCountries.filter((item) => {
    const name = getCountryName(item.country).toLowerCase();
    const code = item.country.toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || code.includes(term);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg natural-glass-dark rounded-3xl p-6 text-slate-100 shadow-2xl border border-emerald-400/30 flex flex-col max-h-[85vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg text-emerald-200">
              National Leaderboard (전체 국가 랭킹)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-900/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Total Metric */}
        <div className="bg-emerald-950/60 rounded-xl p-3 flex items-center justify-between border border-emerald-500/20 flex-shrink-0">
          <span className="text-xs text-emerald-300 font-medium">Global Forest Water</span>
          <span className="font-mono font-bold text-amber-300 text-base">
            {globalScore.toLocaleString()} drops
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* All Countries Scrollable List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[50vh] custom-scrollbar">
          {filteredCountries.length === 0 ? (
            <div className="text-center py-8 text-xs text-emerald-300/70 italic">
              No matching countries found.
            </div>
          ) : (
            filteredCountries.map((item, idx) => {
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
                  {/* Rank & Flag & Country Name */}
                  <div className="flex items-center space-x-3">
                    <span className="w-7 text-center font-bold text-xs sm:text-sm text-amber-300">
                      {getRankBadge(idx)}
                    </span>
                    <span className="text-xl sm:text-2xl filter drop-shadow">
                      {getCountryFlag(item.country)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                      {getCountryName(item.country)}
                    </span>
                  </div>

                  {/* Completed Trees Count */}
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-amber-300 text-xs sm:text-sm">
                    <Trees className="w-4 h-4 text-emerald-400" />
                    <span>{item.completedTrees.toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg active:scale-98 flex-shrink-0"
        >
          Close Leaderboard
        </button>
      </div>
    </div>
  );
}
