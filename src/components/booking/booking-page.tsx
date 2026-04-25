'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CaretDown } from 'phosphor-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { serviceItems } from '@/components/services/services-data';
import styles from './booking-page.module.scss';

export const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get('service') ?? '';

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [service, setService] = useState(preselected);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !service) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#4a6cf7',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);

    await Swal.fire({
      icon: 'success',
      title: 'Appointment requested!',
      text: 'We will contact you shortly to confirm your booking.',
      confirmButtonColor: '#4a6cf7',
      timer: 2000,
      showConfirmButton: false,
    });

    setLoading(false);
    router.push('/services');
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Online Booking</p>
        <h1 className={styles.heading}>Online Booking For Appointments.</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-name">Full name here*</label>
              <input
                id="book-name"
                type="text"
                className={styles.input}
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-email">Email here*</label>
              <input
                id="book-email"
                type="email"
                className={styles.input}
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-phone">Contact number*</label>
              <input
                id="book-phone"
                type="tel"
                className={styles.input}
                placeholder="Your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-service">Select service*</label>
              <div className={styles.selectWrap}>
                <select
                  id="book-service"
                  className={styles.select}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">Choose a Service</option>
                  {serviceItems.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </select>
                <CaretDown size={18} weight="bold" />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="book-message">Message</label>
            <textarea
              id="book-message"
              className={styles.textarea}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className={styles.submitWrap}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              Get an Appointment
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
