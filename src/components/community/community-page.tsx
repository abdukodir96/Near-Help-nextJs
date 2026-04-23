'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, Heart, NotePencil, Sparkle } from 'phosphor-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { communityCategories, communityPosts, type CommunityCategoryKey } from './community-data';
import styles from './community-page.module.scss';

export function CommunityPageContent() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CommunityCategoryKey>('free-board');
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const activeCategoryData = useMemo(
    () => communityCategories.find((category) => category.key === activeCategory) ?? communityCategories[0],
    [activeCategory],
  );

  const filteredPosts = useMemo(
    () => communityPosts.filter((post) => post.category === activeCategory),
    [activeCategory],
  );

  const openPost = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handlePostKeyDown = (event: KeyboardEvent<HTMLElement>, postId: string) => {
    if ((event.target as HTMLElement).closest('button')) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPost(postId);
    }
  };

  const handlePostLike = async (event: MouseEvent<HTMLButtonElement>, postId: string) => {
    event.preventDefault();
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

    setLikedPostIds((currentIds) =>
      currentIds.includes(postId) ? currentIds.filter((currentId) => currentId !== postId) : [...currentIds, postId],
    );
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
                <span>Community</span>
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

            <button type="button" className={styles.writeButton}>
              <NotePencil size={18} weight="bold" />
              Write
            </button>
          </div>

          <div className={styles.grid}>
            {filteredPosts.map((post) => {
              const liked = likedPostIds.includes(post.id);
              const likeCount = post.likes + (liked ? 1 : 0);

              return (
                <article
                  key={post.id}
                  className={styles.postCard}
                  role="link"
                  tabIndex={0}
                  aria-label={`Open ${post.title}`}
                  onClick={() => openPost(post.id)}
                  onKeyDown={(event) => handlePostKeyDown(event, post.id)}
                >
                  <div className={styles.imageWrap}>
                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 33vw" className={styles.image} />
                    <div className={styles.dateBadge}>
                      <span>{post.month}</span>
                      <strong>{post.day}</strong>
                    </div>
                  </div>

                  <div className={styles.postBody}>
                    <div className={styles.postHead}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p>{post.excerpt}</p>
                    </div>

                    <div className={styles.statsRow}>
                      <span>
                        <Eye size={22} weight="duotone" />
                        {post.views}
                      </span>
                      <button
                        type="button"
                        className={`${styles.likeButton} ${liked ? styles.likeButtonActive : ''}`}
                        aria-label={`Like ${post.title}`}
                        aria-pressed={liked}
                        onClick={(event) => handlePostLike(event, post.id)}
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
        </section>
      </div>
    </main>
  );
}
