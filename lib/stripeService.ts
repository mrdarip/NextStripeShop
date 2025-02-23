import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}
console.log(stripeSecretKey);
const stripe = new Stripe(stripeSecretKey);

export async function createCheckoutSession(cart: any) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item: any) => ({
        price: item.id,
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });
    return { id: session.id };
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getSession(session_id: string) {
  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      return session;
    } else {
      throw new Error("Invalid session ID");
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("An unknown error occurred");
  }
}
