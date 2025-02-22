'use client';

import { Suspense } from 'react';
import SessionDetails from './SessionDetails';
import Loading from './loading';

export default function SuccessPage() {
  return (
    <div>
      <h1>Payment Successful</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <SessionDetails />
      </Suspense>
    </div>
  );
}