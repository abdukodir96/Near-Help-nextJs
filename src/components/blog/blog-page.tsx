'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, Heart, NotePencil, Sparkle } from 'phosphor-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_ARTICLES, LIKE_ARTICLE } from '@/lib/graphql/queries';
import { communityCategories, type CommunityCategoryKey } from './blog-data';
import styles from './blog-page.module.scss';

type BackendArticle = {
  _id: string;
  articleCategory: string;
  articleTitle: string;
  articleContent: string;
  articleImage?: string;
  articleViews: number;
  articleLikes: number;
  articleComments: number;
  meLiked?: boolean;
  createdAt: string;
  memberData?: { _id: string; memberNick: string; memberFullName?: string; memberImage?: string };
};

const categoryMap: Record<CommunityCategoryKey, string> = {
  'free-board':    'FREE',
  'recommendation': 'RECOMMEND',
  'news':          'NEWS',
  'humor':         'HUMOR',
};

const getImageUrl = (img?: string) => {
  if (!img) return '/theme/images/blog/img-1.jpg';
  if (img.startsWith('http')) return img;
  return `http://localhost:3007${img}`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    month: d.toLocaleString('en', { month: 'long' }),
    day:   d.getDate().toString(),
  };
};

export function BlogPageContent() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CommunityCategoryKey>('free-board');
  const [likedMap,       setLikedMap]       = useState<Record<string, boolean>>({});

  const activeCategoryData = useMemo(
    () => communityCategories.find((c) => c.key === activeCategory) ?? communityCategories[0],
    [activeCategory],
  );

  const { data, loading } = useQuery<{ getArticles: { list: BackendArticle[]; metaCounter: { total: number }[] } }>(
    GET_ARTICLES,
    {
      variables: {
        input: {
          page:  1,
          limit: 12,
          search: { articleCategory: categoryMap[activeCategory] },
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const articles = data?.getArticles?.list ?? [];

  const [likeArticle] = useMutation(LIKE_ARTICLE);

  const openPost = (id: string) => router.push(`/blog/${id}`);

  const handlePostKeyDown = (event: KeyboardEvent<HTMLElement>, id: string) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPost(id); }
  };

  const handlePostLike = async (event: MouseEvent, id: string) => {
    event.stopPropagation();

    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please log in to like a community post.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const { data: res } = await likeArticle({ variables: { input: { targetArticleId: id } } });
      if (res?.likeTargetArticle) {
        setLikedMap((prev) => ({ ...prev, [id]: res.likeTargetArticle.myFavorite }));
      }
    } catch { /* silently fail */ }
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <div className={styles.communityCard}>
            <div className={styles.brandRow}>
              <div className={styles.brandBadge}>
                <Sparkle size={34} weight="duotone" />
                <span>NearHelp</span>
              </div>
              <div className={styles.brandCopy}>
                <strong>NearHelp</strong>
                <span>Blog</span>
              </div>
            </div>

            <div className={styles.categoryList}>
              {communityCategories.map((category) => {
                const active = category.key === activeCategory;
                return (
                  <button
                    key={category.key}
                    type="button"
                    className={`${styles.categoryButton} ${active ? styles.categoryButtonActive : ''}`}
                    onClick={() => setActiveCategory(category.key)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.headerRow}>
            <div className={styles.headingBlock}>
              <p className={styles.eyebrow}>{activeCategoryData.heading}</p>
              <h1>{activeCategoryData.description}</h1>
            </div>
            <button type="button" className={styles.writeButton} onClick={() => router.push('/blog/write')} >
              <NotePencil size={18} weight="bold" />
              Write
            </button>
          </div>

          {loading && articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>Loading posts...</div>
          ) : (
            <div className={styles.grid}>
              {articles.map((article) => {
                const liked     = likedMap[article._id] ?? article.meLiked ?? false;
                const likeCount = article.articleLikes + (liked && !article.meLiked ? 1 : 0);
                const { month, day } = formatDate(article.createdAt);

                return (
                  <article
                    key={article._id}
                    className={styles.postCard}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open ${article.articleTitle}`}
                    onClick={() => openPost(article._id)}
                    onKeyDown={(e) => handlePostKeyDown(e, article._id)}
                  >
                    <div className={styles.imageWrap}>
                      <Image
                        src={getImageUrl(article.articleImage)}
                        alt={article.articleTitle}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 33vw"
                        className={styles.image}
                      />
                      <div className={styles.dateBadge}>
                        <span>{month}</span>
                        <strong>{day}</strong>
                      </div>
                    </div>

                    <div className={styles.postBody}>
                      <div className={styles.postHead}>
                        <h2 className={styles.postTitle}>{article.articleTitle}</h2>
                        <p>{article.articleContent.slice(0, 100)}...</p>
                      </div>

                      <div className={styles.statsRow}>
                        <span>
                          <Eye size={22} weight="duotone" />
                          {article.articleViews}
                        </span>
                        <button
                          type="button"
                          className={`${styles.likeButton} ${liked ? styles.likeButtonActive : ''}`}
                          aria-label={`Like ${article.articleTitle}`}
                          aria-pressed={liked}
                          onClick={(e) => handlePostLike(e, article._id)}
                        >
                          <Heart size={22} weight={liked ? 'fill' : 'regular'} />
                          {likeCount}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
