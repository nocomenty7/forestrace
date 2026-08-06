import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount) || 1;

    if (isNaN(amount) || amount <= 0 || amount > 5000) {
      return NextResponse.json(
        { error: 'Invalid water amount.' },
        { status: 400 }
      );
    }

    const headerCountry = request.headers.get('x-vercel-ip-country');
    const countryCode = (headerCountry || body.country || 'UNKNOWN').toUpperCase();

    // Execute atomic increments in Redis
    const [newGlobalScore, newCountryScore] = await Promise.all([
      redis.incrby('forestrace:global', amount),
      redis.hincrby('forestrace:countries', countryCode, amount),
      redis.zincrby('forestrace:leaderboard', amount, countryCode),
    ]);

    return NextResponse.json({
      success: true,
      added: amount,
      country: countryCode,
      globalScore: newGlobalScore,
      countryScore: newCountryScore,
    });
  } catch (error) {
    console.error('Error processing water harvest:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
