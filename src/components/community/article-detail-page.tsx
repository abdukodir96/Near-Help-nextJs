'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChatCenteredText, Eye, Heart, NotePencil, Sparkle } from 'phosphor-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_ARTICLE, LIKE_ARTICLE } from '@/lib/graphql/queries';
import { communityCategories } from './community-data';
import styles from './community-detail-page.module.scss';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3007';

const getImageUrl = (img?: string) => {
  if (!img) return '/theme/images/blog/img-1.jpg';
  if (img.startsWith('http')) return img;
  return `${BACKEND_URL}${img}`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

type ArticleDetailPageProps = {
  articleId: string;
};

export function ArticleDetailPage({ articleId }: ArticleDetailPageProps) {
  const router = useRouter();
  const isLoggedIn = Boolean(Cookies.get(ACCESS_TOKEN_KEY));

  const [liked,     setLiked]     = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number | null>(null);

  type ArticleData = {
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

  // GET_ARTICLE with auth → backend auto-increments view for logged-in users
  const { data, loading, error } = useQuery<{ getArticle: ArticleData }>(GET_ARTICLE, {
    variables: { input: { articleId } },
    fetchPolicy: 'network-only',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [likeArticle] = useMutation<any>(LIKE_ARTICLE);

  const article = data?.getArticle;

  // Sync liked/likeCount from fetched data
  const currentLikedFromData = article?.meLiked ?? false;

  const handleLike = async () => {
    if (!isLoggedIn) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please log in to like this article.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    const prevLiked = liked ?? currentLikedFromData;
    setLiked(!prevLiked);
    setLikeCount((prev) => (prev ?? article?.articleLikes ?? 0) + (!prevLiked ? 1 : -1));

    try {
      const { data: res } = await likeArticle({ variables: { input: { targetArticleId: articleId } } });
      if (res?.likeTargetArticle) {
        const isFav = res.likeTargetArticle.myFavorite as boolean;
        setLiked(isFav);
        setLikeCount((prev) => {
          const base = article?.articleLikes ?? 0;
          return isFav ? base + 1 : base;
        });
      }
    } catch {
      setLiked(prevLiked);
      setLikeCount(article?.articleLikes ?? 0);
    }
  };

  // ── Skeleton ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <aside className={styles.sidebar}><div className={styles.communityCard} style={{ height: 360 }} /></aside>
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#6b7280' }}>Loading article...</div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <aside className={styles.sidebar}><SidebarCard /></aside>
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>Article not found.</p>
            <button
              type="button"
              onClick={() => router.push('/community')}
              style={{ marginTop: 16, padding: '10px 24px', background: '#0052da', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}
            >
              Back to Blog
            </button>
          </div>
        </div>
      </main>
    );
  }

  const currentLiked     = liked ?? currentLikedFromData;
  const currentLikeCount = likeCount ?? article.articleLikes;
  const authorName       = article.memberData?.memberFullName ?? article.memberData?.memberNick ?? 'Anonymous';
  const authorImage      = article.memberData?.memberImage
    ? getImageUrl(article.memberData.memberImage)
    : '/theme/images/team/2.jpg';

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <SidebarCard />
        </aside>

        <section className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <p className={styles.eyebrow}>Blog Article</p>
              <h1>Share your ideas with the community</h1>
            </div>
            <button
              type="button"
              className={styles.writeButton}
              onClick={() => router.push('/community/write')}
            >
              <NotePencil size={18} weight="bold" />
              Write
            </button>
          </div>

          <article className={styles.articleCard}>
            <header className={styles.articleHeader}>
              <div className={styles.titleBlock}>
                <h2>{article.articleTitle}</h2>
                <div className={styles.authorRow}>
                  <div className={styles.authorLink}>
                    <div className={styles.avatarWrap}>
                      <Image src={authorImage} alt={authorName} fill sizes="48px" className={styles.avatar} unoptimized />
                    </div>
                    <strong>{authorName}</strong>
                  </div>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>

              <div className={styles.articleStats}>
                {/* Like button — real API */}
                <button
                  type="button"
                  className={`${styles.statButton} ${currentLiked ? styles.statButtonActive : ''}`}
                  aria-label="Like this article"
                  aria-pressed={currentLiked}
                  onClick={handleLike}
                >
                  <Heart size={26} weight={currentLiked ? 'fill' : 'regular'} />
                  {currentLikeCount}
                </button>

                {/* View count — auto-incremented by backend for logged-in users */}
                <span>
                  <Eye size={28} weight="fill" />
                  {article.articleViews}
                </span>

                <span>
                  <ChatCenteredText size={28} weight="fill" />
                  {article.articleComments}
                </span>
              </div>
            </header>

            <div className={styles.articleBody}>
              <p className={styles.kicker}>{article.articleCategory}</p>

              <div className={styles.heroImageWrap}>
                <Image
                  src={getImageUrl(article.articleImage)}
                  alt={article.articleTitle}
                  fill
                  sizes="(max-width: 1180px) 100vw, 960px"
                  className={styles.heroImage}
                  priority
                  unoptimized
                />
              </div>

              <div className={styles.copyBlock}>
                {(article.articleContent ?? '').split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function SidebarCard() {
  return (
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
        {communityCategories.map((cat) => (
          <Link
            key={cat.key}
            href="/community"
            prefetch={false}
            className={styles.categoryButton}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
