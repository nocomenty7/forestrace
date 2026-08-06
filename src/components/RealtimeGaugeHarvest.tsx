'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Droplet, Sparkles, Loader2 } from 'lucide-react';
import { UseRealtimeEnergyReturn } from '@/hooks/useRealtimeEnergy';

interface RealtimeGaugeHarvestProps {
  realtimeEnergy: UseRealtimeEnergyReturn;
  onHarvestSuccess: (amount: number) => void;
  userCountry?: string;
}

export function RealtimeGaugeHarvest({
  realtimeEnergy,
  onHarvestSuccess,
  userCountry,
}: RealtimeGaugeHarvestProps) {
  const { gaugePercent, isWaterReady, triggerHarvest } = realtimeEnergy;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaterClick = async () => {
    if (!isWaterReady || isSubmitting) return;

    // Reset gauge to 0 and restart 5s timer
    triggerHarvest();
    setIsSubmitting(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.82 },
        colors: ['#a8e6cf', '#56ab2f', '#ffeb3b', '#00e5ff', '#ffffff'],
      });
    } catch (e) {
      console.warn('Water confetti error:', e);
    }

    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1,
          country: userCountry || 'UNKNOWN',
        }),
      });

      if (res.ok) {
        onHarvestSuccess(1);
      }
    } catch (err) {
      console.error('Water API error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 z-20 w-full max-w-xs px-4">
      {/* 5-Second Realtime Gauge Progress Bar */}
      <div className="w-full natural-glass rounded-full p-1.5 shadow-md border border-white/80 relative">
        <div className="w-full bg-emerald-950/20 rounded-full h-3 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              isWaterReady
                ? 'bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 animate-pulse shadow-[0_0_12px_rgba(255,215,0,0.8)]'
                : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300'
            }`}
            style={{ width: `${gaugePercent}%` }}
          />
        </div>
      </div>

      {/* Water Button (Active ONLY at 100% full, resets timer ON CLICK) */}
      <button
        onClick={handleWaterClick}
        disabled={!isWaterReady || isSubmitting}
        className={`relative group px-7 py-3.5 rounded-full font-bold text-base flex items-center justify-center space-x-2 transition-all duration-300 shadow-xl ${
          isWaterReady
            ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 text-slate-950 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-300/80 shadow-[0_0_30px_rgba(86,171,47,0.7)] animate-pulse'
            : 'bg-emerald-900/30 text-emerald-700/50 border border-emerald-800/20 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
        ) : (
          <>
            <Droplet
              className={`w-6 h-6 ${
                isWaterReady
                  ? 'fill-cyan-900 text-cyan-900 animate-bounce'
                  : 'text-emerald-700/40'
              }`}
            />
            <span>💧 Water Tree</span>
            {isWaterReady && <Sparkles className="w-5 h-5 text-amber-800" />}
          </>
        )}
      </button>
    </div>
  );
}
