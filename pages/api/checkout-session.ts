import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  try {
    if (typeof session_id === 'string') {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      res.status(200).json(session);
    } else {
      res.status(400).json({ error: 'Invalid session ID' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}