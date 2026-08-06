'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CYCLE_DURATION_MS = 5000; // 5 seconds cycle
const STORAGE_KEY = 'forestrace_energy_5s';

export interface UseRealtimeEnergyReturn {
  energy: number;
  gaugePercent: number; // Smooth 0 to 100% of current 5s fill
  isPaused: boolean;
  isHarvestReady: boolean;
  consumeEnergy: () => number;
}

export function useRealtimeEnergy(): UseRealtimeEnergyReturn {
  const [energy, setEnergy] = useState<number>(0);
  const [gaugePercent, setGaugePercent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const cycleStartRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number | null>(null);

  // 1. Restore local storage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setEnergy(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
    }
    setIsHydrated(true);
    cycleStartRef.current = Date.now();
  }, []);

  // 2. Persist energy to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, energy.toString());
    } catch (e) {
      console.warn('Failed to save localStorage:', e);
    }
  }, [energy, isHydrated]);

  // 3. Tab visibility and focus listener
  const checkVisibility = useCallback(() => {
    const isVisible =
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible' &&
      document.hasFocus();

    setIsPaused(!isVisible);
    if (isVisible) {
      cycleStartRef.current = Date.now() - (gaugePercent / 100) * CYCLE_DURATION_MS;
    }
  }, [gaugePercent]);

  useEffect(() => {
    checkVisibility();

    const handleVisibilityChange = () => checkVisibility();
    const handleFocus = () => {
      setIsPaused(false);
      cycleStartRef.current = Date.now() - (gaugePercent / 100) * CYCLE_DURATION_MS;
    };
    const handleBlur = () => setIsPaused(true);

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [checkVisibility, gaugePercent]);

  // 4. Smooth 5-Second Real-Time Gauge Loop using requestAnimationFrame
  useEffect(() => {
    if (isPaused) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const updateGauge = () => {
      const elapsed = Date.now() - cycleStartRef.current;
      if (elapsed >= CYCLE_DURATION_MS) {
        // 5 seconds completed! Accumulate +1 energy
        setEnergy((prev) => prev + 1);
        setGaugePercent(100);
        // Reset cycle timer for next 5-second round
        cycleStartRef.current = Date.now();
      } else {
        const percent = Math.min(100, (elapsed / CYCLE_DURATION_MS) * 100);
        setGaugePercent(percent);
      }

      animFrameRef.current = requestAnimationFrame(updateGauge);
    };

    animFrameRef.current = requestAnimationFrame(updateGauge);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPaused]);

  // 5. Consume/Harvest energy action
  const consumeEnergy = useCallback((): number => {
    const harvested = energy > 0 ? energy : 1;
    setEnergy(0);
    setGaugePercent(0);
    cycleStartRef.current = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, '0');
    } catch (e) {
      console.warn('Failed to reset localStorage:', e);
    }
    return harvested;
  }, [energy]);

  const isHarvestReady = energy > 0 || gaugePercent >= 98;

  return {
    energy,
    gaugePercent,
    isPaused,
    isHarvestReady,
    consumeEnergy,
  };
}
