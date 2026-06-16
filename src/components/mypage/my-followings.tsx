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
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_ME, GET_FOLLOWINGS, TOGGLE_FOLLOW } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';
import styles from './my-followings.module.scss';

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
      { label: 'Articles',     href: '/mypage/articles', icon: ArticleOutlined },
      { label: 'Write Article', href: '/blog',      icon: EditNoteOutlined, agentOnly: true },
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

type FollowingMember = {
  _id: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberFollowers: number;
  memberFollowings: number;
  memberLikes: number;
};

const ITEMS_PER_PAGE = 5;

export const MyFollowings = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: meData } = useQuery<{ getMember: { _id: string; memberNick: string; memberFullName?: string; memberImage?: string; memberPhone?: string; memberType: string } }>(GET_ME, { fetchPolicy: 'network-only' });
  const member = meData?.getMember;
  const displayName = member?.memberFullName || member?.memberNick || '—';
  const memberImage = member?.memberImage ? getAssetUrl(member.memberImage) : '/theme/images/team/2.jpg';

  const { data: followingsData, refetch } = useQuery<{ getMemberFollowings: { list: { followerId: string; followingData: FollowingMember }[]; metaCounter: { total: number } } }>(
    GET_FOLLOWINGS,
    {
      variables: { input: { page, limit: ITEMS_PER_PAGE, search: { followerId: member?._id } } },
      skip: !member?._id,
      fetchPolicy: 'network-only',
    },
  );
  const followings = (followingsData?.getMemberFollowings?.list ?? []).map((item) => item.followingData);
  const total = followingsData?.getMemberFollowings?.metaCounter?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const [toggleFollowMutation] = useMutation(TOGGLE_FOLLOW);

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

  const handleUnfollow = async (followingId: string) => {
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
      await toggleFollowMutation({ variables: { input: { targetMemberId: followingId } } }).catch(() => {});
      if (followings.length === 1 && page > 1) setPage((p) => p - 1);
      refetch();
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
                  <Image src={memberImage} alt={displayName} fill sizes="106px" className={styles.summaryAvatar} unoptimized />
                </div>
                <div className={styles.summaryInfo}>
                  <h2>{displayName}</h2>
                  <div className={styles.summaryPhone}>
                    <PhoneOutlined fontSize="small" />
                    <span>{member?.memberPhone || '—'}</span>
                  </div>
                  <span className={styles.roleBadge}>{member?.memberType || '—'}</span>
                </div>
              </div>

              <div className={styles.sidebarSections}>
                {sidebarSections.map((section) => (
                  <div key={section.title} className={styles.sidebarSection}>
                    <h3>{section.title}</h3>
                    <div className={styles.sidebarMenu}>
                      {section.items.filter((item) => !item.agentOnly || member?.memberType === 'AGENT').map((item) => {
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
                      followings.map((following) => {
                        const name = following.memberFullName || following.memberNick;
                        const avatar = following.memberImage ? getAssetUrl(following.memberImage) : null;
                        return (
                          <tr key={following._id} className={styles.tableRow}>
                            {/* Name */}
                            <td className={styles.colName}>
                              <div className={styles.nameCell}>
                                <div className={styles.avatarWrap}>
                                  {avatar ? (
                                    <Image src={avatar} alt={name} fill sizes="64px" className={styles.avatarImg} unoptimized />
                                  ) : (
                                    <span className={styles.avatarFallback}>
                                      <AccountCircleOutlined className={styles.avatarIcon} />
                                    </span>
                                  )}
                                </div>
                                <span className={styles.followingName}>{name}</span>
                              </div>
                            </td>

                            {/* Details */}
                            <td className={styles.colDetails}>
                              <div className={styles.detailsCell}>
                                <span className={styles.detailItem}>
                                  Followers <strong>({following.memberFollowers})</strong>
                                </span>
                                <span className={styles.detailItem}>
                                  Followings <strong>({following.memberFollowings})</strong>
                                </span>
                                <span className={styles.detailLikes}>
                                  <FavoriteOutlined fontSize="small" />
                                  {following.memberLikes}
                                </span>
                              </div>
                            </td>

                            {/* Subscription */}
                            <td className={styles.colSub}>
                              <div className={styles.subCell}>
                                <span className={styles.followingLabel}>Following</span>
                                <button
                                  type="button"
                                  onClick={() => handleUnfollow(following._id)}
                                  className={styles.unfollowBtn}
                                >
                                  Unfollow
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > 0 && (
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

                  <p className={styles.totalCount}>{total} followings</p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
