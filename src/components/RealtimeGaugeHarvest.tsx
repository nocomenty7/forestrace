'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Droplet, Sparkles, Loader2 } from 'lucide-react';
import { UseRealtimeEnergyReturn } from '@/hooks/useRealtimeEnergy';

interface RealtimeGaugeHarvestProps {
  realtimeEnergy: UseRealtimeEnergyReturn;
  onHarvestSuccess?: () => void;
  userCountry?: string;
}

export function RealtimeGaugeHarvest({
  realtimeEnergy,
  onHarvestSuccess,
  userCountry,
}: RealtimeGaugeHarvestProps) {
  const { energy, gaugePercent, isHarvestReady, consumeEnergy } = realtimeEnergy;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHarvestClick = async () => {
    if (!isHarvestReady || isSubmitting) return;

    const amount = consumeEnergy();
    setIsSubmitting(true);

    // Particle burst celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#a8e6cf', '#56ab2f', '#ffeb3b', '#00e5ff', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti burst error:', e);
    }

    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          country: userCountry || 'UNKNOWN',
        }),
      });

      if (res.ok && onHarvestSuccess) {
        onHarvestSuccess();
      }
    } catch (err) {
      console.error('Harvest API error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 z-20 w-full max-w-xs px-4">
      {/* 5-Second Filling Real-time Gauge Bar */}
      <div className="w-full natural-glass rounded-full p-1.5 shadow-md border border-white/80 relative">
        <div className="w-full bg-emerald-950/20 rounded-full h-3 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-75 shadow-sm"
            style={{ width: `${gaugePercent}%` }}
          />
        </div>
      </div>

      {/* Harvest Water Drop Button */}
      <button
        onClick={handleHarvestClick}
        disabled={!isHarvestReady || isSubmitting}
        className={`relative group px-6 py-3.5 rounded-full font-bold text-base flex items-center justify-center space-x-2 transition-all duration-300 shadow-xl ${
          isHarvestReady
            ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 text-slate-950 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-300/60 shadow-[0_0_25px_rgba(86,171,47,0.6)] animate-pulse'
            : 'bg-emerald-900/30 text-emerald-700/60 border border-emerald-800/20 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
        ) : (
          <>
            <Droplet
              className={`w-6 h-6 ${
                isHarvestReady
                  ? 'fill-cyan-900 text-cyan-900 animate-bounce'
                  : 'text-emerald-700/50'
              }`}
            />
            {energy > 0 && <span className="font-mono text-lg font-extrabold">+{energy}</span>}
            {isHarvestReady && <Sparkles className="w-5 h-5 text-amber-800" />}
          </>
        )}
      </button>
    </div>
  );
}
