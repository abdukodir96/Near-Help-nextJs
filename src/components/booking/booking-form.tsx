'use client';

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

type Props = {
  preselectedServiceId?: string;
};

export const BookingForm = ({ preselectedServiceId = '' }: Props) => {
  const [serviceId, setServiceId] = useState(preselectedServiceId);
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [date,      setDate]      = useState('');
  const [time,      setTime]      = useState('');
  const [address,   setAddress]   = useState('');
  const [note,      setNote]      = useState('');
  const [loading,   setLoading]   = useState(false);

  const { data: servicesData } = useQuery<{
    getServices: { list: BackendService[] };
  }>(GET_SERVICES, {
    variables: { input: { page: 1, limit: 100 } },
    fetchPolicy: 'cache-and-network',
  });

  const services = servicesData?.getServices?.list ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [createBooking] = useMutation<any>(CREATE_BOOKING);

  useEffect(() => {
    if (preselectedServiceId && services.length > 0) {
      const match = services.find((s) => s._id === preselectedServiceId);
      if (match) setServiceId(match._id);
    }
  }, [preselectedServiceId, services]);

  const reset = () => {
    setServiceId('');
    setEmail('');
    setPhone('');
    setDate('');
    setTime('');
    setAddress('');
    setNote('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceId || !email.trim() || !phone.trim() || !date || !time || !address.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Please fill in all required fields.', confirmButtonColor: '#0052da' });
      return;
    }
    if (!email.includes('@')) {
      await Swal.fire({ icon: 'warning', title: 'Invalid email', text: 'Please enter a valid email address.', confirmButtonColor: '#0052da' });
      return;
    }

    const selectedService = services.find((s) => s._id === serviceId);
    const isLoggedIn = Boolean(Cookies.get(ACCESS_TOKEN_KEY));

    setLoading(true);
    try {
      if (isLoggedIn) {
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

        // Send confirmation email for logged-in users too
        fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: email.split('@')[0],
            email: email.trim(),
            phone: phone.trim(),
            serviceTitle: booking?.serviceTitleSnapshot ?? selectedService?.serviceTitle ?? serviceId,
            date,
            time,
            address: address.trim(),
            note: note.trim() || undefined,
          }),
        }).catch(() => {});

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
        });
      } else {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: email.split('@')[0],
            email: email.trim(),
            phone: phone.trim(),
            serviceTitle: selectedService?.serviceTitle ?? serviceId,
            date,
            time,
            address: address.trim(),
            note: note.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? 'Failed to submit booking.');
        }

        await Swal.fire({
          icon: 'success',
          title: 'Booking Submitted!',
          html: `
            <div style="text-align:left;font-size:0.95rem;line-height:2;color:#374151;">
              <b>Service:</b> ${selectedService?.serviceTitle ?? '—'}<br/>
              <b>Date:</b> ${date}<br/>
              <b>Time:</b> ${time}<br/>
              <b>Address:</b> ${address}
            </div>
            <p style="margin-top:14px;font-size:0.88rem;color:#6b7280;">
              A confirmation email has been sent to <b>${email}</b>.
            </p>
          `,
          confirmButtonColor: '#0052da',
        });
      }

      reset();
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* Row 1 — Email + Phone */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bf-email">Email*</label>
          <input
            id="bf-email"
            type="email"
            className={styles.input}
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bf-phone">Contact number*</label>
          <input
            id="bf-phone"
            type="tel"
            className={styles.input}
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row 2 — Service + Date */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bf-service">Select service*</label>
          <div className={styles.selectWrap}>
            <select
              id="bf-service"
              className={styles.select}
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">Choose a Service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.serviceTitle}</option>
              ))}
            </select>
            <CaretDown size={18} weight="bold" />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bf-date">Booking date*</label>
          <input
            id="bf-date"
            type="date"
            className={styles.input}
            value={date}
            min={getTodayStr()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Row 3 — Time + Address */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bf-time">Booking time*</label>
          <input
            id="bf-time"
            type="time"
            className={styles.input}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="bf-address">Address*</label>
          <input
            id="bf-address"
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
        <label className={styles.label} htmlFor="bf-note">Note (optional)</label>
        <textarea
          id="bf-note"
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
  );
};
