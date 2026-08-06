'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

export function FirefliesBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 25 fireflies with randomized parameters
    const generated: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 6) + 3, // 3px to 8px
      left: Math.random() * 100, // 0% to 100%
      duration: Math.random() * 15 + 12, // 12s to 27s
      delay: Math.random() * 10, // 0s to 10s
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="firefly"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
