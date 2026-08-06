'use client';

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useRealtimeEnergy } from '@/hooks/useRealtimeEnergy';
import { NatureBackground } from '@/components/NatureBackground';
import { HUDHeader } from '@/components/HUDHeader';
import { RealtimeGaugeHarvest } from '@/components/RealtimeGaugeHarvest';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { AdminTestPanel } from '@/components/AdminTestPanel';
import { EvolutionOverlay } from '@/components/EvolutionOverlay';
import { calculateTreeProgress } from '@/lib/country';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const realtimeEnergy = useRealtimeEnergy();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Active User Country override (for Admin Testing)
  const [activeCountryOverride, setActiveCountryOverride] = useState<string | null>(null);

  // Evolution Overlay state
  const [evolutionBanner, setEvolutionBanner] = useState<{
    show: boolean;
    stageTitle: string;
    isForestCompletion: boolean;
  }>({ show: false, stageTitle: '', isForestCompletion: false });

  // SWR Polling (10s interval) for global scores & all country leaderboard
  const { data, mutate } = useSWR('/api/stats', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const globalScore = data?.globalScore || 0;
  const detectedUserCountry = data?.userCountry || 'UNKNOWN';
  const userCountry = activeCountryOverride || detectedUserCountry;

  const userCountryScore = data?.userCountryScore || 0;
  const allCountries = data?.allCountries || [];

  // Calculate current stage progress for the active country
  const { stage, completedTrees, currentCycleWater, nextStageWater, stageProgressPercent, stageName } =
    calculateTreeProgress(userCountryScore);

  // Track previous stage to trigger evolution overlays
  const prevStageRef = useRef<number>(stage);
  const prevCompletedTreesRef = useRef<number>(completedTrees);

  useEffect(() => {
    // Stage upgrade evolution check
    if (stage > prevStageRef.current && prevStageRef.current > 0) {
      setEvolutionBanner({
        show: true,
        stageTitle: `Stage ${stage}: ${stageName}`,
        isForestCompletion: false,
      });
    }
    // Completed Tree Forest Delivery check
    else if (completedTrees > prevCompletedTreesRef.current && prevCompletedTreesRef.current >= 0) {
      setEvolutionBanner({
        show: true,
        stageTitle: `Completed Tree #${completedTrees} Sent to Forest!`,
        isForestCompletion: true,
      });
    }

    prevStageRef.current = stage;
    prevCompletedTreesRef.current = completedTrees;
  }, [stage, completedTrees, stageName]);

  // Admin Fast-Forward cheat water adder
  const handleAdminAddWater = async (amount: number) => {
    try {
      await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, country: userCountry }),
      });
      mutate();
    } catch (e) {
      console.error('Admin add water failed:', e);
    }
  };

  return (
    <main className="game-canvas-bg relative flex flex-col justify-between items-center select-none overflow-hidden">
      {/* 1. Healing Environment Animations (Sunbeams, Birds, Butterflies, Drifting Pollen) */}
      <NatureBackground />

      {/* 2. HUD Header (Rectangular Flag + Completed Trees Metric + ⚙️ Admin + 🏆 Leaderboard) */}
      <HUDHeader
        userCountry={userCountry}
        completedTrees={completedTrees}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* 3. Main Tree (Rooted at Bottom Center of Grass Meadow) */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
        {/* Stage Name Badge */}
        <div className="px-3.5 py-1 rounded-full natural-glass text-xs font-semibold text-emerald-950 mb-2 border border-white/80 shadow-md">
          {stageName} ({currentCycleWater}/{nextStageWater} 💧)
        </div>

        {/* Tree Image with Breathing Animation */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 animate-tree-root">
          <img
            src={`/tree${stage}.png`}
            alt={`Forest Race Tree Stage ${stage}`}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(46,125,50,0.4)] transition-all duration-500"
          />
        </div>
      </div>

      {/* 4. Bottom Controls: 5-Second Real-Time Gauge & Water 💧 Button */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center z-20">
        <RealtimeGaugeHarvest
          realtimeEnergy={realtimeEnergy}
          onHarvestSuccess={() => mutate()}
          userCountry={userCountry}
        />
      </div>

      {/* 5. Full Country Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        allCountries={allCountries}
        userCountry={userCountry}
        globalScore={globalScore}
      />

      {/* 6. Admin Test Panel (관리자 테스트 창) */}
      <AdminTestPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentCountry={userCountry}
        onSelectCountry={(country) => {
          setActiveCountryOverride(country);
          mutate();
        }}
        onAddWater={handleAdminAddWater}
      />

      {/* 7. Dramatic Evolution Celebration Overlay */}
      {evolutionBanner.show && (
        <EvolutionOverlay
          stageTitle={evolutionBanner.stageTitle}
          isForestCompletion={evolutionBanner.isForestCompletion}
          onDismiss={() =>
            setEvolutionBanner({ show: false, stageTitle: '', isForestCompletion: false })
          }
        />
      )}
    </main>
  );
}
