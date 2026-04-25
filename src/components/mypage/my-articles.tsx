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
  FavoriteRounded,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  LogoutRounded,
  NavigateBeforeRounded,
  NavigateNextRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import styles from './my-articles.module.scss';

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
      { label: 'Articles',      href: '/mypage/articles', icon: ArticleOutlined },
      { label: 'Write Article', href: '/community',       icon: EditNoteOutlined },
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

type Article = {
  id: number;
  slug: string;
  image: string;
  month: string;
  day: number;
  author: string;
  title: string;
  views: number;
  likes: number;
};

const initialArticles: Article[] = [
  { id: 1, slug: 'martin-coming-soon',      image: '/theme/images/projects/img-1.jpg', month: 'February', day: 17, author: 'Martin', title: 'Seoul Forest to visit',        views: 2, likes: 1 },
  { id: 2, slug: 'neo-same-day-repair',     image: '/theme/images/blog/img-2.jpg',      month: 'May',      day: 19, author: 'Martin', title: 'Hiking',                        views: 2, likes: 3 },
  { id: 3, slug: 'pnu-help-me',             image: '/theme/images/projects/img-3.jpg', month: 'May',      day: 19, author: 'Martin', title: 'Coming Soon',                   views: 1, likes: 3 },
  { id: 4, slug: 'soomin-gas-line-warning', image: '/theme/images/blog/img-1.jpg',      month: 'March',    day: 5,  author: 'Martin', title: 'Best plumbing tips for home',   views: 4, likes: 7 },
  { id: 5, slug: 'recommendation-kitchen', image: '/theme/images/blog/img-3.jpg',      month: 'April',    day: 12, author: 'Martin', title: 'How to maintain gas lines',     views: 3, likes: 5 },
  { id: 6, slug: 'recommendation-cleanup', image: '/theme/images/projects/img-2.jpg', month: 'January',  day: 28, author: 'Martin', title: 'Kitchen renovation guide',      views: 6, likes: 9 },
  { id: 7, slug: 'news-booking-update',    image: '/theme/images/projects/img-7.jpg',  month: 'April',    day: 22, author: 'Martin', title: 'Electric safety at home',       views: 2, likes: 4 },
  { id: 8, slug: 'news-agent-ranking',     image: '/theme/images/projects/img-9.jpg',  month: 'February', day: 3,  author: 'Martin', title: 'Water heater maintenance tips', views: 5, likes: 6 },
  { id: 9, slug: 'humor-plunger',          image: '/theme/images/projects/img-8.jpg', month: 'March',    day: 18, author: 'Martin', title: 'Basement plumbing essentials',  views: 3, likes: 2 },
];

const ITEMS_PER_PAGE = 6;

export const MyArticles = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const pageItems = articles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    await Swal.fire({ icon: 'success', title: 'Logged out', confirmButtonColor: '#0052da' });
    router.push('/auth/login');
  };

  const handleLike = (id: number) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a)),
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>Article</h1>
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

            {/* ── Cards ── */}
            <div className={styles.mainArea}>
              <div className={styles.cardGrid}>
                {pageItems.map((article) => (
                  <Link key={article.id} href={`/community/${article.slug}`} className={styles.card}>
                    {/* Image + date badge */}
                    <div className={styles.cardImageWrap}>
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className={styles.cardImage}
                      />
                      <div className={styles.dateBadge}>
                        <span className={styles.dateMonth}>{article.month}</span>
                        <span className={styles.dateDay}>{article.day}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <div className={styles.cardInfo}>
                          <span className={styles.cardAuthor}>{article.author}</span>
                          <span className={styles.cardTitle}>{article.title}</span>
                        </div>
                        <div className={styles.cardStats}>
                          <span className={styles.statItem}>
                            <VisibilityOutlined fontSize="small" />
                            {article.views}
                          </span>
                          <button
                            type="button"
                            className={styles.likeBtn}
                            onClick={(e) => { e.preventDefault(); handleLike(article.id); }}
                            aria-label="Like article"
                          >
                            <FavoriteRounded fontSize="small" />
                            {article.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
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

              <p className={styles.totalCount}>Total {articles.length} article(s) available</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
