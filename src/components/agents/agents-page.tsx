'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowCounterClockwise,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChatCircleText,
  Eye,
  HeartStraight,
  MagnifyingGlass,
  UsersThree,
  X,
} from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_AGENTS, LIKE_MEMBER, TOGGLE_FOLLOW } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';
import styles from './agents-page.module.scss';

// ── Constants ─────────────────────────────────────────────────────────────────

const AGENTS_PER_PAGE = 6;
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = (n: number) => compact.format(n);

const sortChoices = [
  { value: 'RECENT', label: 'Recent'      },
  { value: 'LIKES',  label: 'Most Liked'  },
  { value: 'VIEWS',  label: 'Most Viewed' },
] as const;

const locationOptions = [
  'Seoul', 'Busan', 'Incheon', 'Daegu',
  'Gyeongju', 'Gwangju', 'Jeonju', 'Daejeon', 'Jeju',
];

const serviceTypeOptions = [
  { value: 'Plumbing',          label: 'Plumbing'           },
  { value: 'Gas line',          label: 'Gas Line Services'  },
  { value: 'Electricity',       label: 'Electricity'        },
  { value: 'Water line',        label: 'Water Line Repair'  },
  { value: 'Bathroom plumbing', label: 'Bathroom Plumbing'  },
  { value: 'Basement plumbing', label: 'Basement Plumbing'  },
  { value: 'Remodeling',        label: 'Remodeling'         },
  { value: 'Cleaning',          label: 'Cleaning'           },
];

type AgentSort = (typeof sortChoices)[number]['value'];

type BackendAgent = {
  _id: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberDesc?: string;
  memberServices: number;
  memberLikes: number;
  memberFollowers: number;
  memberViews: number;
  memberComments: number;
  memberRank: number;
  meLiked?: boolean;
  meFollowed?: boolean;
};

const getAvatarUrl = (img?: string) => getAssetUrl(img) || '/theme/images/team/1.jpg';

// ── Component ─────────────────────────────────────────────────────────────────

