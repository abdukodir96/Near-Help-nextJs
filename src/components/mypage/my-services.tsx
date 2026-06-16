'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  DeleteOutlineRounded,
  EditNoteOutlined,
  FavoriteBorderRounded,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  LogoutRounded,
  ModeEditOutlined,
  NavigateBeforeRounded,
  NavigateNextRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_ME } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';
import { serviceItems } from '@/components/services/services-data';
import styles from './my-services.module.scss';

type SidebarItem = {
  label: string;
  href?: string;
  icon: typeof AddCircleOutlineRounded;
  action?: 'logout';
  agentOnly?: boolean;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'Manage Services',
    items: [
      { label: 'Add Service', href: '/mypage/services/new', icon: AddCircleOutlineRounded, agentOnly: true },
      { label: 'My Services', href: '/mypage/services', icon: HomeWorkOutlined, agentOnly: true },
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
      { label: 'Write Article', href: '/blog', icon: EditNoteOutlined, agentOnly: true },
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

type ServiceStatus = 'ACTIVE' | 'INACTIVE';

const myServiceRows = serviceItems.map((service, index) => ({
  ...service,
  datePublished: [
    '17 February, 2026',
    '19 May, 2024',
    '19 May, 2024',
    '19 May, 2024',
    '03 January, 2025',
    '15 March, 2025',
    '22 June, 2024',
    '08 August, 2024',
  ][index] ?? '01 January, 2024',
  status: 'ACTIVE' as ServiceStatus,
  views: [2, 1, 1, 2, 3, 1, 4, 2][index] ?? 1,
}));

const ITEMS_PER_PAGE = 4;

export const MyServices = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(myServiceRows);

  const { data: meData } = useQuery<{ getMember: { memberNick: string; memberFullName?: string; memberImage?: string; memberPhone?: string; memberType: string } }>(GET_ME, { fetchPolicy: 'network-only' });
  const member = meData?.getMember;
  const displayName = member?.memberFullName || member?.memberNick || '—';
  const memberImage = member?.memberImage ? getAssetUrl(member.memberImage) : '/theme/images/team/2.jpg';

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const pageRows = rows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

  const handleEdit = (slug: string) => {
    router.push(`/mypage/services/edit/${slug}`);
  };

  const handleDelete = async (slug: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure to delete this service?',
      text: 'The service will be deactivated and hidden from listings.',
      showCancelButton: true,
      confirmButtonColor: '#ef5a3c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setRows((prev) =>
        prev.map((r) => (r.slug === slug ? { ...r, status: 'INACTIVE' as ServiceStatus } : r)),
      );
      await Swal.fire({
        icon: 'success',
        title: 'Service deactivated',
        text: 'The service status has been changed to Inactive.',
        confirmButtonColor: '#0052da',
      });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>My Services</h1>
            <p>We are glad to see you again!</p>
          </header>

          <div className={styles.contentGrid}>
            <aside className={styles.sidebarCard}>
              <div className={styles.profileSummary}>
                <div className={styles.summaryAvatarWrap}>
                  <Image
                    src={memberImage}
                    alt={displayName}
                    fill
                    sizes="106px"
                    className={styles.summaryAvatar}
                    unoptimized
                  />
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
                            href={item.href ?? '/mypage'}
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
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.colTitle}>Listing title</th>
                      <th className={styles.colDate}>Date Published</th>
                      <th className={styles.colStatus}>Status</th>
                      <th className={styles.colView}>View</th>
                      <th className={styles.colAction}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <tr key={row.slug} className={styles.tableRow}>
                        <td className={styles.colTitle}>
                          <div className={styles.serviceCell}>
                            <div className={styles.serviceThumb}>
                              <Image
                                src={row.image}
                                alt={row.title}
                                fill
                                sizes="88px"
                                className={styles.serviceThumbImg}
                              />
                            </div>
                            <div className={styles.serviceInfo}>
                              <strong>{row.title}</strong>
                              <span>{row.category}</span>
                              <em>{row.priceLabel}</em>
                            </div>
                          </div>
                        </td>
                        <td className={styles.colDate}>{row.datePublished}</td>
                        <td className={styles.colStatus}>
                          <span className={`${styles.statusBadge} ${row.status === 'INACTIVE' ? styles.statusInactive : ''}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className={styles.colView}>{row.views}</td>
                        <td className={styles.colAction}>
                          <div className={styles.actionButtons}>
                            <button
                              type="button"
                              className={styles.editBtn}
                              aria-label={`Edit ${row.title}`}
                              onClick={() => handleEdit(row.slug)}
                            >
                              <ModeEditOutlined fontSize="small" />
                            </button>
                            <button
                              type="button"
                              className={styles.deleteBtn}
                              aria-label={`Delete ${row.title}`}
                              onClick={() => handleDelete(row.slug)}
                            >
                              <DeleteOutlineRounded fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

              <p className={styles.totalCount}>{rows.length} service available</p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
