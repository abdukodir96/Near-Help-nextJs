'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client/react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import {
  PaperPlaneTilt,
  Paperclip,
  Image as ImageIcon,
  UserCircle,
  ChatCircleText,
  Trash,
  File as FileIcon,
} from 'phosphor-react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { BACKEND_URL } from '@/lib/config/env';
import {
  GET_MY_THREADS,
  GET_MESSAGES,
  SEND_MESSAGE,
  MARK_MESSAGES_READ,
  DELETE_MESSAGE,
  ON_MESSAGE_SENT,
  ON_THREAD_UPDATED,
} from './message-queries';
import type { Message, MessageThread } from './message-types';
import styles from './message-page.module.scss';

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });

// ── Main component ────────────────────────────────────────────────────────────

export const MessagePage = () => {
  const router = useRouter();
  const isLoggedIn = !!Cookies.get(ACCESS_TOKEN_KEY);

  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [draft,        setDraft]        = useState('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef  = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please log in to view your messages.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'Go to Login',
      }).then(() => router.push('/auth/login'));
    }
  }, [isLoggedIn, router]);

  // ── Threads query ───────────────────────────────────────────────────────────

  const { data: threadsData, loading: threadsLoading, refetch: refetchThreads } = useQuery<{
    getMyThreads: { list: MessageThread[]; metaCounter: { total: number } };
  }>(GET_MY_THREADS, {
    variables: { input: { page: 1, limit: 30 } },
    skip: !isLoggedIn,
  });

  const threads = threadsData?.getMyThreads?.list ?? [];

  const filteredThreads = threads.filter((t) =>
    t.memberData.memberNick.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.memberData.memberFullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Messages query ──────────────────────────────────────────────────────────

  const { data: messagesData, loading: messagesLoading } = useQuery<{
    getMessages: { list: Message[]; metaCounter: { total: number } };
  }>(GET_MESSAGES, {
    variables: { input: { threadId: activeThread?._id, page: 1, limit: 30 } },
    skip: !activeThread,
  });

  const messages = messagesData?.getMessages?.list ?? [];

  // ── Subscriptions ───────────────────────────────────────────────────────────

  useSubscription<{ messageSent: Message }>(ON_MESSAGE_SENT, {
    variables: { threadId: activeThread?._id },
    skip: !activeThread,
    onData: ({ client, data }) => {
      const newMsg = data.data?.messageSent;
      if (!newMsg) return;
      client.cache.modify({
        fields: {
          getMessages(existing = { list: [] }) {
            return { ...existing, list: [...existing.list, newMsg] };
          },
        },
      });
    },
  });

  useSubscription(ON_THREAD_UPDATED, {
    skip: !isLoggedIn,
    onData: () => refetchThreads(),
  });

  // ── Mutations ───────────────────────────────────────────────────────────────

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [markRead]    = useMutation(MARK_MESSAGES_READ);
  const [deleteMsg]   = useMutation(DELETE_MESSAGE);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Mark as read when thread opens ──────────────────────────────────────────

  useEffect(() => {
    if (activeThread) {
      markRead({ variables: { threadId: activeThread._id } }).catch(() => {});
    }
  }, [activeThread, markRead]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !activeThread) return;
    setDraft('');
    await sendMessage({
      variables: {
        input: {
          threadId: activeThread._id,
          receiverId: activeThread.memberData._id,
          messageType: 'TEXT',
          messageText: text,
        },
      },
    }).catch(() => {});
  };

  const handleFileUpload = async (file: File, type: 'IMAGE' | 'FILE') => {
    if (!activeThread) return;
    await sendMessage({
      variables: {
        input: {
          threadId: activeThread._id,
          receiverId: activeThread.memberData._id,
          messageType: type,
          ...(type === 'IMAGE' ? { messageImage: file } : { messageFile: file }),
        },
      },
    }).catch(() => {});
  };

  const handleDelete = async (messageId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete message?',
      text: 'This message will be removed.',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      await deleteMsg({ variables: { messageId } }).catch(() => {});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!isLoggedIn) return null;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Messages</h1>

        <div className={styles.layout}>
          {/* ── Thread list ── */}
          <div className={styles.threadPanel}>
            <div className={styles.threadSearch}>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.threadList}>
              {threadsLoading && (
                <div className={styles.loading}>Loading...</div>
              )}

              {!threadsLoading && filteredThreads.length === 0 && (
                <div className={styles.emptyThreads}>
                  <ChatCircleText size={40} weight="light" />
                  <p>No conversations yet</p>
                </div>
              )}

              {filteredThreads.map((thread) => (
                <div
                  key={thread._id}
                  className={`${styles.threadItem} ${activeThread?._id === thread._id ? styles.threadItemActive : ''}`}
                  onClick={() => setActiveThread(thread)}
                >
                  <div className={styles.threadAvatar}>
                    {thread.memberData.memberImage ? (
                      <Image
                        src={`${BACKEND_URL}/uploads/${thread.memberData.memberImage}`}
                        alt={thread.memberData.memberNick}
                        fill
                        sizes="48px"
                        className={styles.threadAvatarImg}
                      />
                    ) : (
                      <div className={styles.threadAvatarIcon}>
                        <UserCircle size={28} />
                      </div>
                    )}
                  </div>

                  <div className={styles.threadInfo}>
                    <div className={styles.threadName}>
                      {thread.memberData.memberFullName || thread.memberData.memberNick}
                    </div>
                    <div className={styles.threadPreview}>
                      {thread.lastMessage?.messageText ?? '📎 Attachment'}
                    </div>
                  </div>

                  <div className={styles.threadMeta}>
                    {thread.lastMessage && (
                      <span className={styles.threadTime}>
                        {formatDate(thread.lastMessage.createdAt)}
                      </span>
                    )}
                    {thread.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>{thread.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Chat panel ── */}
          <div className={styles.chatPanel}>
            {!activeThread ? (
              <div className={styles.noThread}>
                <ChatCircleText size={48} weight="light" />
                <p>Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderAvatar}>
                    {activeThread.memberData.memberImage ? (
                      <Image
                        src={`${BACKEND_URL}/uploads/${activeThread.memberData.memberImage}`}
                        alt={activeThread.memberData.memberNick}
                        fill
                        sizes="44px"
                        className={styles.threadAvatarImg}
                      />
                    ) : (
                      <div className={styles.threadAvatarIcon}>
                        <UserCircle size={24} />
                      </div>
                    )}
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <div className={styles.chatHeaderName}>
                      {activeThread.memberData.memberFullName || activeThread.memberData.memberNick}
                    </div>
                    <div className={styles.chatHeaderStatus}>
                      <span className={styles.onlineDot} />
                      Online
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className={styles.messageList}>
                  {messagesLoading && <div className={styles.loading}>Loading messages...</div>}

                  {messages.map((msg) => {
                    const isMine = msg.senderId !== activeThread.memberData._id;

                    if (msg.messageType === 'SYSTEM') {
                      return (
                        <div key={msg._id} className={styles.bubbleSystem}>
                          {msg.messageText}
                        </div>
                      );
                    }

                    return (
                      <div key={msg._id} className={`${styles.messageRow} ${isMine ? styles.mine : ''}`}>
                        {!isMine && (
                          <div className={styles.msgAvatar}>
                            {activeThread.memberData.memberImage ? (
                              <Image
                                src={`${BACKEND_URL}/uploads/${activeThread.memberData.memberImage}`}
                                alt={activeThread.memberData.memberNick}
                                fill
                                sizes="32px"
                                className={styles.msgAvatarImg}
                              />
                            ) : (
                              <div className={styles.threadAvatarIcon} style={{ fontSize: '1rem' }}>
                                <UserCircle size={20} />
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`${styles.bubble} ${isMine ? styles.mine : styles.other}`}>
                          {msg.messageType === 'IMAGE' && msg.messageImage && (
                            <img
                              src={`${BACKEND_URL}/uploads/${msg.messageImage}`}
                              alt="image"
                              className={styles.bubbleImage}
                            />
                          )}
                          {msg.messageType === 'FILE' && msg.messageFile && (
                            <a
                              href={`${BACKEND_URL}/uploads/${msg.messageFile}`}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.bubbleFile}
                            >
                              <FileIcon size={18} />
                              Download file
                            </a>
                          )}
                          {msg.messageText && <p>{msg.messageText}</p>}
                          <div className={styles.bubbleTime}>
                            {formatTime(msg.createdAt)}
                            {isMine && (
                              <button
                                type="button"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, opacity: 0.6 }}
                                onClick={() => handleDelete(msg._id)}
                              >
                                <Trash size={12} weight="bold" color="currentColor" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>

                {/* Input */}
                <div className={styles.inputRow}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'IMAGE');
                      e.target.value = '';
                    }}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'FILE');
                      e.target.value = '';
                    }}
                  />

                  <button type="button" className={styles.imageBtn} onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon size={18} weight="regular" />
                  </button>
                  <button type="button" className={styles.attachBtn} onClick={() => fileInputRef.current?.click()}>
                    <Paperclip size={18} weight="regular" />
                  </button>

                  <input
                    className={styles.msgInput}
                    placeholder="Type a message..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <button
                    type="button"
                    className={styles.sendBtn}
                    disabled={!draft.trim()}
                    onClick={handleSend}
                  >
                    <PaperPlaneTilt size={20} weight="fill" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
