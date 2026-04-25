import { Suspense } from 'react';
import { BookingPage } from '@/components/booking/booking-page';

export default function BookingRoute() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
