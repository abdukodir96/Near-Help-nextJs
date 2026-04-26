'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  BoltRounded,
  ChatBubbleOutlineRounded,
  EditNoteOutlined,
  FavoriteBorderRounded,
  FavoriteRounded,
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
  AccessTimeOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_FAVORITES, LIKE_SERVICE } from '@/lib/graphql/queries';
import styles from './my-favorites.module.scss';

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
      { label: 'Write Article', href: '/community', icon: EditNoteOutlined },
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

type BackendService = {
  _id: string; serviceCategory: string; serviceOption: string; serviceTitle: string;
  servicePrice: number; serviceViews: number; serviceLikes: number; serviceArea?: string;
  serviceImages?: string[]; serviceDesc?: string; memberData?: { memberNick: string };
};

const getImageUrl = (images?: string[]) => {
  if (!images?.length) return '/theme/images/service/1.jpg';
  const img = images[0];
  if (img.startsWith('http')) return img;
  return `http://localhost:3007${img}`;
};

export const MyFavorites = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, refetch } = useQuery<{ getFavorites: { list: BackendService[]; meta: { totalCount: number } } }>(GET_FAVORITES, {
    variables: { input: { page, limit: ITEMS_PER_PAGE } },
    fetchPolicy: 'cache-and-network',
  });

  const favorites = data?.getFavorites?.list ?? [];
  const totalCount = data?.getFavorites?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const pageItems = favorites;

  const [unlikeService] = useMutation(LIKE_SERVICE);

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    await Swal.fire({ icon: 'success', title: 'Logged out', confirmButtonColor: '#0052da' });
    router.push('/auth/login');
  };

  const checkAuth = async () => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'You need to be logged in to perform this action.',
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0052da',
        cancelButtonColor: '#6b7280',
      }).then((result) => {
        if (result.isConfirmed) router.push('/auth/login');
      });
      return false;
    }
    return true;
  };

  const handleUnfavorite = async (id: string) => {
    const authed = await checkAuth();
    if (!authed) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Remove from favorites?',
      text: 'This service will be removed from your favorites list.',
      showCancelButton: true,
      confirmButtonColor: '#ef5a3c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await unlikeService({ variables: { input: { likeRefId: id } } }).catch(() => {});
      refetch();
      if (pageItems.length === 1 && page > 1) setPage((p) => p - 1);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>My Favorites</h1>
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
              {favorites.length === 0 ? (
                <div className={styles.empty}>
                  <FavoriteBorderRounded className={styles.emptyIcon} />
                  <p>No favorite services yet.</p>
                </div>
              ) : (
                <>
                  <div className={styles.cardGrid}>
                    {(pageItems as BackendService[]).map((item) => {
                      const isTop = item.serviceLikes >= TOP_LIKES_THRESHOLD;
                      return (
                        <article key={item._id} className={styles.card}>
                          <div className={styles.cardImageWrap}>
                            <Image
                              src={getImageUrl(item.serviceImages)}
                              alt={item.serviceTitle}
                              fill
                              sizes="(max-width:768px) 100vw, 33vw"
                              className={styles.cardImage}
                            />
                            {isTop && (
                              <span className={styles.topBadge}>
                                <BoltRounded fontSize="inherit" /> TOP
                              </span>
                            )}
                            <span className={styles.priceBadge}>₩{Math.round(item.servicePrice / 1000)}k</span>
                          </div>

                          <div className={styles.cardBody}>
                            <h3 className={styles.cardTitle}>{item.serviceTitle}</h3>
                            {item.serviceArea && (
                              <p className={styles.cardLocation}>
                                <PlaceOutlined fontSize="small" />
                                {item.serviceArea}
                              </p>
                            )}

                            <div className={styles.statsRow}>
                              <span className={styles.stat}>
                                <PlaceOutlined fontSize="small" />
                                <span>{item.serviceOption}</span>
                              </span>
                              <span className={styles.statDivider} />
                              <span className={styles.stat}>
                                <VisibilityOutlined fontSize="small" />
                                <span>{item.serviceViews}</span>
                              </span>
                            </div>

                            <div className={styles.cardActions}>
                              <span className={styles.viewCount}>
                                <VisibilityOutlined fontSize="small" />
                                {item.serviceViews}
                              </span>
                              <button
                                type="button"
                                className={styles.heartBtn}
                                onClick={() => handleUnfavorite(item._id)}
                                aria-label="Remove from favorites"
                              >
                                <FavoriteRounded fontSize="small" />
                                  <span>{item.baseLikes}</span>
                                </button>
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

                  <p className={styles.totalCount}>Total {favorites.length} favorite services</p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
