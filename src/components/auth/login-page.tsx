'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'phosphor-react';
import { useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import styles from './auth-page.module.scss';

const MOCK_USER = { nickname: 'Martin', password: 'damir2020' };

export const LoginPage = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !password.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please enter your nickname and password.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);

    const isValid =
      nickname.trim() === MOCK_USER.nickname &&
      password === MOCK_USER.password;

    if (!isValid) {
      setLoading(false);
      await Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: 'Incorrect nickname or password. Please try again.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'Try Again',
      });
      return;
    }

    const cookieOptions = remember
      ? { expires: 7 }
      : undefined;

    Cookies.set(ACCESS_TOKEN_KEY, 'mock-access-token', cookieOptions);
    Cookies.set(REFRESH_TOKEN_KEY, 'mock-refresh-token', cookieOptions);

    await Swal.fire({
      icon: 'success',
      title: 'Welcome back!',
      text: `Logged in as ${nickname}.`,
      confirmButtonColor: '#0052da',
      timer: 1500,
      showConfirmButton: false,
    });

    setLoading(false);
    router.push('/');
  };

  return (
    <div className={styles.page}>
      {/* Form side */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <Link href="/" className={styles.brand}>
            <Image src="/branding/near-help.png" alt="NearHelp" width={300} height={90} className={styles.brandLogo} />
          </Link>

          <h1 className={styles.heading}>LOGIN</h1>
          <p className={styles.subheading}>Login in with this account across the following sites.</p>

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
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className={styles.forgotLink}>
                Lost your password?
              </Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              LOGIN
              <ArrowRight size={20} weight="bold" />
            </button>
          </form>

          <p className={styles.footerText}>
            Not registered yet?
            <Link href="/auth/signup">SIGNUP</Link>
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
