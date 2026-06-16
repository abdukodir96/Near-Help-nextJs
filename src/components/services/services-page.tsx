'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowsClockwise, CaretDown, CaretLeft, CaretRight,
  ChatCircleText, Check, Eye, HeartStraight, MagnifyingGlass, X,
} from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_SERVICES, LIKE_SERVICE } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';
import { locationOptions, priceRangeOptions, serviceOptionChoices, serviceTypeOptions, type ServicePriceBand } from './services-data';
import styles from './services-page.module.scss';

const ITEMS_PER_PAGE = 4;
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = (n: number) => compact.format(n);

const sortChoices = [
  { value: 'RECENT',        label: 'New' },
  { value: 'LOWEST_PRICE',  label: 'Lowest Price' },
  { value: 'HIGHEST_PRICE', label: 'Highest Price' },
] as const;
type SortVal = (typeof sortChoices)[number]['value'];

type BackendService = {
  _id: string;
  serviceCategory: string;
  serviceOption: string;
  serviceAddress: string;
  serviceArea?: string;
  serviceTitle: string;
  servicePrice: number;
  serviceViews: number;
  serviceLikes: number;
  serviceComments: number;
  serviceImages?: string[];
  serviceDesc?: string;
  meLiked?: boolean;
  memberData?: { _id: string; memberNick: string; memberFullName?: string; memberImage?: string };
};

const getImageUrl = (images?: string[]) => {
  if (!images?.length) return '/theme/images/service/1.jpg';
  return getAssetUrl(images[0]) || '/theme/images/service/1.jpg';
};

const ServiceImage = ({ images, alt }: { images?: string[]; alt: string }) => {
  const [src, setSrc] = useState(getImageUrl(images));
  return (
    <Image
      src={src}
      alt={alt}
      width={560}
      height={420}
      className={styles.serviceImage}
      onError={() => setSrc('/theme/images/service/1.jpg')}
    />
  );
};

const formatKRW = (price: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price);

