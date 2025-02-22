'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment was not successful. You will be redirected back to the home page shortly.</p>
    </div>
  );
}