'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  ArrowOutwardRounded,
  EditNoteOutlined,
  FavoriteBorderRounded,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  LogoutRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_ME, UPDATE_MEMBER, UPLOAD_IMAGE } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';
import styles from './my-page.module.scss';

const normalizeImage = (img?: string | null) => getAssetUrl(img) || '/theme/images/team/2.jpg';

type SidebarItem = {
  label: string;
  href?: string;
  icon: typeof AddCircleOutlineRounded;
  action?: 'logout';
  agentOnly?: boolean;
};

type SidebarSection = { title: string; items: SidebarItem[] };

const sidebarSections: SidebarSection[] = [
  {
    title: 'Manage Services',
    items: [
      { label: 'Add Service',      href: '/mypage/services/new', icon: AddCircleOutlineRounded, agentOnly: true },
      { label: 'My Services',      href: '/mypage/services',     icon: HomeWorkOutlined,        agentOnly: true },
      { label: 'My Favorites',     href: '/mypage/favorites',    icon: FavoriteBorderRounded },
      { label: 'Recently Visited', href: '/mypage/recent',       icon: HistoryOutlined },
      { label: 'My Followers',     href: '/mypage/followers',    icon: GroupOutlined },
      { label: 'My Followings',    href: '/mypage/followings',   icon: PersonAddAltOutlined },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Articles',      href: '/mypage/articles', icon: ArticleOutlined },
      { label: 'Write Article', href: '/blog/write',      icon: EditNoteOutlined, agentOnly: true },
    ],
  },
  {
    title: 'Manage Account',
    items: [
      { label: 'My Profile', href: '/mypage',     icon: AccountCircleOutlined },
      { label: 'Logout',     icon: LogoutRounded, action: 'logout' },
    ],
  },
];

