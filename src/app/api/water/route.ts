import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount);

    // Validate energy amount (max 360 per harvest)
    if (isNaN(amount) || amount <= 0 || amount > 360) {
      return NextResponse.json(
        { error: 'Invalid energy amount. Must be between 1 and 360.' },
        { status: 400 }
      );
    }

    // Determine country code from Vercel edge header `x-vercel-ip-country` or client fallback
    const headerCountry = request.headers.get('x-vercel-ip-country');
    const countryCode = (headerCountry || body.country || 'UNKNOWN').toUpperCase();

    // Determine client IP for basic rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateLimitKey = `forestrace:ratelimit:${ip}`;

    // Set 3-second cool-down per IP to prevent spamming
    const isLocked = await redis.set(rateLimitKey, '1', {
      nx: true,
      ex: 3,
    });

    if (!isLocked) {
      return NextResponse.json(
        { error: 'Harvest cool-down in progress. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Execute atomic operations in parallel on Upstash Redis
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
