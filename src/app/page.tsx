'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRealtimeEnergy } from '@/hooks/useRealtimeEnergy';
import { NatureBackground } from '@/components/NatureBackground';
import { HUDHeader } from '@/components/HUDHeader';
import { RealtimeGaugeHarvest } from '@/components/RealtimeGaugeHarvest';
import { LeaderboardModal } from '@/components/LeaderboardModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const realtimeEnergy = useRealtimeEnergy();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // SWR Polling (10s interval) for global scores & Top 5 country leaderboard
  const { data, mutate } = useSWR('/api/stats', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const globalScore = data?.globalScore || 0;
  const userCountry = data?.userCountry || 'UNKNOWN';
  const userCountryScore = data?.userCountryScore || 0;
  const topCountries = data?.topCountries || [];

  // Determine tree stage (1 ~ 4) based on global score
  let treeStage = 1;
  if (globalScore >= 100000) {
    treeStage = 4;
  } else if (globalScore >= 10000) {
    treeStage = 3;
  } else if (globalScore >= 1000) {
    treeStage = 2;
  }

  return (
    <main className="game-canvas-bg relative flex flex-col justify-between items-center select-none overflow-hidden">
      {/* 1. Healing Environment Animations (Sunbeams, Birds, Butterflies, Ladybug) */}
      <NatureBackground />

      {/* 2. HUD Header (Top-Left Flag + Tree Metric, Top-Right 🏆 Leaderboard Trigger) */}
      <HUDHeader
        userCountry={userCountry}
        userCountryScore={userCountryScore}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* 3. Main Tree (Rooted at Bottom Center of Grass Meadow) */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 animate-tree-root">
          <img
            src={`/tree${treeStage}.png`}
            alt={`Forest Race Tree Stage ${treeStage}`}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(46,125,50,0.4)]"
          />
        </div>
      </div>

      {/* 4. Bottom Controls: 5-Second Real-Time Filling Gauge & Harvest 💧 Button */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center z-20">
        <RealtimeGaugeHarvest
          realtimeEnergy={realtimeEnergy}
          onHarvestSuccess={() => mutate()}
          userCountry={userCountry}
        />
      </div>

      {/* 5. Top 5 National Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        topCountries={topCountries}
        userCountry={userCountry}
        globalScore={globalScore}
      />
    </main>
  );
}
