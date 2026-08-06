'use client';

import React from 'react';

interface TreeDisplayProps {
  score: number;
  countryName?: string;
  countryFlag?: string;
}

export function TreeDisplay({ score, countryName, countryFlag }: TreeDisplayProps) {
  // Determine tree stage dynamically based on score tier
  let treeStage = 1;
  let stageTitle = 'Sprout Stage';

  if (score >= 100000) {
    treeStage = 4;
    stageTitle = 'Ancient World Tree';
  } else if (score >= 10000) {
    treeStage = 3;
    stageTitle = 'Lush Sacred Tree';
  } else if (score >= 1000) {
    treeStage = 2;
    stageTitle = 'Growing Sapling';
  }

  const imageSrc = `/tree${treeStage}.png`;

  return (
    <div className="relative flex flex-col items-center justify-center my-4 z-10">
      {/* Country & Tree Tier Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs md:text-sm text-yellow-100/90 mb-3 shadow-lg border border-yellow-500/20">
        <span className="text-base">{countryFlag || '🌐'}</span>
        <span className="font-semibold text-yellow-200">{countryName || 'Global Forest'}</span>
        <span className="text-xs text-indigo-200/70 font-mono">({stageTitle})</span>
      </div>

      {/* Floating & Breathing Tree Container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center animate-tree-floating transition-all duration-700">
        <img
          src={imageSrc}
          alt={`Global Forest Tree Stage ${treeStage}`}
          className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_0_25px_rgba(255,245,120,0.45)]"
        />
      </div>
    </div>
  );
}
