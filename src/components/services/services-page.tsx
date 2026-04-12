'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaretLeft, CaretRight } from 'phosphor-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './services-page.module.scss';

const serviceItems = [
  {
    slug: 'emergency-plumbing',
    image: '/theme/images/service/1.jpg',
    title: 'Emergency plumbing',
    category: 'PLUMBING',
    description:
      'Rapid response for burst pipes, severe leaks, blocked drains, and urgent water damage before things get worse.',
  },
  {
    slug: 'water-heater-support',
    image: '/theme/images/service/2.jpg',
    title: 'Water heater support',
    category: 'WATER LINE',
    description:
      'Diagnostics, repair, replacement planning, and hot water recovery support for apartments and family homes.',
  },
  {
    slug: 'gas-line-services',
    image: '/theme/images/service/3.jpg',
    title: 'Gas line services',
    category: 'GAS LINE',
    description:
      'Certified help for gas appliance hookup, safety checks, valve replacement, leak inspection, and line upgrades.',
  },
  {
    slug: 'electrical-repairs',
    image: '/theme/images/service/4.jpg',
    title: 'Electrical repairs',
    category: 'ELECTRICITY',
    description:
      'Fix switches, outlets, lighting issues, and urgent breaker faults with specialists who work clean and safely.',
  },
  {
    slug: 'bathroom-remodeling',
    image: '/theme/images/service/5.jpg',
    title: 'Bathroom remodeling',
    category: 'REMODELING',
    description:
      'Upgrade fixtures, tiling, layout, and finishes with coordinated bathroom refresh work from vetted crews.',
  },
  {
    slug: 'clean-up-services',
    image: '/theme/images/service/6.jpg',
    title: 'Clean-up services',
    category: 'CLEANING',
    description:
      'Post-repair, move-in, and post-renovation cleaning support so every job ends with a ready-to-use space.',
  },
  {
    slug: 'water-line-repair',
    image: '/theme/images/service/2.jpg',
    title: 'Water line repair',
    category: 'WATER LINE',
    description:
      'Track down pressure issues, hidden pipe damage, and main line problems before they disrupt daily living.',
  },
  {
    slug: 'basement-plumbing',
    image: '/theme/images/service/5.jpg',
    title: 'Basement plumbing',
    category: 'BASEMENT PLUMBING',
    description:
      'Sump pump, utility drains, moisture-prone pipework, and basement plumbing upgrades handled by trusted pros.',
  },
] as const;

const ITEMS_PER_PAGE = 6;

export const ServicesPageContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const gridAnchorRef = useRef<HTMLDivElement | null>(null);
  const firstRenderRef = useRef(true);

  const pageInfo = useMemo(() => {
    const totalItems = serviceItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

    return {
      currentPage,
      totalItems,
      totalPages,
      pageSize: ITEMS_PER_PAGE,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      startItem: startIndex + 1,
      endItem: endIndex,
    };
  }, [currentPage]);

  const visibleServices = serviceItems.slice(
    (pageInfo.currentPage - 1) * pageInfo.pageSize,
    pageInfo.currentPage * pageInfo.pageSize,
  );

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    gridAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageInfo.totalPages));
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Our Services</p>
          <h1>Best Service We Offer</h1>
          <p className={styles.lead}>
            Explore NearHelp&apos;s core home-service categories, from urgent repairs to clean-up and remodeling,
            all organized for faster booking and clearer comparison.
          </p>
        </div>
      </section>

      <section className={styles.serviceSection}>
        <div ref={gridAnchorRef} className={styles.gridAnchor} aria-hidden="true" />

        <div className={styles.serviceGrid}>
          {visibleServices.map((service) => (
            <article key={service.slug} className={styles.serviceCard}>
              <div className={styles.serviceImageWrap}>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={560}
                  height={420}
                  className={styles.serviceImage}
                />
              </div>

              <div className={styles.serviceBody}>
                <span className={styles.categoryPill}>{service.category}</span>
                <h2>
                  <Link prefetch={false} href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h2>
                <p>{service.description}</p>
                <Link prefetch={false} href={`/services/${service.slug}`} className={styles.inlineLink}>
                  Read more
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.paginationWrap}>
          <p className={styles.paginationSummary}>
            Showing {pageInfo.startItem}-{pageInfo.endItem} of {pageInfo.totalItems} services
          </p>

          <div className={styles.pagination} aria-label="Services pagination">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={!pageInfo.hasPreviousPage}
              className={styles.pageNavButton}
            >
              <CaretLeft size={18} weight="bold" />
              <span>Prev</span>
            </button>

            {Array.from({ length: pageInfo.totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const active = pageInfo.currentPage === pageNumber;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`${styles.pageButton} ${active ? styles.pageButtonActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={!pageInfo.hasNextPage}
              className={styles.pageNavButton}
            >
              <span>Next</span>
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
