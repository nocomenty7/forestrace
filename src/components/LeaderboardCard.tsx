'use client';

import React from 'react';
import { Trophy, Globe, Flag, RefreshCw } from 'lucide-react';
import { getCountryFlag, getCountryName } from '@/lib/country';

export interface LeaderboardItem {
  country: string;
  score: number;
}

interface LeaderboardCardProps {
  globalScore: number;
  userCountry: string;
  userCountryScore: number;
  topCountries: LeaderboardItem[];
  isValidating?: boolean;
}

export function LeaderboardCard({
  globalScore,
  userCountry,
  userCountryScore,
  topCountries,
  isValidating,
}: LeaderboardCardProps) {
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
    <div className="glass-panel rounded-2xl p-4 sm:p-5 w-full max-w-md border border-yellow-500/20 shadow-2xl flex flex-col space-y-4 text-slate-100 z-10">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-serif font-semibold text-base sm:text-lg text-amber-200 tracking-wide">
            Global Leaderboard
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-indigo-200/60">
          {isValidating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />}
          <span>10s SWR Sync</span>
        </div>
      </div>

      {/* Global Total Metric Banner */}
      <div className="bg-slate-900/60 rounded-xl p-3 flex items-center justify-between border border-indigo-500/20">
        <div className="flex items-center space-x-2.5">
          <Globe className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Global Forest Total
            </div>
            <div className="text-lg font-mono font-bold text-yellow-300">
              {globalScore.toLocaleString()} <span className="text-xs text-amber-400/80 font-normal">pts</span>
            </div>
          </div>
        </div>

        {/* User Country Badge */}
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center justify-end gap-1">
            <Flag className="w-3 h-3 text-emerald-400" /> My Nation
          </div>
          <div className="text-xs font-semibold text-slate-200 flex items-center justify-end gap-1 mt-0.5">
            <span>{getCountryFlag(userCountry)}</span>
            <span>{userCountry}</span>
          </div>
        </div>
      </div>

      {/* Top 5 Country Rankings */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-slate-400 px-1 font-semibold flex justify-between">
          <span>Rank & Country</span>
          <span>Score</span>
        </div>

        {topCountries.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 italic">
            Waiting for first harvests worldwide...
          </div>
        ) : (
          topCountries.slice(0, 5).map((item, idx) => {
            const isUserNation = item.country.toUpperCase() === userCountry.toUpperCase();
            return (
              <div
                key={item.country}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm transition-all duration-300 ${
                  isUserNation
                    ? 'glass-panel-gold border-yellow-400/50 font-bold text-yellow-200'
                    : 'bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/40 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 text-center font-mono font-bold text-sm">
                    {getRankBadge(idx)}
                  </span>
                  <span className="text-lg">{getCountryFlag(item.country)}</span>
                  <span className="truncate max-w-[130px] sm:max-w-[160px]">
                    {getCountryName(item.country)}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {item.score.toLocaleString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
