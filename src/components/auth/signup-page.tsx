'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'phosphor-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './auth-page.module.scss';

export const SignupPage = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !email.trim() || !password.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (password !== confirm) {
      await Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'The password and confirm password fields must be identical. Please re-enter your password.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'Try Again',
      });
      setConfirm('');
      return;
    }

    setLoading(true);
    await Swal.fire({
      icon: 'success',
      title: 'Account created!',
      text: 'Welcome to NearHelp.',
      confirmButtonColor: '#0052da',
      timer: 1500,
      showConfirmButton: false,
    });
    setLoading(false);
    router.push('/mypage');
  };

  return (
    <div className={styles.page}>
      {/* Form side */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <Link href="/" className={styles.brand}>
            <Image src="/branding/near-help.png" alt="NearHelp" width={300} height={90} className={styles.brandLogo} />
          </Link>

          <h1 className={styles.heading}>SIGNUP</h1>
          <p className={styles.subheading}>Create your NearHelp account to get started.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="nickname">Nickname</label>
              <input
                id="nickname"
                type="text"
                className={styles.input}
                placeholder="Enter Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="phone">Phone <span style={{ fontWeight: 400, color: '#6b7280' }}>(optional)</span></label>
              <input
                id="phone"
                type="tel"
                className={styles.input}
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                className={styles.input}
                placeholder="Re-enter Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              SIGNUP
              <ArrowRight size={20} weight="bold" />
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?
            <Link href="/auth/login">LOGIN</Link>
          </p>
        </div>
      </div>

      {/* Image side */}
      <div className={styles.imageSide}>
        <Image
          src="/theme/images/contact.jpg"
          alt="NearHelp"
          fill
          sizes="50vw"
          className={styles.bgImage}
          priority
        />
      </div>
    </div>
  );
};
