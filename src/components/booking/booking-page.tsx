'use client';

import { useSearchParams } from 'next/navigation';
import { BookingForm } from './booking-form';
import styles from './booking-page.module.scss';

export const BookingPage = () => {
  const preselected = useSearchParams().get('service') ?? '';

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Online Booking</p>
        <h1 className={styles.heading}>Online Booking For Appointments.</h1>
        <BookingForm preselectedServiceId={preselected} />
      </div>
    </main>
  );
};
