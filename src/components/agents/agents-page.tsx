'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  Eye,
  HeartStraight,
  MagnifyingGlass,
  UsersThree,
} from 'phosphor-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { agentItems } from './agents-data';
import styles from './agents-page.module.scss';

const sortChoices = [
  { value: 'RECENT', label: 'Recent' },
  { value: 'MOST_PROJECTS', label: 'Most Jobs' },
  { value: 'MOST_LIKED', label: 'Most Liked' },
  { value: 'MOST_FOLLOWED', label: 'Most Followed' },
] as const;

const AGENTS_PER_PAGE = 6;

type AgentSort = (typeof sortChoices)[number]['value'];

const compactNumberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const formatCompactNumber = (value: number) => compactNumberFormatter.format(value);

export const AgentsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState<AgentSort>('RECENT');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const filteredAgents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const matched = agentItems.filter((agent) => {
      if (!query) return true;
      return (
        agent.name.toLowerCase().includes(query) ||
        agent.role.toLowerCase().includes(query) ||
        agent.specialty.toLowerCase().includes(query) ||
        agent.location.toLowerCase().includes(query)
      );
    });

    const indexed = matched.map((agent, index) => ({ agent, index }));

    indexed.sort((left, right) => {
      if (selectedSort === 'MOST_PROJECTS') {
        const diff = right.agent.completedProjects - left.agent.completedProjects;
        return diff !== 0 ? diff : left.index - right.index;
      }

      if (selectedSort === 'MOST_LIKED') {
        const diff = right.agent.likes - left.agent.likes;
        return diff !== 0 ? diff : left.index - right.index;
      }

      if (selectedSort === 'MOST_FOLLOWED') {
        const diff = right.agent.followers - left.agent.followers;
        return diff !== 0 ? diff : left.index - right.index;
      }

      return left.index - right.index;
    });

    return indexed.map(({ agent }) => agent);
  }, [searchTerm, selectedSort]);

  const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE);

  const visibleAgents = useMemo(() => {
    const startIndex = activePage * AGENTS_PER_PAGE;
    return filteredAgents.slice(startIndex, startIndex + AGENTS_PER_PAGE);
  }, [activePage, filteredAgents]);

  useEffect(() => {
    setActivePage(0);
  }, [searchTerm, selectedSort]);

  useEffect(() => {
    if (activePage > 0 && activePage >= totalPages) {
      setActivePage(Math.max(totalPages - 1, 0));
    }
  }, [activePage, totalPages]);

  const currentSortLabel = sortChoices.find((choice) => choice.value === selectedSort)?.label ?? 'Recent';

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
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for an agent"
                aria-label="Search for an agent"
              />
            </label>

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
                  size={16}
                  weight="bold"
                  className={`${styles.sortCaret} ${isSortMenuOpen ? styles.sortCaretOpen : ''}`}
                />
              </button>

              {isSortMenuOpen && (
                <div className={styles.sortMenu} role="menu" aria-label="Sort agents">
                  {sortChoices.map((choice) => {
                    const active = selectedSort === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        className={`${styles.sortOption} ${active ? styles.sortOptionActive : ''}`}
                        onClick={() => {
                          setSelectedSort(choice.value);
                          setIsSortMenuOpen(false);
                        }}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {filteredAgents.length > 0 ? (
            <>
              <div className={styles.agentGrid}>
                {visibleAgents.map((agent) => (
                  <article key={agent.slug} className={styles.agentCard}>
                    <Link prefetch={false} href={`/agents/${agent.slug}`} className={styles.imageLink}>
                      <div className={styles.imageWrap}>
                        <span className={styles.jobsBadge}>{agent.completedProjects} jobs</span>
                        <Image src={agent.image} alt={agent.name} width={320} height={400} className={styles.agentImage} />
                      </div>
                    </Link>

                    <div className={styles.cardBody}>
                      <h2>
                        <Link prefetch={false} href={`/agents/${agent.slug}`}>
                          {agent.name}
                        </Link>
                      </h2>
                      <p className={styles.role}>{agent.role}</p>
                      <p className={styles.specialty}>{agent.specialty}</p>

                      <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                          <Eye size={18} weight="regular" />
                          <span>{formatCompactNumber(agent.profileViews)}</span>
                        </span>
                        <span className={styles.metaItem}>
                          <HeartStraight size={18} weight="regular" />
                          <span>{formatCompactNumber(agent.likes)}</span>
                        </span>
                        <span className={styles.metaItem}>
                          <UsersThree size={18} weight="regular" />
                          <span>{formatCompactNumber(agent.followers)}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.paginationBar}>
                  <button
                    type="button"
                    className={styles.paginationButton}
                    onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))}
                    disabled={activePage === 0}
                  >
                    <CaretLeft size={16} weight="bold" />
                    <span>Prev</span>
                  </button>

                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: totalPages }, (_, index) => {
                      const active = index === activePage;
                      return (
                        <button
                          key={`agent-pagination-${index}`}
                          type="button"
                          className={`${styles.paginationNumber} ${active ? styles.paginationNumberActive : ''}`}
                          onClick={() => setActivePage(index)}
                          aria-label={`Go to page ${index + 1}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className={styles.paginationButton}
                    onClick={() => setActivePage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={activePage === totalPages - 1}
                  >
                    <span>Next</span>
                    <CaretRight size={16} weight="bold" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <h3>No agents match your search</h3>
              <p>Try a broader keyword such as a name, city, or specialty.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
