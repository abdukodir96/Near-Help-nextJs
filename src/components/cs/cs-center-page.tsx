'use client';

import Link from 'next/link';
import { CaretDown } from 'phosphor-react';
import { useMemo, useState } from 'react';
import { csFaqCategories, csFaqItems, csNoticeItems, type CsFaqCategoryKey, type CsTab } from './cs-data';
import styles from './cs-center-page.module.scss';

export function CsCenterPage({ initialTab }: { initialTab: CsTab }) {
  const [activeCategory, setActiveCategory] = useState<CsFaqCategoryKey>('booking');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqItems = useMemo(() => csFaqItems[activeCategory], [activeCategory]);

  const selectCategory = (category: CsFaqCategoryKey) => {
    setActiveCategory(category);
    setOpenFaqIndex(null);
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <h1>Cs center</h1>
          <p>I will answer your questions</p>

          <nav className={styles.switcher} aria-label="Customer support tabs">
            <Link
              prefetch={false}
              href="/cs/notice"
              className={`${styles.switcherTab} ${initialTab === 'notice' ? styles.switcherTabActive : ''}`}
            >
              Notice
            </Link>
            <Link
              prefetch={false}
              href="/cs/faq"
              className={`${styles.switcherTab} ${initialTab === 'faq' ? styles.switcherTabActive : ''}`}
            >
              FAQ
            </Link>
          </nav>
        </header>

        {initialTab === 'notice' ? (
          <section className={styles.noticeSection} aria-labelledby="cs-notice-title">
            <h2 id="cs-notice-title">Notice</h2>

            <div className={styles.noticeTable} role="table" aria-label="Customer support notices">
              <div className={styles.noticeHead} role="rowgroup">
                <div className={styles.noticeRow} role="row">
                  <span role="columnheader">Number</span>
                  <span role="columnheader">Title</span>
                  <span role="columnheader">Date</span>
                </div>
              </div>

              <div role="rowgroup">
                {csNoticeItems.map((item) => (
                  <div
                    key={`${item.number}-${item.title}`}
                    className={`${styles.noticeRow} ${item.featured ? styles.noticeRowFeatured : ''}`}
                    role="row"
                  >
                    <span className={styles.noticeNumber} role="cell">
                      {item.number === 'event' ? <span className={styles.eventBadge}>event</span> : item.number}
                    </span>
                    <span className={styles.noticeTitle} role="cell">
                      {item.title}
                    </span>
                    <span className={styles.noticeDate} role="cell">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.faqSection} aria-labelledby="cs-faq-title">
            <h2 id="cs-faq-title" className={styles.srOnly}>
              Frequently asked questions
            </h2>

            <div className={styles.faqCategoryBar} role="tablist" aria-label="FAQ categories">
              {csFaqCategories.map((category) => {
                const active = category.key === activeCategory;

                return (
                  <button
                    key={category.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`${styles.faqCategoryButton} ${active ? styles.faqCategoryButtonActive : ''}`}
                    onClick={() => selectCategory(category.key)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className={styles.faqList}>
              {faqItems.map((item, index) => {
                const open = openFaqIndex === index;

                return (
                  <article key={item.question} className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.faqQuestion}
                      aria-expanded={open}
                      onClick={() => setOpenFaqIndex((current) => (current === index ? null : index))}
                    >
                      <span className={styles.faqBadge}>Q</span>
                      <span className={styles.faqQuestionText}>{item.question}</span>
                      <CaretDown size={20} weight="bold" className={`${styles.faqCaret} ${open ? styles.faqCaretOpen : ''}`} />
                    </button>

                    <div
                      className={`${styles.faqAnswerWrap} ${open ? styles.faqAnswerWrapOpen : ''}`}
                      aria-hidden={!open}
                    >
                      <div className={styles.faqAnswer}>
                        <span className={styles.faqAnswerBadge}>A</span>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
