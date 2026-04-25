'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  EditNoteOutlined,
  FavoriteBorderRounded,
  FavoriteOutlined,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  LogoutRounded,
  NavigateBeforeRounded,
  NavigateNextRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import styles from './my-followings.module.scss';

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
      { label: 'Add Service',      href: '/mypage/services/new', icon: AddCircleOutlineRounded },
      { label: 'My Services',      href: '/mypage/services',     icon: HomeWorkOutlined },
      { label: 'My Favorites',     href: '/mypage/favorites',    icon: FavoriteBorderRounded },
      { label: 'Recently Visited', href: '/mypage/recent',       icon: HistoryOutlined },
      { label: 'My Followers',     href: '/mypage/followers',    icon: GroupOutlined },
      { label: 'My Followings',    href: '/mypage/followings',   icon: PersonAddAltOutlined },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Articles',     href: '/mypage/articles', icon: ArticleOutlined },
      { label: 'Write Article', href: '/community',      icon: EditNoteOutlined },
    ],
  },
  {
    title: 'Manage Account',
    items: [
      { label: 'My Profile', href: '/mypage', icon: AccountCircleOutlined },
      { label: 'Logout',     icon: LogoutRounded, action: 'logout' },
    ],
  },
];

type Following = {
  id: number;
  name: string;
  image: string | null;
  followersCount: number;
  followingsCount: number;
  likesCount: number;
};

const initialFollowings: Following[] = [
  { id: 1, name: 'David',         image: '/theme/images/team/1.jpg', followersCount: 2, followingsCount: 0, likesCount: 0  },
  { id: 2, name: 'Henry Barton',  image: '/theme/images/team/2.jpg', followersCount: 5, followingsCount: 3, likesCount: 8  },
  { id: 3, name: 'Winifred H.',   image: '/theme/images/team/3.jpg', followersCount: 3, followingsCount: 2, likesCount: 5  },
  { id: 4, name: 'Shelia L.',     image: '/theme/images/team/4.jpg', followersCount: 7, followingsCount: 1, likesCount: 12 },
  { id: 5, name: 'Elijah Foster', image: '/theme/images/team/1.jpg', followersCount: 4, followingsCount: 4, likesCount: 6  },
  { id: 6, name: 'Grace Kim',     image: '/theme/images/team/2.jpg', followersCount: 6, followingsCount: 2, likesCount: 9  },
];

const ITEMS_PER_PAGE = 5;

export const MyFollowings = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [followings, setFollowings] = useState(initialFollowings);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(followings.length / ITEMS_PER_PAGE);
  const pageItems = followings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

  const handleUnfollow = async (id: number) => {
    const authed = await checkAuth();
    if (!authed) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Unfollow this user?',
      text: 'They will be removed from your followings list.',
      showCancelButton: true,
      confirmButtonColor: '#c0706e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, unfollow',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setFollowings((prev) => prev.filter((f) => f.id !== id));
      if (pageItems.length === 1 && page > 1) setPage((p) => p - 1);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>Followings</h1>
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

            {/* ── Table ── */}
            <div className={styles.mainArea}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.colName}>Name</th>
                      <th className={styles.colDetails}>Details</th>
                      <th className={styles.colSub}>Subscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followings.length === 0 ? (
                      <tr>
                        <td colSpan={3} className={styles.emptyRow}>
                          You are not following anyone yet.
                        </td>
                      </tr>
                    ) : (
                      pageItems.map((following) => (
                        <tr key={following.id} className={styles.tableRow}>
                          {/* Name */}
                          <td className={styles.colName}>
                            <div className={styles.nameCell}>
                              <div className={styles.avatarWrap}>
                                {following.image ? (
                                  <Image src={following.image} alt={following.name} fill sizes="64px" className={styles.avatarImg} />
                                ) : (
                                  <span className={styles.avatarFallback}>
                                    <AccountCircleOutlined className={styles.avatarIcon} />
                                  </span>
                                )}
                              </div>
                              <span className={styles.followingName}>{following.name}</span>
                            </div>
                          </td>

                          {/* Details */}
                          <td className={styles.colDetails}>
                            <div className={styles.detailsCell}>
                              <span className={styles.detailItem}>
                                Followers <strong>({following.followersCount})</strong>
                              </span>
                              <span className={styles.detailItem}>
                                Followings <strong>({following.followingsCount})</strong>
                              </span>
                              <span className={styles.detailLikes}>
                                <FavoriteOutlined fontSize="small" />
                                {following.likesCount}
                              </span>
                            </div>
                          </td>

                          {/* Subscription */}
                          <td className={styles.colSub}>
                            <div className={styles.subCell}>
                              <span className={styles.followingLabel}>Following</span>
                              <button
                                type="button"
                                onClick={() => handleUnfollow(following.id)}
                                className={styles.unfollowBtn}
                              >
                                Unfollow
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {followings.length > 0 && (
                <>
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

                  <p className={styles.totalCount}>{followings.length} followings</p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
