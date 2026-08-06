'use client';

import React from 'react';

export function NatureBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Rotating Golden Sunbeams from Top-Right Sky */}
      <div className="sunbeam-container">
        <div className="sunbeam" />
        <div className="sunbeam sunbeam-2" />
      </div>

      {/* 2. Flying Birds in Sky */}
      <div className="absolute top-[12%] left-0 w-full animate-bird">
        <svg className="w-8 h-8 text-sky-900/40" viewBox="0 0 24 24" fill="currentColor">
          <path
            className="bird-wing"
            d="M21.5 5.5c-2 2.5-5 3.5-7.5 2-2.5 2-6.5 2-9-1 3.5 0 6.5-1.5 8-4 1.5 2.5 5 3.5 8.5 3z"
          />
        </svg>
      </div>

      <div className="absolute top-[22%] left-0 w-full animate-bird-slow">
        <svg className="w-6 h-6 text-sky-900/30" viewBox="0 0 24 24" fill="currentColor">
          <path
            className="bird-wing"
            d="M21.5 5.5c-2 2.5-5 3.5-7.5 2-2.5 2-6.5 2-9-1 3.5 0 6.5-1.5 8-4 1.5 2.5 5 3.5 8.5 3z"
          />
        </svg>
      </div>

      {/* 3. Fluttering Butterflies near Meadow */}
      <div className="absolute bottom-[35%] left-[25%] animate-butterfly-1">
        <svg className="w-6 h-6 text-amber-400 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c-2-3-7-4-8-1s2 6 5 5c-3 2-4 7-1 8s6-2 4-5c2 3 7 4 8 1s-2-6-5-5c3-2 4-7 1-8s-6 2-4 5z" />
        </svg>
      </div>

      <div className="absolute bottom-[42%] right-[28%] animate-butterfly-2">
        <svg className="w-5 h-5 text-emerald-400 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c-2-3-7-4-8-1s2 6 5 5c-3 2-4 7-1 8s6-2 4-5c2 3 7 4 8 1s-2-6-5-5c3-2 4-7 1-8s-6 2-4 5z" />
        </svg>
      </div>

      {/* 4. Ground Ladybug on Grass Meadow */}
      <div className="absolute bottom-[8%] left-[18%] opacity-85 transition-transform duration-1000 animate-pulse">
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          {/* Ladybug SVG Body & Dots */}
          <circle cx="12" cy="14" r="8" fill="#e53935" />
          <path d="M12 6c-2 0-4 2-4 4h8c0-2-2-4-4-4z" fill="#212121" />
          <line x1="12" y1="10" x2="12" y2="22" stroke="#212121" strokeWidth="1.5" />
          <circle cx="9" cy="13" r="1.2" fill="#212121" />
          <circle cx="15" cy="13" r="1.2" fill="#212121" />
          <circle cx="9" cy="17" r="1.2" fill="#212121" />
          <circle cx="15" cy="17" r="1.2" fill="#212121" />
        </svg>
      </div>
    </div>
  );
}
