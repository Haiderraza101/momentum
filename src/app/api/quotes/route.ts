import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://zenquotes.io/api/quotes',{
    next:{revalidate:60}
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json({
    quote: data[0].q,
    author: data[0].a,
  });
}
