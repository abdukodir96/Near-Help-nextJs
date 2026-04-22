'use client';

import Image from 'next/image';
import { Eye, Heart, NotePencil, Sparkle } from 'phosphor-react';
import { useMemo, useState } from 'react';
import { communityCategories, communityPosts, type CommunityCategoryKey } from './community-data';
import styles from './community-page.module.scss';

export function CommunityPageContent() {
  const [activeCategory, setActiveCategory] = useState<CommunityCategoryKey>('free-board');

  const activeCategoryData = useMemo(
    () => communityCategories.find((category) => category.key === activeCategory) ?? communityCategories[0],
    [activeCategory],
  );

  const filteredPosts = useMemo(
    () => communityPosts.filter((post) => post.category === activeCategory),
    [activeCategory],
  );

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
            {filteredPosts.map((post) => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.imageWrap}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 33vw" className={styles.image} />
                  <div className={styles.dateBadge}>
                    <span>{post.month}</span>
                    <strong>{post.day}</strong>
                  </div>
                </div>

                <div className={styles.postBody}>
                  <div className={styles.postHead}>
                    <strong>{post.author}</strong>
                    <p>{post.excerpt}</p>
                  </div>

                  <div className={styles.statsRow}>
                    <span>
                      <Eye size={22} weight="duotone" />
                      {post.views}
                    </span>
                    <span>
                      <Heart size={22} weight="regular" />
                      {post.likes}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
