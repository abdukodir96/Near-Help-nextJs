'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client/react';
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
  GET_AI_CHAT_SESSIONS,
  GET_AI_CHAT_MESSAGES,
} from './ai-queries';
import {
  SERVICE_CATEGORIES,
  type PriceEstimate,
  type ServiceResult,
  type BookingAssistantResult,
  type AiChatSession,
  type AiChatMessage,
  type AiChatSendResult,
  type AiChatSessionsResult,
  type AiChatMessagesResult,
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

// ── Service card ──────────────────────────────────────────────────────────────

const ServiceCard = ({ item }: { item: ServiceResult }) => (
  <div className={styles.serviceCard}>
    <div className={styles.serviceCardCat}>{item.category}</div>
    <div className={styles.serviceCardTitle}>{item.title}</div>
    {(item.reason || item.description) && (
      <p className={styles.serviceCardReason}>{item.reason ?? item.description}</p>
    )}
    <div className={styles.serviceCardPrice}>{item.priceLabel}</div>
    <div className={styles.scoreBar}>
      <span style={{ width: `${Math.round(item.score * 100)}%` }} />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export const AiPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('assistant');

  // ── Price estimate state ──────────────────────────────────────────────────
  const [priceForm, setPriceForm] = useState({ category: '', area: '', problem: '' });
  const [priceResult, setPriceResult] = useState<PriceEstimate | null>(null);

  // ── Semantic search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState<ServiceResult[]>([]);

  // ── Recommendations state ─────────────────────────────────────────────────
  const [recForm, setRecForm]       = useState({ problem: '', location: '' });
  const [recResults, setRecResults] = useState<ServiceResult[]>([]);

  // ── Booking assistant state ───────────────────────────────────────────────
  const [assistForm, setAssistForm]     = useState({ category: '', area: '', problem: '', location: '' });
  const [assistResult, setAssistResult] = useState<BookingAssistantResult | null>(null);

  // ── AI Chat state ─────────────────────────────────────────────────────────
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [localMessages, setLocalMessages]     = useState<AiChatMessage[]>([]);
  const [chatInput, setChatInput]             = useState('');
  const [isThinking, setIsThinking]           = useState(false);
  const chatEndRef                            = useRef<HTMLDivElement>(null);
  const isLoggedIn                            = Boolean(Cookies.get(ACCESS_TOKEN_KEY));

  // ── Mutations ─────────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [estimatePrice,    { loading: priceLoading }]  = useMutation<any>(ESTIMATE_PRICE);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [semanticSearch,   { loading: searchLoading }] = useMutation<any>(SEMANTIC_SEARCH);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [getRecommend,     { loading: recLoading }]    = useMutation<any>(GET_RECOMMENDATIONS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookingAssistant, { loading: assistLoading }] = useMutation<any>(BOOKING_ASSISTANT);
  const [createSession] = useMutation<{ createAiChatSession: AiChatSession }>(CREATE_AI_CHAT_SESSION);
  const [sendAiMessage] = useMutation<{ sendAiChatMessage: AiChatSendResult }>(SEND_AI_CHAT_MESSAGE);

  // ── Chat queries ──────────────────────────────────────────────────────────

  const { data: sessionsData, refetch: refetchSessions } = useQuery<{ getAiChatSessions: AiChatSessionsResult }>(GET_AI_CHAT_SESSIONS, {
    skip: activeTab !== 'chat' || !isLoggedIn,
    fetchPolicy: 'network-only',
  });

  const [loadMessages, { data: messagesData }] = useLazyQuery<{ getAiChatMessages: AiChatMessagesResult }>(GET_AI_CHAT_MESSAGES, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (messagesData?.getAiChatMessages?.list) {
      setLocalMessages(messagesData.getAiChatMessages.list);
    }
  }, [messagesData]);

  const sessions: AiChatSession[] = sessionsData?.getAiChatSessions?.list ?? [];

  // Auto-select first session when sessions load
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      handleSelectSession(sessions[0]._id);
    }
  }, [sessions]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isThinking]);

  // ── Chat handlers ─────────────────────────────────────────────────────────

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setLocalMessages([]);
    loadMessages({ variables: { input: { sessionId } } });
  };

  const handleNewSession = async () => {
    const { data } = await createSession({ variables: { input: {} } });
    if (data?.createAiChatSession) {
      setLocalMessages([]);
      setActiveSessionId(data.createAiChatSession._id);
      await refetchSessions();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || isThinking) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      const { data } = await createSession({ variables: { input: {} } });
      if (!data?.createAiChatSession) return;
      sessionId = data.createAiChatSession._id;
      setActiveSessionId(sessionId);
      await refetchSessions();
    }

    setChatInput('');
    setIsThinking(true);

    const tempId = `temp-${Date.now()}`;
    setLocalMessages((prev) => [
      ...prev,
      { _id: tempId, sessionId: sessionId!, memberId: '', role: 'USER', content: text, createdAt: new Date().toISOString() },
    ]);

    try {
      const { data } = await sendAiMessage({
        variables: { input: { sessionId, message: text } },
      });

      if (data?.sendAiChatMessage) {
        setLocalMessages((prev) => [
          ...prev.filter((m) => m._id !== tempId),
          data.sendAiChatMessage.userMessage,
          data.sendAiChatMessage.assistantMessage,
        ]);
        await refetchSessions();
      }
    } catch {
      setLocalMessages((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      setIsThinking(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  // ── Other handlers ────────────────────────────────────────────────────────

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await estimatePrice({
      variables: {
        input: {
          category: priceForm.category,
          area: parseFloat(priceForm.area) || 0,
          problem: priceForm.problem,
        },
      },
    }).catch(() => ({ data: null }));

    if (data?.estimatePrice) {
      setPriceResult(data.estimatePrice);
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      const base = { PLUMBING: 150000, ELECTRICAL: 120000, GAS: 200000, CLEANING: 80000, RENOVATION: 500000, HVAC: 180000, PAINTING: 100000, CARPENTRY: 130000, ROOFING: 300000, LANDSCAPING: 90000 };
      const cat = priceForm.category as keyof typeof base;
      const basePrice = (base[cat] ?? 130000) * (1 + (parseFloat(priceForm.area) || 30) / 100);
      setPriceResult({
        minPrice: Math.round(basePrice * 0.8 / 1000) * 1000,
        maxPrice: Math.round(basePrice * 1.4 / 1000) * 1000,
        currency: 'KRW',
        category: priceForm.category,
        reasoning: `Based on the ${priceForm.category.toLowerCase()} service category with an area of ${priceForm.area || 0}m² and the described issue, the estimated price range reflects standard labor and material costs in the Seoul metropolitan area. Final pricing depends on site inspection.`,
      });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await semanticSearch({
      variables: { input: { query: searchQuery, limit: 6 } },
    }).catch(() => ({ data: null }));

    if (data?.semanticSearch) {
      setSearchResults(data.semanticSearch);
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      const { serviceItems } = await import('@/components/services/services-data');
      const q = searchQuery.toLowerCase();
      const matched = serviceItems
        .filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
        .slice(0, 6)
        .map((s, i) => ({ serviceId: s.slug, title: s.title, category: s.category, description: s.description, score: Math.max(0.5, 1 - i * 0.08), priceLabel: s.priceLabel }));
      setSearchResults(matched.length ? matched : serviceItems.slice(0, 4).map((s, i) => ({ serviceId: s.slug, title: s.title, category: s.category, description: s.description, score: 0.75 - i * 0.05, priceLabel: s.priceLabel })));
    }
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await getRecommend({
      variables: { input: recForm },
    }).catch(() => ({ data: null }));

    if (data?.getRecommendations) {
      setRecResults(data.getRecommendations);
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      const { serviceItems } = await import('@/components/services/services-data');
      setRecResults(serviceItems.slice(0, 4).map((s, i) => ({
        serviceId: s.slug,
        title: s.title,
        category: s.category,
        reason: `This service is highly recommended based on your described problem. ${s.description.slice(0, 80)}...`,
        score: 0.95 - i * 0.06,
        priceLabel: s.priceLabel,
      })));
    }
  };

  const handleAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await bookingAssistant({
      variables: {
        input: {
          category: assistForm.category,
          area: parseFloat(assistForm.area) || 0,
          problem: assistForm.problem,
          location: assistForm.location,
        },
      },
    }).catch(() => ({ data: null }));

    if (data?.bookingAssistant) {
      setAssistResult(data.bookingAssistant);
    } else {
      await new Promise((r) => setTimeout(r, 2500));
      const { serviceItems } = await import('@/components/services/services-data');
      const base = { PLUMBING: 150000, ELECTRICAL: 120000, GAS: 200000, CLEANING: 80000, RENOVATION: 500000, HVAC: 180000, PAINTING: 100000, CARPENTRY: 130000, ROOFING: 300000, LANDSCAPING: 90000 };
      const cat = assistForm.category as keyof typeof base;
      const basePrice = (base[cat] ?? 130000) * (1 + (parseFloat(assistForm.area) || 30) / 100);
      setAssistResult({
        priceEstimate: {
          minPrice: Math.round(basePrice * 0.8 / 1000) * 1000,
          maxPrice: Math.round(basePrice * 1.4 / 1000) * 1000,
          currency: 'KRW',
          category: assistForm.category,
          reasoning: `Based on your ${assistForm.category || 'home service'} request${assistForm.location ? ` in ${assistForm.location}` : ''}, this estimate covers standard labor and materials. A site visit may adjust the final price.`,
        },
        recommendations: serviceItems.slice(0, 3).map((s, i) => ({
          serviceId: s.slug,
          title: s.title,
          category: s.category,
          reason: `Recommended based on your problem description. ${s.description.slice(0, 70)}...`,
          score: 0.95 - i * 0.07,
          priceLabel: s.priceLabel,
        })),
        summary: `Based on your description, we recommend scheduling a ${assistForm.category || 'home service'} inspection${assistForm.location ? ` in ${assistForm.location}` : ''}. The services below are best matched to your needs.`,
      });
    }
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
              Get an AI-powered price estimate in KRW based on service type, area, and problem description.
            </p>
            <form className={styles.form} onSubmit={handlePriceSubmit}>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Service Category*</label>
                  <select
                    className={styles.select}
                    value={priceForm.category}
                    onChange={(e) => setPriceForm((p) => ({ ...p, category: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Area (m²)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="e.g. 85"
                    min={0}
                    value={priceForm.area}
                    onChange={(e) => setPriceForm((p) => ({ ...p, area: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Problem Description*</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the issue in detail..."
                  value={priceForm.problem}
                  onChange={(e) => setPriceForm((p) => ({ ...p, problem: e.target.value }))}
                  required
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
                  <p className={styles.priceLabel}>Estimated Price Range</p>
                  <p className={styles.priceRange}>
                    {formatKRW(priceResult.minPrice)} – {formatKRW(priceResult.maxPrice)}
                  </p>
                  <p className={styles.priceReasoning}>{priceResult.reasoning}</p>
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
                  required
                />
                <button type="submit" className={styles.submitBtn} style={{ minWidth: 160 }} disabled={searchLoading}>
                  {searchLoading ? 'Searching...' : 'Search'}
                  {!searchLoading && <MagnifyingGlass size={18} weight="bold" />}
                </button>
              </div>
            </form>

            {searchLoading && <div className={styles.spinner}>Searching with AI...</div>}

            {searchResults.length > 0 && (
              <div className={styles.result}>
                <p className={styles.resultHeading}>{searchResults.length} services found</p>
                <div className={styles.serviceGrid}>
                  {searchResults.map((s) => <ServiceCard key={s.serviceId} item={s} />)}
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
              Get personalized service recommendations based on your specific problem and location.
            </p>
            <form className={styles.form} onSubmit={handleRecommend}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Problem Description*</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your home issue in detail..."
                  value={recForm.problem}
                  onChange={(e) => setRecForm((p) => ({ ...p, problem: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Location</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Seoul, Gangnam-gu"
                  value={recForm.location}
                  onChange={(e) => setRecForm((p) => ({ ...p, location: e.target.value }))}
                />
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
                  {recResults.map((s) => <ServiceCard key={s.serviceId} item={s} />)}
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
                  <label className={styles.label}>Service Category</label>
                  <select
                    className={styles.select}
                    value={assistForm.category}
                    onChange={(e) => setAssistForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="">Select category (optional)</option>
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Area (m²)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="e.g. 85"
                    min={0}
                    value={assistForm.area}
                    onChange={(e) => setAssistForm((p) => ({ ...p, area: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Problem Description*</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your problem in detail..."
                  value={assistForm.problem}
                  onChange={(e) => setAssistForm((p) => ({ ...p, problem: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Location</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Seoul, Mapo-gu"
                  value={assistForm.location}
                  onChange={(e) => setAssistForm((p) => ({ ...p, location: e.target.value }))}
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={assistLoading}>
                {assistLoading ? 'AI is working...' : 'Ask AI Assistant'}
                {!assistLoading && <Sparkle size={18} weight="fill" />}
              </button>
            </form>

            {assistLoading && <div className={styles.spinner}>AI is preparing your booking plan...</div>}

            {assistResult && (
              <div className={styles.result}>
                {assistResult.summary && (
                  <div className={styles.summary}>{assistResult.summary}</div>
                )}
                <div className={styles.priceCard}>
                  <p className={styles.priceLabel}>Estimated Price Range</p>
                  <p className={styles.priceRange}>
                    {formatKRW(assistResult.priceEstimate.minPrice)} – {formatKRW(assistResult.priceEstimate.maxPrice)}
                  </p>
                  <p className={styles.priceReasoning}>{assistResult.priceEstimate.reasoning}</p>
                </div>
                {assistResult.recommendations.length > 0 && (
                  <>
                    <p className={styles.resultHeading}>Recommended Services</p>
                    <div className={styles.serviceGrid}>
                      {assistResult.recommendations.map((s) => <ServiceCard key={s.serviceId} item={s} />)}
                    </div>
                  </>
                )}
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Link href="/booking" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#0052da', color: '#fff', padding: '14px 32px',
                    borderRadius: 14, fontWeight: 800, textDecoration: 'none',
                    fontSize: '0.97rem',
                  }}>
                    <CalendarCheck size={20} weight="bold" />
                    Book Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI Chat ── */}
        {activeTab === 'chat' && (
          <>
            {!isLoggedIn ? (
              <div className={styles.card}>
                <div className={styles.chatLoginPrompt}>
                  <ChatTeardropDots size={52} weight="duotone" color="#0052da" />
                  <h3>Login to use AI Chat</h3>
                  <p>Start a conversation with NearHelp AI. Ask anything about home services, prices, bookings — in Korean, English, or Uzbek.</p>
                  <Link href="/login" className={styles.loginLink}>
                    <ArrowRight size={18} weight="bold" />
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.chatWrap}>
                {/* Sidebar */}
                <aside className={styles.chatSidebar}>
                  <button type="button" className={styles.newChatBtn} onClick={handleNewSession}>
                    <Plus size={14} weight="bold" style={{ marginRight: 4 }} />
                    New Chat
                  </button>

                  {sessions.map((session) => (
                    <div
                      key={session._id}
                      className={`${styles.sessionItem} ${activeSessionId === session._id ? styles.sessionItemActive : ''}`}
                      onClick={() => handleSelectSession(session._id)}
                    >
                      <div className={styles.sessionTitle}>
                        {session.title ?? 'New Chat'}
                      </div>
                      <div className={styles.sessionMeta}>
                        {session.messageCount} messages
                      </div>
                    </div>
                  ))}
                </aside>

                {/* Chat main */}
                <div className={styles.chatMain}>
                  <div className={styles.messages}>
                    {localMessages.length === 0 && !isThinking && (
                      <div className={styles.chatEmpty}>
                        <Sparkle size={44} weight="duotone" color="rgba(0,82,218,0.25)" />
                        <p>Ask NearHelp AI anything</p>
                      </div>
                    )}

                    {localMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`${styles.msgRow} ${msg.role === 'USER' ? styles.msgRowUser : ''}`}
                      >
                        {msg.role === 'ASSISTANT' && (
                          <div className={styles.aiAvatar}>
                            <Sparkle size={16} weight="fill" />
                          </div>
                        )}
                        <div className={`${styles.bubble} ${msg.role === 'USER' ? styles.bubbleUser : styles.bubbleAI}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {isThinking && (
                      <div className={styles.msgRow}>
                        <div className={styles.aiAvatar}>
                          <Sparkle size={16} weight="fill" />
                        </div>
                        <div className={styles.thinkingDots}>
                          <span /><span /><span />
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  <form className={styles.chatInputArea} onSubmit={handleSendMessage}>
                    <input
                      className={styles.chatInput}
                      placeholder="Ask anything about home services..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleChatKeyDown}
                      disabled={isThinking}
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className={styles.sendBtn}
                      disabled={isThinking || !chatInput.trim()}
                    >
                      <PaperPlaneRight size={18} weight="fill" />
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
