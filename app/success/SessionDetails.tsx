'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Stripe from 'stripe';

export default function SessionDetails() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/checkout-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => setSession(data));
    }
  }, [session_id]);

  if (!session) return <p>Loading session details...</p>;

  return (
    <div>
      <p>Thank you for your purchase!</p>
      <p>Order ID: {session.id}</p>
      <p>Amount: {session.amount_total ? session.amount_total / 100 : "-"} {(session.currency ?? "¤").toUpperCase()}</p>
    </div>
  );
}