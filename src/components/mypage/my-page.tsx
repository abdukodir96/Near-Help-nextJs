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
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import styles from './my-page.module.scss';

type ProfileFormState = {
  username: string;
  phone: string;
  address: string;
};

type SidebarItem = {
  label: string;
  href?: string;
  icon: typeof AddCircleOutlineRounded;
  action?: 'logout';
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const defaultProfile = {
  name: 'Martin',
  phone: '01024694424',
  role: 'AGENT',
  image: '/theme/images/team/2.jpg',
  address: 'Busan, South Korea',
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'Manage Services',
    items: [
      { label: 'Add Service', href: '/services', icon: AddCircleOutlineRounded },
      { label: 'My Services', href: '/mypage/services', icon: HomeWorkOutlined },
      { label: 'My Favorites', href: '/mypage/favorites', icon: FavoriteBorderRounded },
      { label: 'Recently Visited', href: '/mypage/recent', icon: HistoryOutlined },
      { label: 'My Followers', href: '/mypage/followers', icon: GroupOutlined },
      { label: 'My Followings', href: '/mypage/followings', icon: PersonAddAltOutlined },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Articles', href: '/mypage/articles', icon: ArticleOutlined },
      { label: 'Write Article', href: '/blog', icon: EditNoteOutlined },
    ],
  },
  {
    title: 'Manage Account',
    items: [
      { label: 'My Profile', href: '/mypage', icon: AccountCircleOutlined },
      { label: 'Logout', icon: LogoutRounded, action: 'logout' },
    ],
  },
];

export const MyPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedUrlRef = useRef<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState(defaultProfile.image);
  const [form, setForm] = useState<ProfileFormState>({
    username: defaultProfile.name,
    phone: defaultProfile.phone,
    address: defaultProfile.address,
  });

  useEffect(() => {
    return () => {
      if (uploadedUrlRef.current) {
        URL.revokeObjectURL(uploadedUrlRef.current);
      }
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid image file',
        text: 'Please upload a JPG, JPEG, or PNG image for your profile.',
        confirmButtonColor: '#0052da',
      });
      event.target.value = '';
      return;
    }

    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    uploadedUrlRef.current = objectUrl;
    setPhotoPreview(objectUrl);
    event.target.value = '';

    await Swal.fire({
      icon: 'success',
      title: 'Image selected',
      text: 'Your new profile image preview is ready. Save your profile when you are done.',
      confirmButtonColor: '#0052da',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.username.trim() || !form.phone.trim() || !form.address.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Complete your profile',
        text: 'Please fill in your username, phone number, and address before updating.',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'Profile updated',
      text: 'Your profile changes have been saved locally. We can connect this form to the backend next.',
      confirmButtonColor: '#0052da',
    });
  };

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);

    await Swal.fire({
      icon: 'success',
      title: 'Logged out',
      text: 'You have been logged out successfully.',
      confirmButtonColor: '#0052da',
    });

    router.push('/auth/login');
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>My Profile</h1>
            <p>We are glad to see you again!</p>
          </header>

          <div className={styles.contentGrid}>
            <aside className={styles.sidebarCard}>
              <div className={styles.profileSummary}>
                <div className={styles.summaryAvatarWrap}>
                  <Image
                    src={photoPreview}
                    alt={form.username}
                    fill
                    sizes="112px"
                    className={styles.summaryAvatar}
                    unoptimized={photoPreview.startsWith('blob:')}
                  />
                </div>
                <div className={styles.summaryInfo}>
                  <h2>{form.username}</h2>
                  <div className={styles.summaryPhone}>
                    <PhoneOutlined fontSize="small" />
                    <span>{form.phone}</span>
                  </div>
                  <span className={styles.roleBadge}>{defaultProfile.role}</span>
                </div>
              </div>

              <div className={styles.sidebarSections}>
                {sidebarSections.map((section) => (
                  <div key={section.title} className={styles.sidebarSection}>
                    <h3>{section.title}</h3>
                    <div className={styles.sidebarMenu}>
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href ? pathname === item.href : false;

                        if (item.action === 'logout') {
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={handleLogout}
                              className={styles.sidebarAction}
                            >
                              <span className={styles.sidebarLinkMain}>
                                <span className={styles.sidebarActionIcon}>
                                  <Icon fontSize="small" />
                                </span>
                                <span>{item.label}</span>
                              </span>
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.label}
                            prefetch={false}
                            href={item.href || '/mypage'}
                            className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                          >
                            <span className={styles.sidebarLinkMain}>
                              <span className={styles.sidebarLinkIcon}>
                                <Icon fontSize="small" />
                              </span>
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

            <section className={styles.mainCard}>
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.photoSection}>
                  <h2>Photo</h2>
                  <div className={styles.photoRow}>
                    <div className={styles.photoPreviewWrap}>
                      <Image
                        src={photoPreview}
                        alt={form.username}
                        fill
                        sizes="320px"
                        className={styles.photoPreview}
                        unoptimized={photoPreview.startsWith('blob:')}
                      />
                    </div>

                    <div className={styles.uploadColumn}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        className={styles.hiddenInput}
                        onChange={handlePhotoUpload}
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
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Username</span>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
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
                  />
                </label>

                <div className={styles.submitRow}>
                  <button type="submit" className={styles.submitButton}>
                    <span>Update Profile</span>
                    <ArrowOutwardRounded fontSize="small" />
                  </button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
