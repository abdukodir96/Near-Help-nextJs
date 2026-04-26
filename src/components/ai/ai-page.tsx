'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import Cookies from 'js-cookie';
import {
  Sparkle,
  CurrencyKrw,
  MagnifyingGlass,
  ListChecks,
  CalendarCheck,
  ArrowRight,
} from 'phosphor-react';
import {
  ESTIMATE_PRICE,
  SEMANTIC_SEARCH,
  GET_RECOMMENDATIONS,
  BOOKING_ASSISTANT,
  CREATE_AI_CHAT_SESSION,
  SEND_AI_CHAT_MESSAGE,
} from './ai-queries';
import {
  SERVICE_CATEGORIES,
  SERVICE_OPTIONS,
  SERVICE_LOCATIONS,
  type PriceEstimate,
  type ServiceItem,
  type ServicesResult,
  type BookingAssistantResult,
} from './ai-types';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import styles from './ai-page.module.scss';

type TabKey = 'price' | 'search' | 'recommend' | 'assistant';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'price',     label: 'Price Estimate',   icon: <CurrencyKrw size={18} weight="bold" /> },
  { key: 'search',    label: 'Semantic Search',   icon: <MagnifyingGlass size={18} weight="bold" /> },
  { key: 'recommend', label: 'Recommendations',   icon: <ListChecks size={18} weight="bold" /> },
  { key: 'assistant', label: 'Booking Assistant', icon: <CalendarCheck size={18} weight="bold" /> },
];

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(n);

const formatCategoryLabel = (c: string) =>
  c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

// ── Service card ──────────────────────────────────────────────────────────────

