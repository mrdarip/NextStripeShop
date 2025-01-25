import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect back to the home page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment was not successful. You will be redirected back to the home page shortly.</p>
    </div>
  );
};

export default CancelPage;