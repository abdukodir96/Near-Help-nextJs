'use client';

import Image from 'next/image';
import { type FormEvent, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Heart, PaperPlaneTilt } from 'phosphor-react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import type { ServiceComment } from './services-data';
import styles from './service-comments.module.scss';

type RuntimeComment = ServiceComment & {
  likes: number;
  meLiked: boolean;
  avatar: string;
  replies: RuntimeReply[];
};

type RuntimeReply = {
  id: string;
  author: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  avatar: string;
  replyTo?: string;
};

const avatarPool = [
  '/theme/images/team/1.jpg',
  '/theme/images/team/2.jpg',
  '/theme/images/team/3.jpg',
  '/theme/images/team/4.jpg',
];

function pickAvatar(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return avatarPool[Math.abs(hash) % avatarPool.length];
}

function toRuntime(comments: ServiceComment[]): RuntimeComment[] {
  return comments.map((c, i) => ({
    ...c,
    likes: 4 + i * 7,
    meLiked: false,
    avatar: pickAvatar(c.author),
    replies: [],
  }));
}

export function ServiceComments({ serviceSlug, initialComments }: { serviceSlug: string; initialComments: ServiceComment[] }) {
  const [comments, setComments] = useState<RuntimeComment[]>(() => toRuntime(initialComments));
  const [draft, setDraft] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const showAuthAlert = async (action: string) => {
    await Swal.fire({
      icon: 'warning',
      title: 'Login required',
      text: `Please log in to ${action}.`,
      confirmButtonColor: '#0052da',
      confirmButtonText: 'OK',
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('write a comment'); return; }

    const text = draft.trim();
    if (!text) {
      await Swal.fire({ icon: 'info', title: 'Comment is empty', text: 'Please write something before submitting.', confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
      return;
    }

    setComments((prev) => [{
      id: `${serviceSlug}-local-${Date.now()}`,
      author: 'You',
      date: 'Just now',
      message: text,
      likes: 0,
      meLiked: false,
      avatar: '/theme/images/team/4.jpg',
      replies: [],
    }, ...prev]);
    setDraft('');
  };

  const handleCommentLike = async (commentId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like a comment'); return; }
    setComments((prev) => prev.map((c) => c.id !== commentId ? c : { ...c, likes: c.likes + (c.meLiked ? -1 : 1), meLiked: !c.meLiked }));
  };

  const handleReplyLike = async (commentId: string, replyId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like a reply'); return; }
    setComments((prev) => prev.map((c) => c.id !== commentId ? c : {
      ...c,
      replies: c.replies.map((r) => r.id !== replyId ? r : { ...r, likes: r.likes + (r.meLiked ? -1 : 1), meLiked: !r.meLiked }),
    }));
  };

  const handleReplySubmit = async (e: FormEvent<HTMLFormElement>, commentId: string, replyToId: string, replyToAuthor: string) => {
    e.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('reply'); return; }

    const text = (replyDrafts[replyToId] ?? '').trim();
    if (!text) return;

    const newReply: RuntimeReply = {
      id: `reply-${Date.now()}`,
      author: 'You',
      date: 'Just now',
      message: text,
      likes: 0,
      meLiked: false,
      avatar: '/theme/images/team/4.jpg',
      replyTo: replyToAuthor,
    };

    setComments((prev) => prev.map((c) => c.id !== commentId ? c : { ...c, replies: [...c.replies, newReply] }));
    setReplyDrafts((prev) => ({ ...prev, [replyToId]: '' }));
    setActiveReplyId(null);
  };

  const totalCount = comments.reduce((t, c) => t + 1 + c.replies.length, 0);

  return (
    <section id="comments" className={styles.section}>
      <h2 className={styles.heading}>{totalCount} comment{totalCount !== 1 ? 's' : ''}</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="service-comment">Comment</label>
        <textarea
          id="service-comment"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share your experience or question about this service..."
        />
        <button type="submit">
          Submit Comment
          <PaperPlaneTilt size={20} weight="bold" />
        </button>
      </form>

      <div className={styles.list}>
        {comments.map((comment) => (
          <article className={styles.commentItem} key={comment.id}>
            <div className={styles.avatarWrap}>
              <Image src={comment.avatar} alt={comment.author} fill sizes="56px" className={styles.avatar} />
            </div>
            <div className={styles.content}>
              <button
                type="button"
                className={`${styles.heartBtn} ${comment.meLiked ? styles.heartActive : ''}`}
                aria-label={`Like comment by ${comment.author}`}
                onClick={() => handleCommentLike(comment.id)}
              >
                <Heart size={20} weight={comment.meLiked ? 'fill' : 'regular'} />
              </button>
              <div className={styles.meta}><strong>{comment.author}</strong></div>
              <p>{comment.message}</p>
              <div className={styles.actions}>
                <span>{comment.date}</span>
                <span>{comment.likes} likes</span>
                <button type="button" className={styles.replyBtn} onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}>
                  Reply
                </button>
              </div>

              {activeReplyId === comment.id && (
                <form className={styles.replyForm} onSubmit={(e) => handleReplySubmit(e, comment.id, comment.id, comment.author)}>
                  <textarea
                    value={replyDrafts[comment.id] ?? ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                    placeholder={`Reply to ${comment.author}...`}
                  />
                  <div className={styles.replyFormActions}>
                    <button type="button" onClick={() => setActiveReplyId(null)}>Cancel</button>
                    <button type="submit">Submit Reply</button>
                  </div>
                </form>
              )}

              {comment.replies.length > 0 && (
                <div className={styles.replyList}>
                  {comment.replies.map((reply) => (
                    <article className={styles.replyItem} key={reply.id}>
                      <div className={styles.replyAvatarWrap}>
                        <Image src={reply.avatar} alt={reply.author} fill sizes="40px" className={styles.avatar} />
                      </div>
                      <div className={styles.content}>
                        <button
                          type="button"
                          className={`${styles.heartBtn} ${reply.meLiked ? styles.heartActive : ''}`}
                          aria-label={`Like reply by ${reply.author}`}
                          onClick={() => handleReplyLike(comment.id, reply.id)}
                        >
                          <Heart size={18} weight={reply.meLiked ? 'fill' : 'regular'} />
                        </button>
                        <div className={styles.meta}><strong>{reply.author}</strong></div>
                        <p>
                          {reply.replyTo && <span className={styles.mention}>@{reply.replyTo} </span>}
                          {reply.message}
                        </p>
                        <div className={styles.actions}>
                          <span>{reply.date}</span>
                          <span>{reply.likes} likes</span>
                          <button type="button" className={styles.replyBtn} onClick={() => setActiveReplyId(activeReplyId === reply.id ? null : reply.id)}>
                            Reply
                          </button>
                        </div>

                        {activeReplyId === reply.id && (
                          <form className={styles.replyForm} onSubmit={(e) => handleReplySubmit(e, comment.id, reply.id, reply.author)}>
                            <textarea
                              value={replyDrafts[reply.id] ?? ''}
                              onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [reply.id]: e.target.value }))}
                              placeholder={`Reply to ${reply.author}...`}
                            />
                            <div className={styles.replyFormActions}>
                              <button type="button" onClick={() => setActiveReplyId(null)}>Cancel</button>
                              <button type="submit">Submit Reply</button>
                            </div>
                          </form>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
