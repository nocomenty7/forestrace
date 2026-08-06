'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Droplet, Sparkles, PauseCircle, PlayCircle, Loader2 } from 'lucide-react';
import { UseIdleEnergyReturn } from '@/hooks/useIdleEnergy';

interface HarvestButtonProps {
  idleEnergy: UseIdleEnergyReturn;
  onHarvestSuccess?: () => void;
  countryCode?: string;
}

export function HarvestButton({
  idleEnergy,
  onHarvestSuccess,
  countryCode,
}: HarvestButtonProps) {
  const { energy, maxEnergy, isPaused, progressPercent, formattedTime, consumeEnergy } =
    idleEnergy;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaterClick = async () => {
    if (energy <= 0 || isSubmitting) return;

    // Consume local energy atomically
    const amountToWater = consumeEnergy();
    if (amountToWater <= 0) return;

    setIsSubmitting(true);

    // Trigger celebration confetti particles on click
    try {
      confetti({
        particleCount: Math.min(100, amountToWater * 3 + 20),
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ffd700', '#ffeb3b', '#76ff03', '#00e5ff', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToWater,
          country: countryCode || 'UNKNOWN',
        }),
      });

      if (res.ok && onHarvestSuccess) {
        onHarvestSuccess();
      }
    } catch (err) {
      console.error('Harvest request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFull = energy >= maxEnergy;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-2 z-10 w-full max-w-md px-4">
      {/* Energy Gauge Card */}
      <div className="w-full glass-panel rounded-2xl p-4 flex flex-col space-y-3 relative overflow-hidden border border-yellow-500/20 shadow-2xl">
        {/* Top Header info */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Droplet className={`w-4 h-4 ${energy > 0 ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-200">Watering Can Gauge</span>
          </div>
          <div className="flex items-center space-x-2">
            {isPaused ? (
              <span className="flex items-center space-x-1 text-amber-300/80 text-xs bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                <PauseCircle className="w-3 h-3" />
                <span>Paused (Background)</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-emerald-300 text-xs bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <PlayCircle className="w-3 h-3 animate-pulse" />
                <span>Collecting (+1 / 10s)</span>
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/80 rounded-full h-4 overflow-hidden p-0.5 border border-slate-700/50 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
              isFull
                ? 'from-amber-400 via-yellow-300 to-amber-200 animate-pulse'
                : 'from-cyan-500 via-blue-500 to-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Gauge Numerical Readout */}
        <div className="flex items-center justify-between text-xs text-indigo-200/70 font-mono">
          <span>Accumulated: <strong className="text-yellow-200 text-sm">{energy}</strong> / {maxEnergy}</span>
          <span>Time: <strong className="text-slate-200">{formattedTime}</strong></span>
        </div>
      </div>

      {/* Main Harvest Action Button */}
      <button
        onClick={handleWaterClick}
        disabled={energy <= 0 || isSubmitting}
        className={`relative group w-full py-4 px-6 rounded-2xl font-semibold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl ${
          energy > 0
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_30px_rgba(255,215,0,0.4)] border border-yellow-200'
            : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
        ) : (
          <>
            <Droplet className={`w-6 h-6 ${energy > 0 ? 'fill-slate-950 text-slate-950 animate-bounce' : 'text-slate-500'}`} />
            <span>Water the Tree (수확하기)</span>
            {energy > 0 && <Sparkles className="w-5 h-5 text-amber-900" />}
          </>
        )}
      </button>
    </div>
  );
}
