'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowsClockwise,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChatCircleText,
  Check,
  Eye,
  HeartStraight,
  MagnifyingGlass,
  X,
} from 'phosphor-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  locationOptions,
  priceRangeOptions,
  serviceItems,
  serviceOptionChoices,
  serviceTypeOptions,
  type ServiceLocation,
  type ServiceOption,
  type ServicePriceBand,
} from './services-data';
import { getLikedServices, getViewedServices, recordServiceLike, recordServiceView } from './service-interactions';
import styles from './services-page.module.scss';

const ITEMS_PER_PAGE = 6;
const compactNumberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const sortChoices = [
  { value: 'RECENT', label: 'New' },
  { value: 'LOWEST_PRICE', label: 'Lowest Price' },
  { value: 'HIGHEST_PRICE', label: 'Highest Price' },
] as const;

type ServiceSort = (typeof sortChoices)[number]['value'];

const priceBandRank: Record<ServicePriceBand, number> = {
  UNDER_100K: 1,
  FROM_100K_TO_250K: 2,
  FROM_250K_TO_500K: 3,
  ABOVE_500K: 4,
};

const formatCompactNumber = (value: number) => compactNumberFormatter.format(value);

export const ServicesPageContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<ServiceLocation[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedServiceOptions, setSelectedServiceOptions] = useState<ServiceOption[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<ServicePriceBand | 'ANY'>('ANY');
  const [selectedSort, setSelectedSort] = useState<ServiceSort>('RECENT');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [activeCommentsSlug, setActiveCommentsSlug] = useState<string | null>(null);
  const [viewedServices, setViewedServices] = useState<Record<string, true>>({});
  const [likedServices, setLikedServices] = useState<Record<string, true>>({});

  const gridAnchorRef = useRef<HTMLDivElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    setViewedServices(getViewedServices());
    setLikedServices(getLikedServices());
  }, []);

  const filteredServices = useMemo(() => {
    const matchedServices = serviceItems.filter((service) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.agentName.toLowerCase().includes(query);

      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.some((location) => service.locations.includes(location));

      const matchesServiceType =
        selectedServiceTypes.length === 0 || selectedServiceTypes.includes(service.category);

      const matchesServiceOption =
        selectedServiceOptions.length === 0 ||
        selectedServiceOptions.some((option) => service.options.includes(option));

      const matchesPriceRange = selectedPriceRange === 'ANY' || service.priceBand === selectedPriceRange;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesServiceType &&
        matchesServiceOption &&
        matchesPriceRange
      );
    });

    const indexedServices = matchedServices.map((service, index) => ({ service, index }));

    indexedServices.sort((left, right) => {
      if (selectedSort === 'LOWEST_PRICE') {
        const diff = priceBandRank[left.service.priceBand] - priceBandRank[right.service.priceBand];
        return diff !== 0 ? diff : left.index - right.index;
      }

      if (selectedSort === 'HIGHEST_PRICE') {
        const diff = priceBandRank[right.service.priceBand] - priceBandRank[left.service.priceBand];
        return diff !== 0 ? diff : left.index - right.index;
      }

      return left.index - right.index;
    });

    return indexedServices.map(({ service }) => service);
  }, [
    searchTerm,
    selectedLocations,
    selectedPriceRange,
    selectedServiceOptions,
    selectedServiceTypes,
    selectedSort,
  ]);

  const pageInfo = useMemo(() => {
    const totalItems = filteredServices.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

    return {
      currentPage: safeCurrentPage,
      totalItems,
      totalPages,
      pageSize: ITEMS_PER_PAGE,
      hasPreviousPage: safeCurrentPage > 1,
      hasNextPage: safeCurrentPage < totalPages,
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: endIndex,
    };
  }, [filteredServices.length, currentPage]);

  const visibleServices = filteredServices.slice(
    (pageInfo.currentPage - 1) * pageInfo.pageSize,
    pageInfo.currentPage * pageInfo.pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
    setActiveCommentsSlug(null);
  }, [searchTerm, selectedLocations, selectedServiceTypes, selectedServiceOptions, selectedPriceRange, selectedSort]);

  useEffect(() => {
    if (currentPage > pageInfo.totalPages) {
      setCurrentPage(pageInfo.totalPages);
    }
  }, [currentPage, pageInfo.totalPages]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    gridAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSortMenuOpen(false);
        setActiveCommentsSlug(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const nextSort = searchParams.get('sort');

    if (nextSort && sortChoices.some((choice) => choice.value === nextSort)) {
      setSelectedSort(nextSort as ServiceSort);
      return;
    }

    setSelectedSort('RECENT');
  }, [searchParams]);

  const toggleArrayValue = <T,>(value: T, current: T[], setter: (next: T[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLocations([]);
    setSelectedServiceTypes([]);
    setSelectedServiceOptions([]);
    setSelectedPriceRange('ANY');
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageInfo.totalPages));
  };

  const updateSort = (nextSort: ServiceSort) => {
    setSelectedSort(nextSort);
    setIsSortMenuOpen(false);

    const params = new URLSearchParams(searchParams.toString());

    if (nextSort === 'RECENT') {
      params.delete('sort');
    } else {
      params.set('sort', nextSort);
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const handleOpenService = (slug: string) => {
    if (!recordServiceView(slug)) {
      return;
    }

    setViewedServices((current) => ({ ...current, [slug]: true }));
  };

  const handleLikeService = (slug: string) => {
    if (!recordServiceLike(slug)) {
      return;
    }

    setLikedServices((current) => ({ ...current, [slug]: true }));
  };

  const currentSortLabel = sortChoices.find((choice) => choice.value === selectedSort)?.label ?? 'New';

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

        <div className={styles.layoutGrid}>
          <aside className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <div>
                <p className={styles.filterEyebrow}>Filter Services</p>
                <h2>Find Your Service</h2>
              </div>
            </div>

            <div className={styles.searchRow}>
              <label className={styles.searchBox}>
                <MagnifyingGlass size={24} weight="bold" className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="What service are you looking for?"
                  aria-label="Search services"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className={styles.clearButton}
                    aria-label="Clear search"
                  >
                    <X size={18} weight="bold" />
                  </button>
                )}
              </label>

              <button type="button" onClick={resetFilters} className={styles.resetButton} aria-label="Reset filters">
                <ArrowsClockwise size={28} weight="bold" />
              </button>
            </div>

            <div className={`${styles.filterGroup} ${styles.expandableFilterGroup}`}>
              <div className={styles.expandableHeader}>
                <h3>Location</h3>
              </div>
              <div className={`${styles.checkboxList} ${styles.locationList}`}>
                {locationOptions.map((location) => {
                  const checked = selectedLocations.includes(location);
                  return (
                    <label key={location} className={styles.checkOption}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayValue(location, selectedLocations, setSelectedLocations)}
                      />
                      <span>{location}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Service Type</h3>
              <div className={styles.checkboxList}>
                {serviceTypeOptions.map((serviceType) => {
                  const checked = selectedServiceTypes.includes(serviceType);
                  return (
                    <label key={serviceType} className={styles.checkOption}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayValue(serviceType, selectedServiceTypes, setSelectedServiceTypes)}
                      />
                      <span>{serviceType}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Service Options</h3>
              <div className={styles.checkboxList}>
                {serviceOptionChoices.map((option) => {
                  const checked = selectedServiceOptions.includes(option);
                  return (
                    <label key={option} className={styles.checkOption}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayValue(option, selectedServiceOptions, setSelectedServiceOptions)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Price Range</h3>
              <div className={styles.priceRangeGrid}>
                {priceRangeOptions.map((option) => {
                  const active = selectedPriceRange === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedPriceRange(option.value)}
                      className={`${styles.priceButton} ${active ? styles.priceButtonActive : ''}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className={styles.resultsColumn}>
            <div className={styles.resultsToolbar}>
              <div className={styles.sortControl} ref={sortMenuRef}>
                <span className={styles.sortLabel}>Sort by</span>
                <button
                  type="button"
                  className={styles.sortButton}
                  aria-haspopup="menu"
                  aria-expanded={isSortMenuOpen}
                  onClick={() => setIsSortMenuOpen((prev) => !prev)}
                >
                  <span>{currentSortLabel}</span>
                  <CaretDown
                    size={20}
                    weight="bold"
                    className={`${styles.sortCaret} ${isSortMenuOpen ? styles.sortCaretOpen : ''}`}
                  />
                </button>

                {isSortMenuOpen && (
                  <div className={styles.sortMenu} role="menu" aria-label="Sort services">
                    {sortChoices.map((choice) => {
                      const active = selectedSort === choice.value;

                      return (
                        <button
                          key={choice.value}
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          className={`${styles.sortOption} ${active ? styles.sortOptionActive : ''}`}
                          onClick={() => updateSort(choice.value)}
                        >
                          <span>{choice.label}</span>
                          {active && <Check size={18} weight="bold" className={styles.sortCheck} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.serviceGrid}>
              {visibleServices.map((service) => {
                const viewed = Boolean(viewedServices[service.slug]);
                const liked = Boolean(likedServices[service.slug]);
                const commentsOpen = activeCommentsSlug === service.slug;
                const totalViews = service.baseViews + (viewed ? 1 : 0);
                const totalLikes = service.baseLikes + (liked ? 1 : 0);

                return (
                  <article key={service.slug} className={styles.serviceCard}>
                    <div className={styles.serviceImageWrap}>
                      <Link
                        prefetch={false}
                        href={`/services/${service.slug}`}
                        className={styles.mediaLink}
                        onClick={() => handleOpenService(service.slug)}
                      >
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={560}
                          height={420}
                          className={styles.serviceImage}
                        />
                      </Link>
                    </div>

                    <div className={styles.serviceBody}>
                      <span className={styles.categoryPill}>{service.category}</span>
                      <h2>
                        <Link prefetch={false} href={`/services/${service.slug}`} onClick={() => handleOpenService(service.slug)}>
                          {service.title}
                        </Link>
                      </h2>
                      <p>{service.description}</p>
                      <div className={styles.serviceMeta}>
                        <span>{service.priceLabel}</span>
                        <span>{service.locations.join(' · ')}</span>
                      </div>

                      <div className={styles.serviceEngagement}>
                        <span className={styles.agentName}>{service.agentName}</span>

                        <div className={styles.engagementActions}>
                          <span className={styles.statItem} title="Unique service views">
                            <Eye size={22} weight="regular" />
                            <span>{formatCompactNumber(totalViews)}</span>
                          </span>

                          <button
                            type="button"
                            className={`${styles.statButton} ${liked ? styles.statButtonLiked : ''}`}
                            aria-pressed={liked}
                            aria-label={`Like ${service.title}`}
                            onClick={() => handleLikeService(service.slug)}
                          >
                            <HeartStraight size={22} weight={liked ? 'fill' : 'regular'} />
                            <span>{formatCompactNumber(totalLikes)}</span>
                          </button>

                          <button
                            type="button"
                            className={`${styles.statButton} ${commentsOpen ? styles.statButtonActive : ''}`}
                            aria-expanded={commentsOpen}
                            aria-controls={`service-comments-${service.slug}`}
                            aria-label={`Show comments for ${service.title}`}
                            onClick={() => setActiveCommentsSlug((current) => (current === service.slug ? null : service.slug))}
                          >
                            <ChatCircleText size={22} weight="regular" />
                            <span>{formatCompactNumber(service.comments.length)}</span>
                          </button>
                        </div>
                      </div>

                      {commentsOpen && (
                        <div id={`service-comments-${service.slug}`} className={styles.commentsPanel}>
                          <div className={styles.commentsHeader}>
                            <h3>Recent comments</h3>
                            <span>{service.comments.length} total</span>
                          </div>
                          <div className={styles.commentsList}>
                            {service.comments.map((comment) => (
                              <article key={comment.id} className={styles.commentItem}>
                                <div className={styles.commentMeta}>
                                  <strong>{comment.author}</strong>
                                  <span>{comment.date}</span>
                                </div>
                                <p>{comment.message}</p>
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {pageInfo.totalItems === 0 && (
              <div className={styles.emptyState}>
                <h3>No services match your filters</h3>
                <p>Try clearing a few filters or searching with a broader keyword.</p>
                <button type="button" onClick={resetFilters} className={styles.emptyAction}>
                  Reset filters
                </button>
              </div>
            )}

            <div className={styles.paginationWrap}>
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
          </div>
        </div>
      </section>
    </main>
  );
};