export const ServicesPageContent = () => {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea,     setSelectedArea]     = useState('');
  const [selectedOption,   setSelectedOption]   = useState('');
  const [priceRange,       setPriceRange]       = useState<ServicePriceBand | 'ANY'>('ANY');
  const [selectedSort,     setSelectedSort]     = useState<SortVal>('RECENT');
  const [currentPage,      setCurrentPage]      = useState(1);
  const [isSortOpen,       setIsSortOpen]       = useState(false);
  const [likedMap,         setLikedMap]         = useState<Record<string, boolean>>({});
  const [viewIncrMap,      setViewIncrMap]      = useState<Record<string, number>>({});

  const gridRef    = useRef<HTMLDivElement | null>(null);
  const sortRef    = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  const priceVars = (() => {
    if (priceRange === 'UNDER_100K')        return { minPrice: 0,      maxPrice: 100000 };
    if (priceRange === 'FROM_100K_TO_250K') return { minPrice: 100000, maxPrice: 250000 };
    if (priceRange === 'FROM_250K_TO_500K') return { minPrice: 250000, maxPrice: 500000 };
    if (priceRange === 'ABOVE_500K')        return { minPrice: 500000 };
    return {};
  })();

  const { data, loading } = useQuery<{ getServices: { list: BackendService[]; meta: { totalCount: number } } }>(
    GET_SERVICES,
    {
      variables: {
        input: {
          searchText:      searchTerm.trim() || undefined,
          serviceCategory: selectedCategory  || undefined,
          serviceArea:     selectedArea       || undefined,
          serviceOption:   selectedOption     || undefined,
          sortBy:          selectedSort,
          page:            currentPage,
          limit:           ITEMS_PER_PAGE,
          ...priceVars,
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const services   = data?.getServices?.list ?? [];
  const totalCount = data?.getServices?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  useEffect(() => {
    const map: Record<string, boolean> = {};
    services.forEach((s) => { if (s.meLiked) map[s._id] = true; });
    setLikedMap((prev) => ({ ...prev, ...map }));
  }, [services]);

  const [likeService] = useMutation(LIKE_SERVICE);

  // Reset to page 1 on filter change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, selectedArea, selectedOption, priceRange, selectedSort]);

  // Scroll to grid on page change
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  // Close sort menu on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSortOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  // Sync sort from URL
  useEffect(() => {
    const s = searchParams.get('sort') as SortVal | null;
    setSelectedSort(s && sortChoices.some((c) => c.value === s) ? s : 'RECENT');
  }, [searchParams]);

  const resetFilters = () => {
    setSearchTerm(''); setSelectedCategory(''); setSelectedArea('');
    setSelectedOption(''); setPriceRange('ANY');
  };

  const updateSort = (val: SortVal) => {
    setSelectedSort(val); setIsSortOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'RECENT') {
      params.delete('sort');
    } else {
      params.set('sort', val);
    }
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const handleLike = async (id: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      const result = await Swal.fire({
        icon: 'warning', title: 'Login required',
        text: 'You need to be logged in to like a service.',
        confirmButtonText: 'Go to Login', showCancelButton: true,
        cancelButtonText: 'Cancel', confirmButtonColor: '#0052da', cancelButtonColor: '#6b7280',
      });
      if (result.isConfirmed) router.push('/auth/login');
      return;
    }

    const prev = likedMap[id] ?? false;
    setLikedMap((m) => ({ ...m, [id]: !prev }));
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: res } = await (likeService as any)({ variables: { input: { targetServiceId: id } } });
      if (res?.likeTargetService) {
        setLikedMap((m) => ({ ...m, [id]: res.likeTargetService.myFavorite }));
      }
    } catch {
      setLikedMap((m) => ({ ...m, [id]: prev }));
    }
  };

  const handleServiceClick = (id: string) => {
    if (Cookies.get(ACCESS_TOKEN_KEY)) {
      setViewIncrMap((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }
  };

  const currentSortLabel = sortChoices.find((c) => c.value === selectedSort)?.label ?? 'New';

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
        <div ref={gridRef} className={styles.gridAnchor} aria-hidden="true" />

        <div className={styles.layoutGrid}>
          {/* ── Filters ── */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What service are you looking for?"
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm('')} className={styles.clearButton}>
                    <X size={18} weight="bold" />
                  </button>
                )}
              </label>
              <button type="button" onClick={resetFilters} className={styles.resetButton} aria-label="Reset filters">
                <ArrowsClockwise size={28} weight="bold" />
              </button>
            </div>

            {/* Location */}
            <div className={`${styles.filterGroup} ${styles.expandableFilterGroup}`}>
              <div className={styles.expandableHeader}><h3>Location</h3></div>
              <div className={`${styles.checkboxList} ${styles.locationList}`}>
                {locationOptions.map((loc) => (
                  <label key={loc} className={styles.checkOption}>
                    <input
                      type="radio"
                      name="location"
                      checked={selectedArea === loc}
                      onChange={() => setSelectedArea(selectedArea === loc ? '' : loc)}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Service Type */}
            <div className={styles.filterGroup}>
              <h3>Service Type</h3>
              <div className={styles.checkboxList}>
                {serviceTypeOptions.map((type) => (
                  <label key={type} className={styles.checkOption}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === type}
                      onChange={() => setSelectedCategory(selectedCategory === type ? '' : type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Service Options */}
            <div className={styles.filterGroup}>
              <h3>Service Options</h3>
              <div className={styles.checkboxList}>
                {serviceOptionChoices.map((opt) => (
                  <label key={opt} className={styles.checkOption}>
                    <input
                      type="radio"
                      name="option"
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(selectedOption === opt ? '' : opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h3>Price Range</h3>
              <div className={styles.priceRangeGrid}>
                {priceRangeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriceRange(opt.value)}
                    className={`${styles.priceButton} ${priceRange === opt.value ? styles.priceButtonActive : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className={styles.resultsColumn}>
            <div className={styles.resultsToolbar}>
              <div className={styles.sortControl} ref={sortRef}>
                <span className={styles.sortLabel}>Sort by</span>
                <button
                  type="button"
                  className={styles.sortButton}
                  aria-haspopup="menu"
                  aria-expanded={isSortOpen}
                  onClick={() => setIsSortOpen((p) => !p)}
                >
                  <span>{currentSortLabel}</span>
                  <CaretDown size={20} weight="bold" className={`${styles.sortCaret} ${isSortOpen ? styles.sortCaretOpen : ''}`} />
                </button>

                {isSortOpen && (
                  <div className={styles.sortMenu} role="menu">
                    {sortChoices.map((c) => {
                      const active = selectedSort === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          className={`${styles.sortOption} ${active ? styles.sortOptionActive : ''}`}
                          onClick={() => updateSort(c.value)}
                        >
                          <span>{c.label}</span>
                          {active && <Check size={18} weight="bold" className={styles.sortCheck} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {loading && services.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>Loading services...</div>
            ) : (
              <div className={styles.serviceGrid}>
                {services.map((service) => {
                  const liked      = likedMap[service._id] ?? service.meLiked ?? false;
                  const likeCount  = service.serviceLikes + (liked && !service.meLiked ? 1 : !liked && service.meLiked ? -1 : 0);
                  const viewCount  = service.serviceViews + (viewIncrMap[service._id] ?? 0);
                  return (
                    <article key={service._id} className={styles.serviceCard}>
                      <div className={styles.serviceImageWrap}>
                        <Link prefetch={false} href={`/services/${service._id}`} className={styles.mediaLink} onClick={() => handleServiceClick(service._id)}>
                          <ServiceImage images={service.serviceImages} alt={service.serviceTitle} />
                        </Link>
                      </div>

                      <div className={styles.serviceBody}>
                        <span className={styles.categoryPill}>{service.serviceCategory}</span>
                        <h2>
                          <Link prefetch={false} href={`/services/${service._id}`}>
                            {service.serviceTitle}
                          </Link>
                        </h2>
                        <p>{service.serviceDesc}</p>
                        <div className={styles.serviceMeta}>
                          <span>{formatKRW(service.servicePrice)}</span>
                          {service.serviceArea && <span>{service.serviceArea}</span>}
                        </div>

                        <div className={styles.serviceEngagement}>
                          <span className={styles.agentName}>
                            {service.memberData?.memberFullName || service.memberData?.memberNick || 'Agent'}
                          </span>
                          <div className={styles.engagementActions}>
                            <span className={styles.statItem}>
                              <Eye size={22} weight="regular" />
                              <span>{fmt(viewCount)}</span>
                            </span>

                            <button
                              type="button"
                              className={`${styles.statButton} ${liked ? styles.statButtonLiked : ''}`}
                              aria-pressed={liked}
                              onClick={() => handleLike(service._id)}
                            >
                              <HeartStraight size={22} weight={liked ? 'fill' : 'regular'} />
                              <span>{fmt(likeCount)}</span>
                            </button>

                            <Link
                              prefetch={false}
                              href={`/services/${service._id}#comments`}
                              className={styles.statButton}
                            >
                              <ChatCircleText size={22} weight="regular" />
                              <span>{fmt(service.serviceComments)}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && services.length === 0 && (
              <div className={styles.emptyState}>
                <h3>No services match your filters</h3>
                <p>Try clearing a few filters or searching with a broader keyword.</p>
                <button type="button" onClick={resetFilters} className={styles.emptyAction}>Reset filters</button>
              </div>
            )}

            <div className={styles.paginationWrap}>
              <div className={styles.pagination} aria-label="Services pagination">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={styles.pageNavButton}>
                  <CaretLeft size={18} weight="bold" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCurrentPage(n)}
                      className={`${styles.pageButton} ${currentPage === n ? styles.pageButtonActive : ''}`}
                      aria-current={currentPage === n ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  );
                })}

                <button type="button" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={styles.pageNavButton}>
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
