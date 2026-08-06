'use client';

import React from 'react';

export function NatureBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Rotating Golden Sunbeams */}
      <div className="sunbeam-container">
        <div className="sunbeam" />
        <div className="sunbeam sunbeam-2" />
      </div>

      {/* 2. Flying Birds in Sky */}
      <div className="absolute top-[12%] left-0 w-full animate-bird">
        <svg className="w-8 h-8 text-sky-900/35" viewBox="0 0 24 24" fill="currentColor">
          <path
            className="bird-wing"
            d="M21.5 5.5c-2 2.5-5 3.5-7.5 2-2.5 2-6.5 2-9-1 3.5 0 6.5-1.5 8-4 1.5 2.5 5 3.5 8.5 3z"
          />
        </svg>
      </div>

      <div className="absolute top-[20%] left-0 w-full animate-bird-slow">
        <svg className="w-6 h-6 text-sky-900/25" viewBox="0 0 24 24" fill="currentColor">
          <path
            className="bird-wing"
            d="M21.5 5.5c-2 2.5-5 3.5-7.5 2-2.5 2-6.5 2-9-1 3.5 0 6.5-1.5 8-4 1.5 2.5 5 3.5 8.5 3z"
          />
        </svg>
      </div>

      {/* 3. Fluttering Butterflies */}
      <div className="absolute bottom-[35%] left-[22%] animate-butterfly-1">
        <svg className="w-6 h-6 text-amber-300 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c-2-3-7-4-8-1s2 6 5 5c-3 2-4 7-1 8s6-2 4-5c2 3 7 4 8 1s-2-6-5-5c3-2 4-7 1-8s-6 2-4 5z" />
        </svg>
      </div>

      <div className="absolute bottom-[40%] right-[25%] animate-butterfly-2">
        <svg className="w-5 h-5 text-emerald-300 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c-2-3-7-4-8-1s2 6 5 5c-3 2-4 7-1 8s6-2 4-5c2 3 7 4 8 1s-2-6-5-5c3-2 4-7 1-8s-6 2-4 5z" />
        </svg>
      </div>

      {/* 4. Drifting Golden Pollen / Dandelion Seeds */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-200/60 blur-[1px] animate-pollen"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