export const MyPage = () => {
  const pathname   = usePathname();
  const router     = useRouter();
  const fileInputRef    = useRef<HTMLInputElement | null>(null);
  const [photoPreview,  setPhotoPreview]  = useState('/theme/images/team/2.jpg');
  const [pendingFile,   setPendingFile]   = useState<File | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [form, setForm] = useState({ nick: '', email: '', phone: '', address: '' });

  // ── Queries / Mutations ────────────────────────────────────────────────────

  const { data, loading, refetch } = useQuery<{
    getMember: {
      _id: string;
      memberNick: string;
      memberFullName?: string;
      memberImage?: string;
      memberPhone?: string;
      memberEmail?: string;
      memberAddress?: string;
      memberDesc?: string;
      memberType: string;
    };
  }>(GET_ME, { fetchPolicy: 'network-only' });

  const [updateMember] = useMutation(UPDATE_MEMBER);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadImage]  = useMutation<any>(UPLOAD_IMAGE);

  // Sync form with fetched data
  useEffect(() => {
    const m = data?.getMember;
    if (!m) return;
    setForm({
      nick:    m.memberNick    ?? '',
      email:   m.memberEmail   ?? '',
      phone:   m.memberPhone   ?? '',
      address: m.memberAddress ?? '',
    });
    setPhotoPreview(normalizeImage(m.memberImage));
  }, [data]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      await Swal.fire({ icon: 'error', title: 'Invalid file', text: 'Please upload a JPG or PNG image.', confirmButtonColor: '#0052da' });
      e.target.value = '';
      return;
    }

    setPendingFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.nick.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Username required', text: 'Please enter a username.', confirmButtonColor: '#0052da' });
      return;
    }

    setSaving(true);
    try {
      let imageUrl: string | undefined;

      // Upload image first if a new file was selected
      if (pendingFile) {
        const uploadRes = await uploadImage({ variables: { file: pendingFile } });
        const url = uploadRes.data?.uploadSingleImage?.url;
        if (url) imageUrl = url;
      }

      const m = data?.getMember;
      const input: Record<string, string> = {};

      const nick    = form.nick.trim();
      const email   = form.email.trim();
      const phone   = form.phone.trim();
      const address = form.address.trim();

      if (nick    && nick    !== m?.memberNick)    input.memberNick    = nick;
      if (email   && email   !== m?.memberEmail)   input.memberEmail   = email;
      if (phone   && phone   !== m?.memberPhone)   input.memberPhone   = phone;
      if (address && address !== m?.memberAddress) input.memberAddress = address;
      if (imageUrl) input.memberImage = imageUrl;

      if (Object.keys(input).length === 0 && !pendingFile) {
        await Swal.fire({ icon: 'info', title: 'No changes', text: 'You have not made any changes.', confirmButtonColor: '#0052da', timer: 1800, showConfirmButton: false });
        return;
      }

      await updateMember({ variables: { input } });

      setPendingFile(null);
      await refetch();

      await Swal.fire({
        icon: 'success',
        title: 'Profile updated',
        text: 'Your profile has been saved successfully.',
        confirmButtonColor: '#0052da',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      console.error('[updateMember error]', raw);
      await Swal.fire({ icon: 'error', title: 'Update failed', text: raw || 'Unknown error', confirmButtonColor: '#0052da' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    await Swal.fire({ icon: 'success', title: 'Logged out', confirmButtonColor: '#0052da', timer: 1500, showConfirmButton: false });
    router.push('/auth/login');
  };

  // ── Derived display values ─────────────────────────────────────────────────

  const member      = data?.getMember;
  const displayName = member?.memberFullName || member?.memberNick || form.nick || '—';
  const displayRole = member?.memberType ?? 'AGENT';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>My Profile</h1>
            <p>We are glad to see you again!</p>
          </header>

          <div className={styles.contentGrid}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebarCard}>
              <div className={styles.profileSummary}>
                <div className={styles.summaryAvatarWrap}>
                  <Image
                    src={photoPreview}
                    alt={displayName}
                    fill
                    sizes="112px"
                    className={styles.summaryAvatar}
                    unoptimized
                  />
                </div>
                <div className={styles.summaryInfo}>
                  <h2>{loading ? '...' : displayName}</h2>
                  <div className={styles.summaryPhone}>
                    <PhoneOutlined fontSize="small" />
                    <span>{member?.memberPhone || '—'}</span>
                  </div>
                  {displayRole === 'ADMIN' ? (
                    <Link href="/admin" className={styles.roleBadge} title="Go to Admin Panel">
                      {displayRole}
                    </Link>
                  ) : (
                    <span className={styles.roleBadge}>{displayRole}</span>
                  )}
                </div>
              </div>

              <div className={styles.sidebarSections}>
                {sidebarSections.map((section) => (
                  <div key={section.title} className={styles.sidebarSection}>
                    <h3>{section.title}</h3>
                    <div className={styles.sidebarMenu}>
                      {section.items
                        .filter((item) => !item.agentOnly || member?.memberType === 'AGENT')
                        .map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href ? pathname === item.href : false;

                        if (item.action === 'logout') {
                          return (
                            <button key={item.label} type="button" onClick={handleLogout} className={styles.sidebarAction}>
                              <span className={styles.sidebarLinkMain}>
                                <span className={styles.sidebarActionIcon}><Icon fontSize="small" /></span>
                                <span>{item.label}</span>
                              </span>
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.label}
                            prefetch={false}
                            href={item.href ?? '/mypage'}
                            className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                          >
                            <span className={styles.sidebarLinkMain}>
                              <span className={styles.sidebarLinkIcon}><Icon fontSize="small" /></span>
                              <span>{item.label}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* ── Main form ── */}
            <section className={styles.mainCard}>
              {loading ? (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#6b7280' }}>Loading profile...</div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <div className={styles.photoSection}>
                    <h2>Photo</h2>
                    <div className={styles.photoRow}>
                      <div className={styles.photoPreviewWrap}>
                        <Image
                          src={photoPreview}
                          alt={displayName}
                          fill
                          sizes="320px"
                          className={styles.photoPreview}
                          unoptimized
                        />
                      </div>

                      <div className={styles.uploadColumn}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className={styles.hiddenInput}
                          onChange={handlePhotoSelect}
                        />
                        <button
                          type="button"
                          className={styles.uploadButton}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadOutlined />
                          <span>Upload Profile Image</span>
                        </button>
                        <p>A photo must be in JPG, JPEG or PNG format!</p>
                        {pendingFile && (
                          <p style={{ color: '#0052da', fontSize: '0.85rem', marginTop: 6 }}>
                            New image selected — save to apply.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.fieldGrid}>
                    <label className={styles.field}>
                      <span>Username</span>
                      <input
                        type="text"
                        name="nick"
                        value={form.nick}
                        onChange={handleChange}
                        placeholder="Your username"
                      />
                    </label>

                    <label className={styles.field}>
                      <span>Phone</span>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                    </label>
                  </div>

                  <label className={`${styles.field} ${styles.fullWidthField}`}>
                    <span>Address</span>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Your address"
                    />
                  </label>

                  <label className={`${styles.field} ${styles.fullWidthField}`}>
                    <span>Email*</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                    />
                  </label>

                  <div className={styles.submitRow}>
                    <button type="submit" className={styles.submitButton} disabled={saving}>
                      <span>{saving ? 'Saving...' : 'Update Profile'}</span>
                      <ArrowOutwardRounded fontSize="small" />
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
