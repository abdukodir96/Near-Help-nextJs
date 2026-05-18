'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CaretDown } from 'phosphor-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_SERVICES, CREATE_BOOKING } from '@/lib/graphql/queries';
import styles from './booking-page.module.scss';

type BackendService = {
  _id: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceOption: string;
};

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const BookingPage = () => {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const preselected  = searchParams.get('service') ?? '';

  const [serviceId, setServiceId] = useState(preselected);
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [date,      setDate]      = useState('');
  const [time,      setTime]      = useState('');
  const [address,   setAddress]   = useState('');
  const [note,      setNote]      = useState('');
  const [loading,   setLoading]   = useState(false);

  // ── Fetch real services from backend ──────────────────────────────────────
  const { data: servicesData } = useQuery<{
    getServices: { list: BackendService[] };
  }>(GET_SERVICES, {
    variables: { input: { page: 1, limit: 100 } },
    fetchPolicy: 'cache-and-network',
  });

  const services = servicesData?.getServices?.list ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [createBooking] = useMutation<any>(CREATE_BOOKING);

  // Pre-select service from URL param once services load
  useEffect(() => {
    if (preselected && services.length > 0) {
      const match = services.find((s) => s._id === preselected);
      if (match) setServiceId(match._id);
    }
  }, [preselected, services]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auth check
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'You need to be logged in to make a booking.',
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0052da',
        cancelButtonColor: '#6b7280',
      });
      if (result.isConfirmed) router.push('/auth/login');
      return;
    }

    // Validation
    if (!serviceId || !email.trim() || !phone.trim() || !date || !time || !address.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    if (!email.includes('@')) {
      await Swal.fire({ icon: 'warning', title: 'Invalid email', text: 'Please enter a valid email address.', confirmButtonColor: '#0052da' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await createBooking({
        variables: {
          input: {
            serviceId,
            bookingDate: date,
            bookingTime: time,
            bookingAddress: address.trim(),
            bookingNote: note.trim() || undefined,
          },
        },
      });

      const booking = data?.createBooking;
      const selectedService = services.find((s) => s._id === serviceId);

      await Swal.fire({
        icon: 'success',
        title: 'Booking Submitted!',
        html: `
          <div style="text-align:left;font-size:0.95rem;line-height:2;color:#374151;">
            <b>Service:</b> ${booking?.serviceTitleSnapshot ?? selectedService?.serviceTitle ?? '—'}<br/>
            <b>Date:</b> ${date}<br/>
            <b>Time:</b> ${time}<br/>
            <b>Address:</b> ${address}<br/>
            <b>Status:</b> <span style="color:#0052da;font-weight:700;">${booking?.bookingStatus ?? 'PENDING'}</span>
          </div>
          <p style="margin-top:14px;font-size:0.88rem;color:#6b7280;">
            A confirmation email has been sent to your registered email address.
          </p>
        `,
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });

      setServiceId('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setAddress('');
      setNote('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      await Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: msg.includes('NOT_ALLOWED') ? 'You cannot book your own service.' : msg,
        confirmButtonColor: '#0052da',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Online Booking</p>
        <h1 className={styles.heading}>Online Booking For Appointments.</h1>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Row 0 — Email + Phone */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-email">Email*</label>
              <input
                id="book-email"
                type="email"
                className={styles.input}
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-phone">Contact number*</label>
              <input
                id="book-phone"
                type="tel"
                className={styles.input}
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 1 — Service + Date */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-service">Select service*</label>
              <div className={styles.selectWrap}>
                <select
                  id="book-service"
                  className={styles.select}
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  <option value="">Choose a Service</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.serviceTitle}
                    </option>
                  ))}
                </select>
                <CaretDown size={18} weight="bold" />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-date">Booking date*</label>
              <input
                id="book-date"
                type="date"
                className={styles.input}
                value={date}
                min={getTodayStr()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2 — Time + Address */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-time">Booking time*</label>
              <input
                id="book-time"
                type="time"
                className={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="book-address">Address*</label>
              <input
                id="book-address"
                type="text"
                className={styles.input}
                placeholder="Your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Note */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="book-note">Note (optional)</label>
            <textarea
              id="book-note"
              className={styles.textarea}
              placeholder="Any additional details for the agent..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className={styles.submitWrap}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : 'Get a Booking'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
