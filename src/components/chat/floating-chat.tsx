'use client';

import { useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { X, PaperPlaneTilt, Sparkle, ChatCircleText } from 'phosphor-react';
import { useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { CREATE_AI_CHAT_SESSION, SEND_AI_CHAT_MESSAGE } from '@/components/ai/ai-queries';
import type { AiChatSession, AiChatSendResult } from '@/components/ai/ai-types';
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

const initialMessages: ChatMessage[] = [
  { id: '1', author: 'Admin', text: 'Hello! How can I help you today?', time: '20:35' },
];

const WS_CHAT_URL = 'ws://localhost:3007/ws/chat';

// ── Component ─────────────────────────────────────────────────────────────────

export const FloatingChat = () => {
  const router     = useRouter();
  const isLoggedIn = !!Cookies.get(ACCESS_TOKEN_KEY);

  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen,   setAiOpen]   = useState(false);

  // Community chat
  const [messages,  setMessages]  = useState<ChatMessage[]>(initialMessages);
  const [chatDraft, setChatDraft] = useState('');
  const chatWsRef  = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // AI chat
  const [aiMessages,  setAiMessages]  = useState<AiMessage[]>([]);
  const [aiDraft,     setAiDraft]     = useState('');
  const [aiTyping,    setAiTyping]    = useState(false);
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);
  const aiEndRef = useRef<HTMLDivElement | null>(null);

  // ── Apollo mutations ──────────────────────────────────────────────────────

  const [createSession] = useMutation<{ createAiChatSession: AiChatSession }>(CREATE_AI_CHAT_SESSION);
  const [sendAiMessage] = useMutation<{ sendAiChatMessage: AiChatSendResult }>(SEND_AI_CHAT_MESSAGE);

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

  // ── Community chat ────────────────────────────────────────────────────────

  const openChat = () => {
    setChatOpen(true);
    if (isLoggedIn && !chatWsRef.current) {
      const ws = new WebSocket(WS_CHAT_URL);
      chatWsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { author: string; text: string };
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), author: data.author, text: data.text, time: nowTime() },
          ]);
        } catch { /* ignore */ }
      };
      ws.onerror = () => { /* silently fail */ };
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    chatWsRef.current?.close();
    chatWsRef.current = null;
  };

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
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  // ── AI chat ───────────────────────────────────────────────────────────────

  const sendAi = async () => {
    if (!isLoggedIn) { await requireLogin(); return; }
    const text = aiDraft.trim();
    if (!text || aiTyping) return;

    const tempId = `t${Date.now()}`;
    setAiMessages((prev) => [...prev, { id: tempId, role: 'user', text, time: nowTime() }]);
    setAiDraft('');
    setAiTyping(true);
    setTimeout(() => aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      let sid = aiSessionId;
      if (!sid) {
        const { data: sd } = await createSession({ variables: { input: {} } });
        if (!sd?.createAiChatSession?._id) throw new Error('Session creation failed');
        sid = sd.createAiChatSession._id;
        setAiSessionId(sid);
      }

      const { data } = await sendAiMessage({
        variables: { input: { sessionId: sid, message: text } },
      });

      if (data?.sendAiChatMessage) {
        const { userMessage, assistantMessage } = data.sendAiChatMessage;
        setAiMessages((prev) => [
          ...prev.filter((m) => m.id !== tempId),
          { id: userMessage._id,      role: 'user', text: userMessage.content,      time: nowTime() },
          { id: assistantMessage._id, role: 'ai',   text: assistantMessage.content, time: nowTime() },
        ]);
      }
    } catch {
      setAiMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setAiTyping(false);
      setTimeout(() => aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  const handleKey = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); }
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
            <button type="button" className={styles.closeBtn} onClick={closeChat}>
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
              onKeyDown={(e) => handleKey(e, sendChat)}
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
            {aiMessages.length === 0 && !aiTyping && (
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
            {aiTyping && (
              <div className={styles.messageBubble}>
                <p className={styles.typing}>AI is typing...</p>
              </div>
            )}
            <div ref={aiEndRef} />
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.messageInput}
              placeholder="Ask AI anything..."
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              onKeyDown={(e) => handleKey(e, sendAi)}
              autoComplete="off"
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
          onClick={() => (chatOpen ? closeChat() : openChat())}
        >
          <ChatCircleText size={22} weight="fill" />
          Chat
        </button>
      </div>
    </>
  );
};
