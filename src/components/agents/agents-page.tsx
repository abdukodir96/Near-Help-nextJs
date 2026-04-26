'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaretDown, CaretLeft, CaretRight, Eye, HeartStraight, MagnifyingGlass, UsersThree } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_AGENTS } from '@/lib/graphql/queries';
import styles from './agents-page.module.scss';

const sortChoices = [
  { value: 'RECENT',        label: 'Recent',       backendVal: 'RECENT' },
  { value: 'MOST_LIKED',    label: 'Most Liked',   backendVal: 'MOST_LIKED' },
  { value: 'MOST_FOLLOWED', label: 'Most Followed', backendVal: 'MOST_FOLLOWED' },
] as const;

const AGENTS_PER_PAGE = 6;
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = (n: number) => compact.format(n);

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
};

const getAvatarUrl = (img?: string) => {
  if (!img) return '/theme/images/team/1.jpg';
  if (img.startsWith('http')) return img;
  return `http://localhost:3007${img}`;
};

export const AgentsPageContent = () => {
  const [searchTerm,   setSearchTerm]   = useState('');
  const [selectedSort, setSelectedSort] = useState<AgentSort>('RECENT');
  const [isSortOpen,   setIsSortOpen]   = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const { data, loading } = useQuery<{ getAgents: { list: BackendAgent[]; meta: { totalCount: number } } }>(
    GET_AGENTS,
    {
      variables: {
        input: {
          searchText: searchTerm.trim() || undefined,
          sortBy:     selectedSort,
          page:       currentPage,
          limit:      AGENTS_PER_PAGE,
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const agents     = data?.getAgents?.list ?? [];
  const totalCount = data?.getAgents?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / AGENTS_PER_PAGE));

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedSort]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false); };
    const onKey  = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSortOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  const currentSortLabel = sortChoices.find((c) => c.value === selectedSort)?.label ?? 'Recent';

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.toolbar}>
            <label className={styles.searchBox}>
              <MagnifyingGlass size={19} weight="bold" className={styles.searchIcon} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for an agent"
              />
            </label>

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
                <CaretDown size={16} weight="bold" className={`${styles.sortCaret} ${isSortOpen ? styles.sortCaretOpen : ''}`} />
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

          {loading && agents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>Loading agents...</div>
          ) : agents.length > 0 ? (
            <>
              <div className={styles.agentGrid}>
                {agents.map((agent) => (
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
                      {agent.memberDesc && <p className={styles.specialty}>{agent.memberDesc.slice(0, 60)}...</p>}

                      <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                          <Eye size={18} weight="regular" />
                          <span>{fmt(agent.memberViews)}</span>
                        </span>
                        <span className={styles.metaItem}>
                          <HeartStraight size={18} weight="regular" />
                          <span>{fmt(agent.memberLikes)}</span>
                        </span>
                        <span className={styles.metaItem}>
                          <UsersThree size={18} weight="regular" />
                          <span>{fmt(agent.memberFollowers)}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.paginationBar}>
                  <button type="button" className={styles.paginationButton} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <CaretLeft size={16} weight="bold" /><span>Prev</span>
                  </button>
                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => {
                      const n = i + 1;
                      const active = currentPage === n;
                      return (
                        <button key={n} type="button" className={`${styles.paginationNumber} ${active ? styles.paginationNumberActive : ''}`} onClick={() => setCurrentPage(n)} aria-current={active ? 'page' : undefined}>
                          {n}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" className={styles.paginationButton} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    <span>Next</span><CaretRight size={16} weight="bold" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <h3>No agents match your search</h3>
              <p>Try a broader keyword such as a name or specialty.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