const ServiceCard = ({ item }: { item: ServiceItem }) => (
  <div className={styles.serviceCard}>
    <div className={styles.serviceCardCat}>{formatCategoryLabel(item.serviceCategory)}</div>
    <div className={styles.serviceCardTitle}>{item.serviceTitle}</div>
    <div className={styles.serviceCardPrice}>{formatKRW(item.servicePrice)}</div>
    {item.serviceArea && (
      <p className={styles.serviceCardReason}>{item.serviceArea} · {item.serviceOption}</p>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export const AiPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('assistant');

  // Price
  const [priceForm, setPriceForm] = useState({
    serviceCategory: '', serviceArea: '', serviceOption: '', problemDescription: '', urgencyNote: '',
  });
  const [priceResult, setPriceResult] = useState<PriceEstimate | null>(null);

  // Search
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchArea,    setSearchArea]    = useState('');
  const [searchResults, setSearchResults] = useState<ServiceItem[]>([]);

  // Recommendations
  const [recForm, setRecForm] = useState({
    problemDescription: '', serviceCategory: '', serviceArea: '', serviceOption: '',
  });
  const [recResults, setRecResults] = useState<ServiceItem[]>([]);

  // Booking assistant
  const [assistForm, setAssistForm] = useState({
    problemDescription: '', serviceCategory: '', serviceArea: '', serviceOption: '', urgencyNote: '',
  });
  const [assistResult, setAssistResult] = useState<BookingAssistantResult | null>(null);

  // ── Queries (lazy) ────────────────────────────────────────────────────────

  const [runEstimate,   { loading: priceLoading }]  = useLazyQuery<{ estimateServicePrice: PriceEstimate }>(ESTIMATE_PRICE, { fetchPolicy: 'no-cache' });
  const [runSearch,     { loading: searchLoading }] = useLazyQuery<{ semanticSearchServices: ServicesResult }>(SEMANTIC_SEARCH, { fetchPolicy: 'no-cache' });
  const [runRecommend,  { loading: recLoading }]    = useLazyQuery<{ recommendServices: ServicesResult }>(GET_RECOMMENDATIONS, { fetchPolicy: 'no-cache' });
  const [runAssistant,  { loading: assistLoading }] = useLazyQuery<{ recommendAndEstimateServices: BookingAssistantResult }>(BOOKING_ASSISTANT, { fetchPolicy: 'no-cache' });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await runEstimate({
      variables: {
        input: {
          serviceCategory:    priceForm.serviceCategory || undefined,
          serviceArea:        priceForm.serviceArea    || undefined,
          serviceOption:      priceForm.serviceOption  || undefined,
          problemDescription: priceForm.problemDescription,
          urgencyNote:        priceForm.urgencyNote    || undefined,
        },
      },
    });
    if (data?.estimateServicePrice) setPriceResult(data.estimateServicePrice);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await runSearch({
      variables: {
        input: {
          searchQuery,
          serviceArea: searchArea || undefined,
          limit: 6,
        },
      },
    });
    if (data?.semanticSearchServices) setSearchResults(data.semanticSearchServices.list);
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await runRecommend({
      variables: {
        input: {
          problemDescription: recForm.problemDescription,
          serviceCategory:    recForm.serviceCategory || undefined,
          serviceArea:        recForm.serviceArea     || undefined,
          serviceOption:      recForm.serviceOption   || undefined,
          limit: 6,
        },
      },
    });
    if (data?.recommendServices) setRecResults(data.recommendServices.list);
  };

  const handleAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await runAssistant({
      variables: {
        input: {
          problemDescription: assistForm.problemDescription,
          serviceCategory:    assistForm.serviceCategory,
          serviceArea:        assistForm.serviceArea   || undefined,
          serviceOption:      assistForm.serviceOption || undefined,
          urgencyNote:        assistForm.urgencyNote   || undefined,
        },
      },
    });
    if (data?.recommendAndEstimateServices) setAssistResult(data.recommendAndEstimateServices);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>AI Assistant</p>
        <h1 className={styles.heroTitle}>
          <Sparkle size={36} weight="fill" style={{ verticalAlign: 'middle', marginRight: 10 }} />
          NearHelp AI
        </h1>
        <p className={styles.heroSub}>
          Get instant price estimates, semantic service search, and AI-powered booking recommendations.
        </p>
      </div>

      <div className={styles.container}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Price Estimate ── */}
        {activeTab === 'price' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Price Estimation</h2>
            <p className={styles.cardSub}>
              Get an AI-powered price estimate in KRW based on service type, location, and problem description.
            </p>
            <form className={styles.form} onSubmit={handlePriceSubmit}>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Service Category*</label>
                  <select
                    className={styles.select}
                    value={priceForm.serviceCategory}
                    onChange={(e) => setPriceForm((p) => ({ ...p, serviceCategory: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatCategoryLabel(c)}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Service Option</label>
                  <select
                    className={styles.select}
                    value={priceForm.serviceOption}
                    onChange={(e) => setPriceForm((p) => ({ ...p, serviceOption: e.target.value }))}
                  >
                    <option value="">Any option</option>
                    {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Service Area</label>
                <select
                  className={styles.select}
                  value={priceForm.serviceArea}
                  onChange={(e) => setPriceForm((p) => ({ ...p, serviceArea: e.target.value }))}
                >
                  <option value="">Any location</option>
                  {SERVICE_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Problem Description* (min. 10 chars)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the issue in detail..."
                  value={priceForm.problemDescription}
                  minLength={10}
                  onChange={(e) => setPriceForm((p) => ({ ...p, problemDescription: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Urgency Note (optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Same-day repair needed"
                  value={priceForm.urgencyNote}
                  onChange={(e) => setPriceForm((p) => ({ ...p, urgencyNote: e.target.value }))}
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={priceLoading}>
                {priceLoading ? 'Estimating...' : 'Get Price Estimate'}
                {!priceLoading && <ArrowRight size={18} weight="bold" />}
              </button>
            </form>

            {priceLoading && <div className={styles.spinner}>Analyzing your request...</div>}

            {priceResult && (
              <div className={styles.result}>
                <div className={styles.priceCard}>
                  <p className={styles.priceLabel}>Estimated Price Range ({priceResult.confidence}% confidence)</p>
                  <p className={styles.priceRange}>
                    {formatKRW(priceResult.estimatedMinPrice)} – {formatKRW(priceResult.estimatedMaxPrice)}
                  </p>
                  <p className={styles.priceReasoning}>{priceResult.summary}</p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: 10 }}>{priceResult.disclaimer}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Semantic Search ── */}
        {activeTab === 'search' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Semantic Service Search</h2>
            <p className={styles.cardSub}>
              Describe your problem in natural language and AI will find the most relevant services using vector embeddings.
            </p>
            <form className={styles.form} onSubmit={handleSearch}>
              <div className={styles.searchRow}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="e.g. water leaking from ceiling after rain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  minLength={3}
                  required
                />
                <button type="submit" className={styles.submitBtn} style={{ minWidth: 160 }} disabled={searchLoading}>
                  {searchLoading ? 'Searching...' : 'Search'}
                  {!searchLoading && <MagnifyingGlass size={18} weight="bold" />}
                </button>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Filter by Area (optional)</label>
                <select
                  className={styles.select}
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                >
                  <option value="">All locations</option>
                  {SERVICE_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </form>

            {searchLoading && <div className={styles.spinner}>Searching with AI...</div>}

            {searchResults.length > 0 && (
              <div className={styles.result}>
                <p className={styles.resultHeading}>{searchResults.length} services found</p>
                <div className={styles.serviceGrid}>
                  {searchResults.map((s) => <ServiceCard key={String(s._id)} item={s} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Recommendations ── */}
        {activeTab === 'recommend' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>AI Service Recommendations</h2>
            <p className={styles.cardSub}>
              Get personalized service recommendations based on your specific problem and preferences.
            </p>
            <form className={styles.form} onSubmit={handleRecommend}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Problem Description* (min. 10 chars)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your home issue in detail..."
                  value={recForm.problemDescription}
                  minLength={10}
                  onChange={(e) => setRecForm((p) => ({ ...p, problemDescription: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category (optional)</label>
                  <select
                    className={styles.select}
                    value={recForm.serviceCategory}
                    onChange={(e) => setRecForm((p) => ({ ...p, serviceCategory: e.target.value }))}
                  >
                    <option value="">Any category</option>
                    {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{formatCategoryLabel(c)}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Area (optional)</label>
                  <select
                    className={styles.select}
                    value={recForm.serviceArea}
                    onChange={(e) => setRecForm((p) => ({ ...p, serviceArea: e.target.value }))}
                  >
                    <option value="">Any location</option>
                    {SERVICE_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={recLoading}>
                {recLoading ? 'Analyzing...' : 'Get Recommendations'}
                {!recLoading && <ListChecks size={18} weight="bold" />}
              </button>
            </form>

            {recLoading && <div className={styles.spinner}>AI is finding the best services...</div>}

            {recResults.length > 0 && (
              <div className={styles.result}>
                <p className={styles.resultHeading}>Top {recResults.length} recommendations</p>
                <div className={styles.serviceGrid}>
                  {recResults.map((s) => <ServiceCard key={String(s._id)} item={s} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Booking Assistant ── */}
        {activeTab === 'assistant' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>AI Booking Assistant</h2>
            <p className={styles.cardSub}>
              Get a complete booking package — price estimate and top service recommendations in one step.
            </p>
            <form className={styles.form} onSubmit={handleAssistant}>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Service Category*</label>
                  <select
                    className={styles.select}
                    value={assistForm.serviceCategory}
                    onChange={(e) => setAssistForm((p) => ({ ...p, serviceCategory: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{formatCategoryLabel(c)}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Service Option</label>
                  <select
                    className={styles.select}
                    value={assistForm.serviceOption}
                    onChange={(e) => setAssistForm((p) => ({ ...p, serviceOption: e.target.value }))}
                  >
                    <option value="">Any option</option>
                    {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Problem Description* (min. 10 chars)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your problem in detail..."
                  value={assistForm.problemDescription}
                  minLength={10}
                  onChange={(e) => setAssistForm((p) => ({ ...p, problemDescription: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Area (optional)</label>
                  <select
                    className={styles.select}
                    value={assistForm.serviceArea}
                    onChange={(e) => setAssistForm((p) => ({ ...p, serviceArea: e.target.value }))}
                  >
                    <option value="">Any location</option>
                    {SERVICE_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Urgency Note (optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Need service today"
                    value={assistForm.urgencyNote}
                    onChange={(e) => setAssistForm((p) => ({ ...p, urgencyNote: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={assistLoading}>
                {assistLoading ? 'AI is working...' : 'Ask AI Assistant'}
                {!assistLoading && <Sparkle size={18} weight="fill" />}
              </button>
            </form>

            {assistLoading && <div className={styles.spinner}>AI is preparing your booking plan...</div>}

            {assistResult && (
              <div className={styles.result}>
                {assistResult.summary && <div className={styles.summary}>{assistResult.summary}</div>}

                <div className={styles.priceCard}>
                  <p className={styles.priceLabel}>
                    Estimated Price Range ({assistResult.priceEstimate.confidence}% confidence)
                  </p>
                  <p className={styles.priceRange}>
                    {formatKRW(assistResult.priceEstimate.estimatedMinPrice)} – {formatKRW(assistResult.priceEstimate.estimatedMaxPrice)}
                  </p>
                  <p className={styles.priceReasoning}>{assistResult.priceEstimate.summary}</p>
                </div>

                {assistResult.recommendedServices.list.length > 0 && (
                  <>
                    <p className={styles.resultHeading}>Recommended Services</p>
                    <div className={styles.serviceGrid}>
                      {assistResult.recommendedServices.list.map((s) => (
                        <ServiceCard key={String(s._id)} item={s} />
                      ))}
                    </div>
                  </>
                )}

                {assistResult.nextAction && (
                  <div className={styles.summary} style={{ marginTop: 16 }}>{assistResult.nextAction}</div>
                )}

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Link href="/booking" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#0052da', color: '#fff', padding: '14px 32px',
                    borderRadius: 14, fontWeight: 800, textDecoration: 'none', fontSize: '0.97rem',
                  }}>
                    <CalendarCheck size={20} weight="bold" />
                    Book Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
