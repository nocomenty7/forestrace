import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const revalidate = 0; // Dynamic route

export async function GET(request: Request) {
  try {
    const userCountry = (
      request.headers.get('x-vercel-ip-country') || 'UNKNOWN'
    ).toUpperCase();

    // Parallel atomic read queries using Upstash Redis zrange with rev: true
    const [globalScoreRaw, rawLeaderboard, userCountryScoreRaw] = await Promise.all([
      redis.get<number | string>('forestrace:global'),
      redis.zrange<string[]>('forestrace:leaderboard', 0, 4, {
        rev: true,
        withScores: true,
      }),
      redis.hget<number | string>('forestrace:countries', userCountry),
    ]);

    const globalScore = Number(globalScoreRaw || 0);
    const userCountryScore = Number(userCountryScoreRaw || 0);

    // Format top countries array
    const topCountries: { country: string; score: number }[] = [];
    if (Array.isArray(rawLeaderboard)) {
      for (let i = 0; i < rawLeaderboard.length; i += 2) {
        const country = String(rawLeaderboard[i] || '');
        const score = Number(rawLeaderboard[i + 1] || 0);
        if (country) {
          topCountries.push({ country, score });
        }
      }
    }

    return NextResponse.json({
      globalScore,
      userCountry,
      userCountryScore,
      topCountries,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching forest stats:', error);
    return NextResponse.json(
      {
        globalScore: 0,
        userCountry: 'UNKNOWN',
        userCountryScore: 0,
        topCountries: [],
      },
      { status: 200 }
    );
  }
}
