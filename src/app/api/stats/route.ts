import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { calculateTreeProgress } from '@/lib/country';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const headerCountry = request.headers.get('x-vercel-ip-country');
    const userCountry = (headerCountry || 'UNKNOWN').toUpperCase();

    // Parallel atomic read queries for ALL participating countries
    const [globalScoreRaw, rawLeaderboard, userCountryScoreRaw] = await Promise.all([
      redis.get<number | string>('forestrace:global'),
      redis.zrange<string[]>('forestrace:leaderboard', 0, -1, {
        rev: true,
        withScores: true,
      }),
      redis.hget<number | string>('forestrace:countries', userCountry),
    ]);

    const globalScore = Number(globalScoreRaw || 0);
    const userCountryScore = Number(userCountryScoreRaw || 0);

    // Format all countries list
    const allCountries: { country: string; score: number; completedTrees: number }[] = [];
    if (Array.isArray(rawLeaderboard)) {
      for (let i = 0; i < rawLeaderboard.length; i += 2) {
        const country = String(rawLeaderboard[i] || '');
        const score = Number(rawLeaderboard[i + 1] || 0);
        if (country) {
          const { completedTrees } = calculateTreeProgress(score);
          allCountries.push({ country, score, completedTrees });
        }
      }
    }

    return NextResponse.json({
      globalScore,
      userCountry,
      userCountryScore,
      allCountries,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching forest stats:', error);
    return NextResponse.json(
      {
        globalScore: 0,
        userCountry: 'UNKNOWN',
        userCountryScore: 0,
        allCountries: [],
      },
      { status: 200 }
    );
  }
}
