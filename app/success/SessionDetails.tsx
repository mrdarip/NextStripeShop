'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Stripe from 'stripe';
import { getSession } from '../../lib/stripeService';

export default function SessionDetails() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);

  useEffect(() => {
    if (session_id) {
      getSession(session_id)
        .then((data) => setSession(data))
        .catch((error) => console.error('Error fetching session:', error));
    }
  }, [session_id]);

  if (!session) return <p>Loading session details...</p>;

  return (
    <div>
      <p>Thank you for your purchase!</p>
      <p>Order ID: {session.id}</p>
      <p>Amount: {session.amount_total ? (session.amount_total / 100).toFixed(2) : "-"} {(session.currency ?? "¤").toUpperCase()}</p>
      <p>Payment Status: {session.payment_status ?? "unknown"}</p>
    </div>
  );
}