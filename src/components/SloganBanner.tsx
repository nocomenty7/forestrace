'use client';

import React from 'react';

export function SloganBanner() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-1 my-3 z-10 px-4">
      <h2 className="text-lg md:text-2xl font-serif tracking-widest text-amber-200/95 drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] font-medium italic">
        &ldquo;Patience is the only way to win&rdquo;
      </h2>
      <p className="text-xs md:text-sm text-indigo-200/60 font-sans tracking-wide">
        인내는 승리하는 유일한 길입니다 &bull; 탭을 켜두어 물지게에 에너지를 채우세요
      </p>
    </div>
  );
}
