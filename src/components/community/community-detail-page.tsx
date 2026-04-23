'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { ChatCenteredText, Eye, Heart, NotePencil, Sparkle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { communityCategories, type CommunityPost } from './community-data';
import styles from './community-detail-page.module.scss';

const authorAvatars: Record<string, string> = {
  Martin: '/theme/images/team/4.jpg',
  Neo: '/theme/images/blog/blog-avater/img-1.jpg',
  PNU: '/theme/images/blog/blog-avater/img-2.jpg',
  Soomin: '/theme/images/blog/blog-avater/img-3.jpg',
  'Ara Kim': '/theme/images/blog-details/comments-author/img-1.jpg',
  'Yuna Park': '/theme/images/blog-details/comments-author/img-2.jpg',
  'NearHelp Team': '/theme/images/blog-details/author.jpg',
  Joon: '/theme/images/blog-details/comments-author/img-3.jpg',
  Mina: '/theme/images/testimonial/img-2.jpg',
};

const getCommentCount = (post: CommunityPost) => Math.max(3, Math.round(post.likes / 3));

const formatArticleDate = (post: CommunityPost) => {
  const monthIndex = new Date(`${post.month} 1, 2026`).getMonth() + 1;
  return `${String(monthIndex).padStart(2, '0')}.${String(post.day).padStart(2, '0')}.26 14:38`;
};

const articleParagraphs = (post: CommunityPost) => [
  post.excerpt,
  'This board article is shared by the NearHelp community so homeowners can compare service experiences before making a booking decision. The goal is to keep repair stories practical, transparent, and useful for the next customer.',
  'When the backend article module is connected, this page will load the full article body, nested comments, likes, and view tracking from the API. For now, the page uses local showcase content that follows the final layout.',
];

export function CommunityDetailPageContent({ post }: { post: CommunityPost }) {
  const activeCategory = communityCategories.find((category) => category.key === post.category) ?? communityCategories[0];
  const authorAvatar = authorAvatars[post.author] ?? '/theme/images/blog-details/author.jpg';
  const comments = getCommentCount(post);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [viewCount, setViewCount] = useState(post.views);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (Cookies.get(ACCESS_TOKEN_KEY)) {
      setViewCount(post.views + 1);
    } else {
      setViewCount(post.views);
    }

    setLikeCount(post.likes);
    setLiked(false);
  }, [post.id, post.likes, post.views]);

  const handleLikeClick = async () => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please log in to like this community post.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLiked((currentLiked) => {
      setLikeCount((currentCount) => currentCount + (currentLiked ? -1 : 1));
      return !currentLiked;
    });
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
                <strong>Community</strong>
                <span>Board Article</span>
              </div>
            </div>

            <div className={styles.categoryList}>
              {communityCategories.map((category) => {
                const active = category.key === post.category;

                return (
                  <Link
                    prefetch={false}
                    key={category.key}
                    href="/community"
                    className={`${styles.categoryButton} ${active ? styles.categoryButtonActive : ''}`}
                  >
                    {category.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <p className={styles.eyebrow}>{activeCategory.heading}</p>
              <h1>{activeCategory.description}</h1>
            </div>

            <button type="button" className={styles.writeButton}>
              <NotePencil size={18} weight="bold" />
              Write
            </button>
          </div>

          <article className={styles.articleCard}>
            <header className={styles.articleHeader}>
              <div className={styles.titleBlock}>
                <h2>{post.title}</h2>
                <div className={styles.authorRow}>
                  <div className={styles.avatarWrap}>
                    <Image src={authorAvatar} alt={post.author} fill sizes="48px" className={styles.avatar} />
                  </div>
                  <strong>{post.author}</strong>
                  <span>{formatArticleDate(post)}</span>
                </div>
              </div>

              <div className={styles.articleStats}>
                <button
                  type="button"
                  className={`${styles.statButton} ${liked ? styles.statButtonActive : ''}`}
                  aria-label={`Like ${post.title}`}
                  aria-pressed={liked}
                  onClick={handleLikeClick}
                >
                  <Heart size={26} weight={liked ? 'fill' : 'regular'} />
                  {likeCount}
                </button>
                <span>
                  <Eye size={28} weight="fill" />
                  {viewCount}
                </span>
                <span>
                  <ChatCenteredText size={28} weight="fill" />
                  {comments}
                </span>
              </div>
            </header>

            <div className={styles.articleBody}>
              <p className={styles.kicker}>{post.title === 'Coming soon' ? 'New Era' : activeCategory.label}</p>

              <div className={styles.heroImageWrap}>
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 1180px) 100vw, 960px" className={styles.heroImage} priority />
              </div>

              <div className={styles.copyBlock}>
                {articleParagraphs(post).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
