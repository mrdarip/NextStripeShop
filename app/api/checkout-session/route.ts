import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session_id = searchParams.get('session_id');

  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      return NextResponse.json(session);
    } else {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}