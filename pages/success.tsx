import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Stripe from 'stripe';

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/checkout-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => setSession(data));
    }
  }, [session_id]);

  return (
    <div>
      <h1>Payment Successful</h1>
      {session ? (
        <div>
          <p>Thank you for your purchase!</p>
          <p>Order ID: {session.id}</p>
          <p>Amount: {session.amount_total?session.amount_total/ 100:"-"} {(session.currency??"¤").toUpperCase()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SuccessPage;