export const AgentsPageContent = () => {
  const router = useRouter();
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedSort,     setSelectedSort]     = useState<AgentSort>('RECENT');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedService,  setSelectedService]  = useState('');
  const [currentPage,      setCurrentPage]      = useState(1);
  const [isSortOpen,       setIsSortOpen]       = useState(false);
  const [likedMap,         setLikedMap]         = useState<Record<string, boolean>>({});
  const [followedMap,      setFollowedMap]      = useState<Record<string, boolean>>({});
  const sortRef = useRef<HTMLDivElement | null>(null);

  const combinedSearch = searchTerm.trim() || selectedService || undefined;

  const { data, loading } = useQuery<{
    getAgents: { list: BackendAgent[]; meta: { totalCount: number } };
  }>(GET_AGENTS, {
    variables: {
      input: {
        searchText:    combinedSearch,
        memberAddress: selectedLocation || undefined,
        sortBy:        selectedSort,
        page:          currentPage,
        limit:         AGENTS_PER_PAGE,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const agents     = data?.getAgents?.list ?? [];
  const totalCount = data?.getAgents?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / AGENTS_PER_PAGE));

  useEffect(() => {
    if (agents.length === 0) return;
    setLikedMap((m) => {
      const next = { ...m };
      agents.forEach((a) => { if (!(a._id in next)) next[a._id] = Boolean(a.meLiked); });
      return next;
    });
    setFollowedMap((m) => {
      const next = { ...m };
      agents.forEach((a) => { if (!(a._id in next)) next[a._id] = Boolean(a.meFollowed); });
      return next;
    });
  }, [agents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSort, selectedLocation, selectedService]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSortOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const hasActiveFilters = Boolean(selectedLocation || selectedService);

  const clearAll = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedService('');
    setSelectedSort('RECENT');
  };

  // ── Like / Follow ────────────────────────────────────────────────────────────
  const [likeMember]   = useMutation(LIKE_MEMBER);
  const [toggleFollow] = useMutation(TOGGLE_FOLLOW);

  const showAuthAlert = async (action: string) => {
    const result = await Swal.fire({
      icon: 'warning', title: 'Login required',
      text: `Please log in to ${action}.`,
      confirmButtonText: 'Go to Login', showCancelButton: true,
      cancelButtonText: 'Cancel', confirmButtonColor: '#0052da', cancelButtonColor: '#6b7280',
    });
    if (result.isConfirmed) router.push('/auth/login');
  };

  const handleLike = async (id: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like an agent'); return; }
    const prev = likedMap[id] ?? false;
    setLikedMap((m) => ({ ...m, [id]: !prev }));
    try {
      await likeMember({ variables: { input: { targetMemberId: id } } });
    } catch {
      setLikedMap((m) => ({ ...m, [id]: prev }));
    }
  };

  const handleFollow = async (id: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('follow an agent'); return; }
    const prev = followedMap[id] ?? false;
    const next = !prev;
    setFollowedMap((m) => ({ ...m, [id]: next }));
    try {
      await toggleFollow({ variables: { input: { targetMemberId: id } } });
      await Swal.fire({
        icon: 'success',
        title: next ? 'Followed!' : 'Unfollowed!',
        text: next
          ? 'You are now following this agent.'
          : 'This agent has been removed from your following list.',
        confirmButtonColor: '#0052da',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch {
      setFollowedMap((m) => ({ ...m, [id]: prev }));
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#0052da',
      });
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.layoutGrid}>

          {/* ── Left filter panel ── */}
          <aside className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <p className={styles.filterEyebrow}>Directory</p>
              <h2>Find Agents</h2>
            </div>

            {/* Search */}
            <div className={styles.searchRow}>
              <label className={styles.searchBox}>
                <MagnifyingGlass size={22} weight="bold" className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                />
                {searchTerm && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </label>
              <button
                type="button"
                className={styles.resetButton}
                onClick={clearAll}
                aria-label="Reset all filters"
              >
                <ArrowCounterClockwise size={22} weight="bold" />
              </button>
            </div>

            {/* Location filter */}
            <div className={styles.filterGroup}>
              <h3>Location</h3>
              <div className={styles.checkboxList}>
                {locationOptions.map((loc) => (
                  <label key={loc} className={styles.checkOption}>
                    <input
                      type="radio"
                      name="location"
                      checked={selectedLocation === loc}
                      onChange={() =>
                        setSelectedLocation(selectedLocation === loc ? '' : loc)
                      }
                      onClick={() => { if (selectedLocation === loc) setSelectedLocation(''); }}
                    />
                    {loc}
                  </label>
                ))}
              </div>
            </div>

            {/* Service type filter */}
            <div className={styles.filterGroup}>
              <h3>Service Type</h3>
              <div className={styles.serviceTypeGrid}>
                {serviceTypeOptions.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`${styles.serviceTypeBtn} ${selectedService === s.value ? styles.serviceTypeBtnActive : ''}`}
                    onClick={() => setSelectedService(selectedService === s.value ? '' : s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button type="button" className={styles.clearFiltersBtn} onClick={clearAll}>
                Clear all filters
              </button>
            )}
          </aside>

          {/* ── Right results column ── */}
          <div className={styles.resultsColumn}>

            {/* Sort + total */}
            <div className={styles.resultsToolbar}>
              <span className={styles.totalCount}>
                {loading ? '...' : `${totalCount} agent${totalCount !== 1 ? 's' : ''} found`}
              </span>
              <div className={styles.sortControl} ref={sortRef}>
                <span className={styles.sortLabel}>Sort by</span>
                <button
                  type="button"
                  className={styles.sortButton}
                  aria-haspopup="menu"
                  aria-expanded={isSortOpen}
                  onClick={() => setIsSortOpen((p) => !p)}
                >
                  <span>{sortChoices.find((c) => c.value === selectedSort)?.label ?? 'Recent'}</span>
                  <CaretDown
                    size={15}
                    weight="bold"
                    className={`${styles.sortCaret} ${isSortOpen ? styles.sortCaretOpen : ''}`}
                  />
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
                          onClick={() => { setSelectedSort(c.value); setIsSortOpen(false); }}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Agent grid */}
            {loading && agents.length === 0 ? (
              <div className={styles.loadingState}>Loading agents...</div>
            ) : agents.length > 0 ? (
              <>
                <div className={styles.agentGrid}>
                  {agents.map((agent) => {
                    const liked = likedMap[agent._id] ?? Boolean(agent.meLiked);
                    const followed = followedMap[agent._id] ?? Boolean(agent.meFollowed);
                    const likeCount = agent.memberLikes + (liked && !agent.meLiked ? 1 : !liked && agent.meLiked ? -1 : 0);
                    const followerCount = agent.memberFollowers + (followed && !agent.meFollowed ? 1 : !followed && agent.meFollowed ? -1 : 0);
                    return (
                    <article key={agent._id} className={styles.agentCard}>
                      <Link prefetch={false} href={`/agents/${agent._id}`} className={styles.imageLink}>
                        <div className={styles.imageWrap}>
                          <span className={styles.jobsBadge}>{agent.memberServices} jobs</span>
                          <Image
                            src={getAvatarUrl(agent.memberImage)}
                            alt={agent.memberFullName || agent.memberNick}
                            width={320}
                            height={400}
                            className={styles.agentImage}
                            unoptimized
                          />
                        </div>
                      </Link>
                      <div className={styles.cardBody}>
                        <h2>
                          <Link prefetch={false} href={`/agents/${agent._id}`}>
                            {agent.memberFullName || agent.memberNick}
                          </Link>
                        </h2>
                        <p className={styles.role}>{agent.memberNick}</p>
                        {agent.memberDesc && (
                          <p className={styles.specialty}>{agent.memberDesc.slice(0, 60)}...</p>
                        )}
                        <div className={styles.cardMeta}>
                          <span className={styles.metaItem}>
                            <Eye size={18} weight="regular" />
                            <span>{fmt(agent.memberViews)}</span>
                          </span>
                          <button
                            type="button"
                            className={`${styles.metaItem} ${styles.metaButton} ${liked ? styles.metaButtonLiked : ''}`}
                            onClick={() => handleLike(agent._id)}
                            aria-label="Like agent"
                          >
                            <HeartStraight size={18} weight={liked ? 'fill' : 'regular'} />
                            <span>{fmt(likeCount)}</span>
                          </button>
                          <button
                            type="button"
                            className={`${styles.metaItem} ${styles.metaButton} ${followed ? styles.metaButtonActive : ''}`}
                            onClick={() => handleFollow(agent._id)}
                            aria-label="Follow agent"
                          >
                            <UsersThree size={18} weight={followed ? 'fill' : 'regular'} />
                            <span>{fmt(followerCount)}</span>
                          </button>
                          <Link
                            href={`/agents/${agent._id}#comments`}
                            className={`${styles.metaItem} ${styles.metaButton}`}
                            aria-label="View comments"
                          >
                            <ChatCircleText size={18} weight="regular" />
                            <span>{fmt(agent.memberComments)}</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages >= 1 && (
                  <div className={styles.paginationBar}>
                    <button
                      type="button"
                      className={styles.paginationButton}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <CaretLeft size={16} weight="bold" />
                      <span>Prev</span>
                    </button>

                    <div className={styles.paginationNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => {
                        const n = i + 1;
                        const active = currentPage === n;
                        return (
                          <button
                            key={n}
                            type="button"
                            className={`${styles.paginationNumber} ${active ? styles.paginationNumberActive : ''}`}
                            onClick={() => setCurrentPage(n)}
                            aria-current={active ? 'page' : undefined}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className={styles.paginationButton}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <span>Next</span>
                      <CaretRight size={16} weight="bold" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <h3>No agents found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
