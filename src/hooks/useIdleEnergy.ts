'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const MAX_ENERGY = 360; // Max capacity 360 (1 hour equivalent)
const TICK_INTERVAL_MS = 10000; // 10s per +1 energy tick
const STORAGE_KEY = 'forestrace_idle_energy_v1';

export interface UseIdleEnergyReturn {
  energy: number;
  maxEnergy: number;
  isPaused: boolean;
  progressPercent: number;
  formattedTime: string;
  consumeEnergy: () => number;
}

export function useIdleEnergy(): UseIdleEnergyReturn {
  const [energy, setEnergy] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Restore saved state safely upon client hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setEnergy(Math.min(parsed, MAX_ENERGY));
        }
      }
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
    }
    setIsHydrated(true);
  }, []);

  // 2. Persist state changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, energy.toString());
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [energy, isHydrated]);

  // 3. Document visibility & window focus check
  const checkVisibility = useCallback(() => {
    const isVisible =
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible' &&
      document.hasFocus();
    setIsPaused(!isVisible);
  }, []);

  // 4. Register event listeners for focus, blur, and visibilitychange
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

  // 5. 10-second tick energy accumulator
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setEnergy((prev) => {
        if (prev >= MAX_ENERGY) {
          return MAX_ENERGY;
        }
        return prev + 1;
      });
    }, TICK_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused]);

  // 6. Reset & consume energy method
  const consumeEnergy = useCallback((): number => {
    const currentEnergy = energy;
    setEnergy(0);
    try {
      localStorage.setItem(STORAGE_KEY, '0');
    } catch (e) {
      console.warn('Failed to reset localStorage:', e);
    }
    return currentEnergy;
  }, [energy]);

  // 7. Calculate gauge progress percent
  const progressPercent = Math.min(
    100,
    Math.round((energy / MAX_ENERGY) * 100)
  );

  // 8. Format energy into hh:mm:ss
  const totalSeconds = energy * 10;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    energy,
    maxEnergy: MAX_ENERGY,
    isPaused,
    progressPercent,
    formattedTime,
    consumeEnergy,
  };
}
