'use client';

import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { X, PaperPlaneTilt, Sparkle, ChatCircleText } from 'phosphor-react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import {
  CREATE_AI_CHAT_SESSION,
  SEND_AI_CHAT_MESSAGE,
  GET_AI_CHAT_SESSIONS,
} from '@/components/ai/ai-queries';
import type { AiChatSession, AiChatSendResult, AiChatSessionsResult } from '@/components/ai/ai-types';
import styles from './floating-chat.module.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatMessage = {
  id: string;
  author: string;
  text: string;
  time: string;
  mine?: boolean;
};

type AiMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const nowTime = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// ── Mock initial messages ─────────────────────────────────────────────────────

const initialMessages: ChatMessage[] = [
  { id: '1', author: 'Admin', text: 'Hello! How can I help you today?', time: '20:35' },
];

// ── WS URL ────────────────────────────────────────────────────────────────────

const WS_CHAT_URL = 'ws://localhost:3007/ws/chat';

// ── Component ─────────────────────────────────────────────────────────────────

export const FloatingChat = () => {
  const router    = useRouter();
  const isLoggedIn = !!Cookies.get(ACCESS_TOKEN_KEY);

  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen,   setAiOpen]   = useState(false);

  // Community chat state
  const [messages,   setMessages]   = useState<ChatMessage[]>(initialMessages);
  const [chatDraft,  setChatDraft]  = useState('');
  const chatWsRef  = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // AI chat state
  const [aiMessages,   setAiMessages]   = useState<AiMessage[]>([]);
  const [aiDraft,      setAiDraft]      = useState('');
  const [aiTyping,     setAiTyping]     = useState(false);
  const [aiSessionId,  setAiSessionId]  = useState<string | null>(null);
  const aiEndRef = useRef<HTMLDivElement | null>(null);

  // ── AI GraphQL ────────────────────────────────────────────────────────────────

  const { data: sessionsData, refetch: refetchSessions } = useQuery<{ getAiChatSessions: AiChatSessionsResult }>(
    GET_AI_CHAT_SESSIONS,
    { skip: !aiOpen || !isLoggedIn, fetchPolicy: 'network-only' },
  );

  const [createSession] = useMutation<{ createAiChatSession: AiChatSession }>(CREATE_AI_CHAT_SESSION);
  const [sendAiMessage] = useMutation<{ sendAiChatMessage: AiChatSendResult }>(SEND_AI_CHAT_MESSAGE);

  // Auto-pick or create session when AI panel opens
  useEffect(() => {
    if (!aiOpen || !isLoggedIn || aiSessionId) return;

    const sessions = sessionsData?.getAiChatSessions?.list ?? [];
    if (sessions.length > 0) {
      setAiSessionId(sessions[0]._id);
    } else if (sessionsData) {
      // Sessions loaded but empty — create one
      createSession({ variables: { input: {} } }).then(({ data }) => {
        if (data?.createAiChatSession) {
          setAiSessionId(data.createAiChatSession._id);
        }
      }).catch(() => null);
    }
  }, [aiOpen, isLoggedIn, sessionsData, aiSessionId]);

  // ── WebSocket: community chat ──────────────────────────────────────────────

  useEffect(() => {
    if (!chatOpen || !isLoggedIn) return;

    const ws = new WebSocket(WS_CHAT_URL);
    chatWsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { author: string; text: string };
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), author: data.author, text: data.text, time: nowTime() },
        ]);
      } catch { /* ignore malformed frames */ }
    };

    ws.onerror = () => { /* silently fail */ };

    return () => { ws.close(); chatWsRef.current = null; };
  }, [chatOpen, isLoggedIn]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages, aiTyping]);

  // ── Auth guard ────────────────────────────────────────────────────────────

  const requireLogin = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Login required',
      text: 'Please log in to use the chat.',
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0052da',
      cancelButtonColor: '#6b7280',
    });
    if (result.isConfirmed) router.push('/auth/login');
  };

  // ── Send: community ────────────────────────────────────────────────────────

  const sendChat = async () => {
    if (!isLoggedIn) { await requireLogin(); return; }
    const text = chatDraft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), author: 'You', text, time: nowTime(), mine: true },
    ]);
    setChatDraft('');

    if (chatWsRef.current?.readyState === WebSocket.OPEN) {
      chatWsRef.current.send(JSON.stringify({ text }));
    }
  };

  // ── Send: AI (GraphQL) ────────────────────────────────────────────────────

  const sendAi = async () => {
    if (!isLoggedIn) { await requireLogin(); return; }
    const text = aiDraft.trim();
    if (!text || aiTyping) return;

    let sessionId = aiSessionId;

    // Create session on first message if none exists
    if (!sessionId) {
      try {
        const { data } = await createSession({ variables: { input: {} } });
        if (!data?.createAiChatSession) return;
        sessionId = data.createAiChatSession._id;
        setAiSessionId(sessionId);
        await refetchSessions();
      } catch {
        return;
      }
    }

    const tempId = `temp-${Date.now()}`;
    setAiMessages((prev) => [
      ...prev,
      { id: tempId, role: 'user', text, time: nowTime() },
    ]);
    setAiDraft('');
    setAiTyping(true);

    try {
      const { data } = await sendAiMessage({
        variables: { input: { sessionId, message: text } },
      });

      if (data?.sendAiChatMessage) {
        setAiMessages((prev) => [
          ...prev.filter((m) => m.id !== tempId),
          { id: data.sendAiChatMessage.userMessage._id,      role: 'user', text: data.sendAiChatMessage.userMessage.content,      time: nowTime() },
          { id: data.sendAiChatMessage.assistantMessage._id, role: 'ai',   text: data.sendAiChatMessage.assistantMessage.content, time: nowTime() },
        ]);
      }
    } catch {
      setAiMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setAiTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, send: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Community Chat Panel */}
      {chatOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <h3>Chat with Admin</h3>
              <p><span className={styles.liveDot} />Live now</p>
            </div>
            <button type="button" className={styles.closeBtn} onClick={() => setChatOpen(false)}>
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className={styles.messageList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${msg.mine ? styles.aiBubble : styles.userBubble}`}
              >
                <div className={styles.messageTop}>
                  <span className={styles.messageAuthor}>{msg.author}</span>
                  <span className={styles.messageTime}>{msg.time}</span>
                </div>
                <p className={styles.messageText}>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.messageInput}
              placeholder="Type a message..."
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, sendChat)}
            />
            <button
              type="button"
              className={styles.sendBtn}
              disabled={!chatDraft.trim()}
              onClick={() => void sendChat()}
            >
              <PaperPlaneTilt size={20} weight="fill" />
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Panel */}
      {aiOpen && (
        <div
          className={`${styles.panel} ${chatOpen ? styles.panelShifted : ''}`}
          style={chatOpen ? { right: 420 } : undefined}
        >
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <h3>AI Assistant</h3>
              <p><span className={`${styles.liveDot} ${styles.liveDotAi}`} />Powered by NearHelp AI</p>
            </div>
            <button type="button" className={styles.closeBtn} onClick={() => setAiOpen(false)}>
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className={styles.messageList}>
            {aiMessages.length === 0 && (
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>
                  Hi! I&apos;m the NearHelp AI assistant. Ask me anything about our services.
                </p>
              </div>
            )}
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${msg.role === 'user' ? styles.aiBubble : styles.userBubble}`}
              >
                <div className={styles.messageTop}>
                  <span className={styles.messageAuthor}>{msg.role === 'ai' ? 'AI Assistant' : 'You'}</span>
                  <span className={styles.messageTime}>{msg.time}</span>
                </div>
                <p className={styles.messageText}>{msg.text}</p>
              </div>
            ))}
            {aiTyping && <p className={styles.typing}>AI is typing...</p>}
            <div ref={aiEndRef} />
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.messageInput}
              placeholder="Ask AI anything..."
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, sendAi)}
              disabled={aiTyping}
            />
            <button
              type="button"
              className={`${styles.sendBtn} ${styles.sendBtnAi}`}
              disabled={!aiDraft.trim() || aiTyping}
              onClick={() => void sendAi()}
            >
              <PaperPlaneTilt size={20} weight="fill" />
            </button>
          </div>
        </div>
      )}

      {/* Floating buttons */}
      <div className={styles.floatWrap}>
        <button
          type="button"
          className={`${styles.floatBtn} ${styles.aiBtn}`}
          onClick={() => setAiOpen((p) => !p)}
        >
          <Sparkle size={22} weight="fill" />
          AI Chat
        </button>

        <button
          type="button"
          className={`${styles.floatBtn} ${styles.chatBtn}`}
          onClick={() => setChatOpen((p) => !p)}
        >
          <ChatCircleText size={22} weight="fill" />
          Chat
        </button>
      </div>
    </>
  );
};
