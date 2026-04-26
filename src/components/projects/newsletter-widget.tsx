'use client';

import { type FormEvent, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './project-detail-page.module.scss';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NewsletterWidget = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalized = email.trim();

    if (!emailPattern.test(normalized)) {
      void Swal.fire({
        icon: 'error',
        title: 'Invalid email',
        text: 'Please enter a valid email address before subscribing.',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    void Swal.fire({
      icon: 'success',
      title: 'Subscribed successfully',
      text: 'You have been added to the NearHelp update list.',
      confirmButtonColor: '#0052da',
    });
    setEmail('');
  };

  return (
    <form onSubmit={handleSubscribe} noValidate>
      <p className={styles.newsletterSub}>Join 20,000 Subscribers!</p>
      <input
        type="email"
        placeholder="Email Address"
        className={styles.newsletterInput}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
      <p className={styles.newsletterNote}>
        By signing up you agree to our <strong>Privacy Policy</strong>
      </p>
    </form>
  );
};
