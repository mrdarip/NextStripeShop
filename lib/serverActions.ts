'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * Retrieves a session from Stripe
 * 
 * @param session_id - The ID of the session to retrieve
 * @returns The session object as a plain object
 */
export async function getSession(session_id: string) {
  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      return JSON.parse(JSON.stringify(session)); // Convert to plain object
    } else {
      throw new Error('Invalid session ID');
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error('An unknown error occurred');
  }
}

/**
 * Creates a checkout session with Stripe
 * 
 * @param cart - Items in the cart
 * @param origin - The origin URL for success and cancel
 * @returns The session ID of the created session
 */
export async function createCheckoutSession(cart: any, origin: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map((item: any) => ({
        price: item.id,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });
    
    return session.id;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error('An unknown error occurred');
  }
}
