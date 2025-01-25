import { useState } from 'react';

const Home = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const session = await response.json();

    if (session.id) {
      const stripe = await import('@stripe/stripe-js');
      const { redirectToCheckout } = stripe;
      await redirectToCheckout({ sessionId: session.id });
    }

    setLoading(false);
  };

  return (
    <div>
      <section>
        <div className="product">
          <img src="/images/stubborn-attachments.png" alt="The cover of Stubborn Attachments" />
          <div className="description">
            <h3>Stubborn Attachments</h3>
            <h5>$20.00</h5>
          </div>
        </div>
        <button type="button" id="checkout-button" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Loading...' : 'Checkout'}
        </button>
      </section>
    </div>
  );
};

export default Home;