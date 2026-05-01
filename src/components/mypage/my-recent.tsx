'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccessTimeOutlined,
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  BoltRounded,
  EditNoteOutlined,
  FavoriteBorderRounded,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  LogoutRounded,
  NavigateBeforeRounded,
  NavigateNextRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
  PlaceOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { serviceItems } from '@/components/services/services-data';
import styles from './my-recent.module.scss';

type SidebarItem = {
  label: string;
  href?: string;
  icon: typeof AddCircleOutlineRounded;
  action?: 'logout';
};
type SidebarSection = { title: string; items: SidebarItem[] };

const defaultProfile = {
  name: 'Martin',
  phone: '01024694424',
  role: 'AGENT',
  image: '/theme/images/team/2.jpg',
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'Manage Services',
    items: [
      { label: 'Add Service', href: '/mypage/services/new', icon: AddCircleOutlineRounded },
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

const TOP_LIKES_THRESHOLD = 20;
const ITEMS_PER_PAGE = 6;

export const MyRecent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(serviceItems.length / ITEMS_PER_PAGE);
  const pageItems = serviceItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    await Swal.fire({ icon: 'success', title: 'Logged out', confirmButtonColor: '#0052da' });
    router.push('/auth/login');
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>Recently Visited</h1>
            <p>We are glad to see you again!</p>
          </header>

          <div className={styles.contentGrid}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebarCard}>
              <div className={styles.profileSummary}>
                <div className={styles.summaryAvatarWrap}>
                  <Image src={defaultProfile.image} alt={defaultProfile.name} fill sizes="106px" className={styles.summaryAvatar} />
                </div>
                <div className={styles.summaryInfo}>
                  <h2>{defaultProfile.name}</h2>
                  <div className={styles.summaryPhone}>
                    <PhoneOutlined fontSize="small" />
                    <span>{defaultProfile.phone}</span>
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
                            <button key={item.label} type="button" onClick={handleLogout} className={styles.sidebarAction}>
                              <span className={styles.sidebarLinkMain}>
                                <span className={styles.sidebarActionIcon}><Icon fontSize="small" /></span>
                                <span>{item.label}</span>
                              </span>
                            </button>
                          );
                        }

                        return (
                          <Link key={item.label} href={item.href ?? '/mypage'} className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}>
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

            {/* ── Cards grid ── */}
            <div className={styles.mainArea}>
              <div className={styles.cardGrid}>
                {pageItems.map((item) => {
                  const isTop = item.baseLikes >= TOP_LIKES_THRESHOLD;
                  const hasStandard = item.options.includes('STANDARD');
                  const hasPremium = item.options.includes('PREMIUM');
                  const hasEmergency = item.options.includes('EMERGENCY');

                  return (
                    <article key={item.slug} className={styles.card}>
                      {/* Image */}
                      <div className={styles.cardImageWrap}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className={styles.cardImage}
                        />
                        {isTop && (
                          <span className={styles.topBadge}>
                            <BoltRounded fontSize="inherit" /> TOP
                          </span>
                        )}
                        <span className={styles.priceBadge}>{item.priceLabel}</span>
                      </div>

                      {/* Body */}
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardLocation}>
                          {item.category}, {item.locations[0]}
                        </p>

                        {/* Stats row */}
                        <div className={styles.statsRow}>
                          <span className={styles.stat}>
                            <AccessTimeOutlined fontSize="small" />
                            <span>{item.responseTime.split('/')[0].trim()}</span>
                          </span>
                          <span className={styles.statDivider} />
                          <span className={styles.stat}>
                            <PlaceOutlined fontSize="small" />
                            <span>{item.locations.length} loc</span>
                          </span>
                          <span className={styles.statDivider} />
                          <span className={styles.stat}>
                            <VisibilityOutlined fontSize="small" />
                            <span>{item.baseViews}</span>
                          </span>
                        </div>

                        {/* Options row — like Rent/Barter in screenshot */}
                        <div className={styles.optionsRow}>
                          <span className={hasStandard ? styles.optionActive : styles.optionMuted}>Standard</span>
                          <span className={hasPremium ? styles.optionActive : styles.optionMuted}>Premium</span>
                          <span className={hasEmergency ? styles.optionActive : styles.optionMuted}>Emergency</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pagePrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <NavigateBeforeRounded fontSize="small" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPage(num)}
                    className={`${styles.pageBtn} ${num === page ? styles.pageBtnActive : ''}`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  className={styles.pageNext}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <span>Next</span>
                  <NavigateNextRounded fontSize="small" />
                </button>
              </div>

              <p className={styles.totalCount}>Total {serviceItems.length} recently visited services</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
