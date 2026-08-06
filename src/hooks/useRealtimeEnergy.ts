'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CYCLE_DURATION_MS = 5000; // 5 seconds fill time

export interface UseRealtimeEnergyReturn {
  gaugePercent: number; // 0 to 100%
  isWaterReady: boolean; // True when 5s fill completes and button is active
  isPaused: boolean;
  triggerHarvest: () => void; // Reset gauge to 0 and restart 5s timer
}

export function useRealtimeEnergy(): UseRealtimeEnergyReturn {
  const [gaugePercent, setGaugePercent] = useState<number>(0);
  const [isWaterReady, setIsWaterReady] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const cycleStartRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number | null>(null);

  // Visibility and tab focus check
  const checkVisibility = useCallback(() => {
    const isVisible =
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible' &&
      document.hasFocus();

    setIsPaused(!isVisible);
  }, []);

  useEffect(() => {
    checkVisibility();

    const handleVisibilityChange = () => checkVisibility();
    const handleFocus = () => setIsPaused(false);
    const handleBlur = () => setIsPaused(true);

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [checkVisibility]);

  // 5-Second Realtime Gauge Progress Animation
  useEffect(() => {
    // If backgrounded or button is ALREADY ready (100% full waiting for user click), pause filling
    if (isPaused || isWaterReady) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const updateProgress = () => {
      const elapsed = Date.now() - cycleStartRef.current;
      if (elapsed >= CYCLE_DURATION_MS) {
        // 5 seconds completed! Lock gauge at 100% and activate Water Button
        setGaugePercent(100);
        setIsWaterReady(true);
      } else {
        const percent = Math.min(100, (elapsed / CYCLE_DURATION_MS) * 100);
        setGaugePercent(percent);
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPaused, isWaterReady]);

  // Reset 5s timer and start next round ONLY when user clicks the water button
  const triggerHarvest = useCallback(() => {
    setIsWaterReady(false);
    setGaugePercent(0);
    cycleStartRef.current = Date.now();
  }, []);

  return {
    gaugePercent,
    isWaterReady,
    isPaused,
    triggerHarvest,
  };
}
