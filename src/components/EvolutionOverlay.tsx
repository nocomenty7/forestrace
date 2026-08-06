'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trees, ShieldCheck } from 'lucide-react';

interface EvolutionOverlayProps {
  stageTitle: string;
  isForestCompletion: boolean;
  onDismiss: () => void;
}

export function EvolutionOverlay({
  stageTitle,
  isForestCompletion,
  onDismiss,
}: EvolutionOverlayProps) {
  useEffect(() => {
    // Epic confetti particle celebration
    try {
      confetti({
        particleCount: isForestCompletion ? 180 : 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#76ff03', '#00e5ff', '#ff4081', '#ffffff'],
      });
    } catch (e) {
      console.warn('Evolution confetti error:', e);
    }
  }, [isForestCompletion]);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-lg animate-fadeIn cursor-pointer"
    >
      {/* Sunburst Flare Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.35)_0%,rgba(0,0,0,0)_70%)] animate-pulse" />

      {/* Main Evolution Announcement Banner */}
      <div className="relative flex flex-col items-center justify-center text-center space-y-4 p-8 rounded-3xl natural-glass-dark border-2 border-amber-300 shadow-[0_0_80px_rgba(255,215,0,0.6)] max-w-sm sm:max-w-md animate-scaleUp">
        <div className="p-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-xl text-slate-950 animate-bounce">
          {isForestCompletion ? (
            <Trees className="w-12 h-12" />
          ) : (
            <Sparkles className="w-12 h-12" />
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
            {isForestCompletion ? '🎉 Miracle Milestone!' : '✨ Tree Evolved!'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
            {stageTitle}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xs leading-relaxed">
          {isForestCompletion
            ? 'A giant tree has fully grown and was delivered to your nation’s Global Forest! 🌲'
            : 'Your collective care has powered the tree to its next majestic form! 🌱'}
        </p>

        <div className="pt-2">
          <span className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg hover:scale-105 transition-transform">
            Tap anywhere to continue
          </span>
        </div>
      </div>
    </div>
  );
}
