import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'cosmic-art',
    timestamp: Date.now(),
    version: '1.0.0',
  });
}
