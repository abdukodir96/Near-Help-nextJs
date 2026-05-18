'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Buildings, User } from 'phosphor-react';
import { useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { SIGNUP } from '@/lib/graphql/queries';
import styles from './auth-page.module.scss';

export const SignupPage = () => {
  const router = useRouter();
  const [memberType, setMemberType] = useState<'USER' | 'AGENT'>('USER');
  const [nickname,   setNickname]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signupMutation, { loading }] = useMutation<any>(SIGNUP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !email.trim() || !password.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Please fill in all required fields.', confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
      return;
    }

    if (!email.includes('@')) {
      await Swal.fire({ icon: 'warning', title: 'Invalid email', text: 'Please enter a valid email address.', confirmButtonColor: '#0052da' });
      return;
    }

    if (password !== confirm) {
      await Swal.fire({ icon: 'error', title: 'Passwords do not match', text: 'The password and confirm password fields must be identical. Please re-enter your password.', confirmButtonColor: '#0052da', confirmButtonText: 'Try Again' });
      setConfirm('');
      return;
    }

    try {
      const { data } = await signupMutation({
        variables: {
          input: {
            memberNick:      nickname.trim(),
            memberEmail:     email.trim(),
            memberPassword:  password,
            memberPhone:     phone.trim() || undefined,
            memberType,
          },
        },
      });

      if (data?.signup) {
        const { accessToken, refreshToken } = data.signup;
        Cookies.set(ACCESS_TOKEN_KEY, accessToken);
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken);

        await Swal.fire({
          icon: 'success',
          title: 'Account created!',
          text: 'Welcome to NearHelp.',
          confirmButtonColor: '#0052da',
          timer: 1500,
          showConfirmButton: false,
        });

        router.push('/');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      await Swal.fire({ icon: 'error', title: 'Signup failed', text: message, confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <Link href="/" className={styles.brand}>
            <Image src="/branding/near-help.png" alt="NearHelp" width={300} height={90} className={styles.brandLogo} />
          </Link>

          <h1 className={styles.heading}>SIGNUP</h1>
          <p className={styles.subheading}>Create your NearHelp account to get started.</p>

          <form className={styles.form} onSubmit={handleSubmit}>

            {/* Account type toggle */}
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={`${styles.typeBtn} ${memberType === 'USER' ? styles.typeBtnActive : ''}`}
                onClick={() => setMemberType('USER')}
              >
                <User size={20} weight={memberType === 'USER' ? 'fill' : 'regular'} />
                <span>User</span>
                <span className={styles.typeBtnDesc}>I want to book services</span>
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${memberType === 'AGENT' ? styles.typeBtnActive : ''}`}
                onClick={() => setMemberType('AGENT')}
              >
                <Buildings size={20} weight={memberType === 'AGENT' ? 'fill' : 'regular'} />
                <span>Agent</span>
                <span className={styles.typeBtnDesc}>I provide services</span>
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="nickname">Nickname*</label>
              <input id="nickname" type="text" className={styles.input} placeholder="Enter Nickname (3-15 chars)" value={nickname} onChange={(e) => setNickname(e.target.value)} autoComplete="username" minLength={3} maxLength={15} required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Email*</label>
              <input id="email" type="email" className={styles.input} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="phone">Phone <span style={{ fontWeight: 400, color: '#6b7280' }}>(optional)</span></label>
              <input id="phone" type="tel" className={styles.input} placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">Password* (5-15 chars)</label>
              <input id="password" type="password" className={styles.input} placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={5} maxLength={15} required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="confirm">Confirm Password</label>
              <input id="confirm" type="password" className={styles.input} placeholder="Re-enter Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'SIGNUP'}
              {!loading && <ArrowRight size={20} weight="bold" />}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?
            <Link href="/auth/login">LOGIN</Link>
          </p>
        </div>
      </div>

      <div className={styles.imageSide}>
        <Image src="/theme/images/contact.jpg" alt="NearHelp" fill sizes="50vw" className={styles.bgImage} priority />
      </div>
    </div>
  );
};
