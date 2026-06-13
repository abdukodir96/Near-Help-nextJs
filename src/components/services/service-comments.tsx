'use client';

import Image from 'next/image';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Heart, PaperPlaneTilt } from 'phosphor-react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_COMMENTS, GET_COMMENT_THREAD, CREATE_COMMENT, CREATE_REPLY, LIKE_COMMENT, GET_ME } from '@/lib/graphql/queries';
import styles from './service-comments.module.scss';

const BACKEND_URL = 'http://localhost:3007';

const avatarPool = [
  '/theme/images/team/1.jpg',
  '/theme/images/team/2.jpg',
  '/theme/images/team/3.jpg',
  '/theme/images/team/4.jpg',
];

type BackendComment = {
  _id: string;
  commentContent: string;
  commentLikes?: number;
  meLiked?: boolean;
  createdAt: string;
  depth?: number;
  repliesCount?: number;
  memberData?: { _id: string; memberNick: string; memberFullName?: string; memberImage?: string };
};

type RuntimeReply = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  replyTo?: string;
};

type RuntimeComment = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  replies: RuntimeReply[];
};

const getAuthor = (m?: BackendComment['memberData']) =>
  m?.memberFullName ?? m?.memberNick ?? 'Anonymous';

const getAvatar = (m?: BackendComment['memberData'], fallback = avatarPool[0]) => {
  if (!m?.memberImage) return fallback;
  if (m.memberImage.startsWith('http')) return m.memberImage;
  return `${BACKEND_URL}${m.memberImage}`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const toRuntimeReply = (c: BackendComment, idx: number, replyTo?: string): RuntimeReply => ({
  id: c._id,
  author: getAuthor(c.memberData),
  avatar: getAvatar(c.memberData, avatarPool[idx % avatarPool.length]),
  date: formatDate(c.createdAt),
  message: c.commentContent,
  likes: c.commentLikes ?? 0,
  meLiked: Boolean(c.meLiked),
  replyTo,
});

const toRuntime = (c: BackendComment, idx: number): RuntimeComment => ({
  id: c._id,
  author: getAuthor(c.memberData),
  avatar: getAvatar(c.memberData, avatarPool[idx % avatarPool.length]),
  date: formatDate(c.createdAt),
  message: c.commentContent,
  likes: c.commentLikes ?? 0,
  meLiked: Boolean(c.meLiked),
  replies: [],
});

export function ServiceComments({ serviceSlug }: { serviceSlug: string }) {
  const [comments, setComments]       = useState<RuntimeComment[]>([]);
  const [draft, setDraft]             = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const initedRef = useRef(false);

  // ── Fetch comments ──────────────────────────────────────────────────────────
  const { data: commentsData } = useQuery<{
    getComments: { list: BackendComment[] };
  }>(GET_COMMENTS, {
    variables: {
      input: { page: 1, limit: 50, search: { commentRefId: serviceSlug } },
    },
    fetchPolicy: 'cache-and-network',
  });

  // ── Current user (for "You" avatar) ─────────────────────────────────────────
  const { data: meData } = useQuery<{
    getMember: { memberFullName?: string; memberNick: string; memberImage?: string };
  }>(GET_ME, { skip: !Cookies.get(ACCESS_TOKEN_KEY), fetchPolicy: 'cache-and-network' });

  const myAvatar = getAvatar(meData?.getMember as BackendComment['memberData'], avatarPool[0]);
  const myName   = meData?.getMember?.memberFullName ?? meData?.getMember?.memberNick ?? 'You';

  const client = useApolloClient();

  useEffect(() => {
    const list = commentsData?.getComments?.list;
    if (!list || initedRef.current) return;
    initedRef.current = true;

    const base = list.map((c, i) => toRuntime(c, i));
    setComments(base);

    // Fetch replies for comments that have any
    list.forEach((c, idx) => {
      if (!c.repliesCount) return;
      client
        .query<{ getCommentThread: { list: BackendComment[] } }>({
          query: GET_COMMENT_THREAD,
          variables: { input: { rootCommentId: c._id, page: 1, limit: 100 } },
          fetchPolicy: 'network-only',
        })
        .then(({ data }) => {
          const thread = data?.getCommentThread?.list ?? [];
          const replies = thread
            .filter((r) => (r.depth ?? 0) > 0)
            .map((r, i) => toRuntimeReply(r, i));
          if (!replies.length) return;
          setComments((prev) =>
            prev.map((rc, i) => i !== idx ? rc : { ...rc, replies }),
          );
        })
        .catch(() => {});
    });
  }, [commentsData, client]);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const [createComment] = useMutation(CREATE_COMMENT);
  const [createReply]   = useMutation(CREATE_REPLY);
  const [likeComment]   = useMutation(LIKE_COMMENT);

  // ── Auth helper ─────────────────────────────────────────────────────────────
  const showAuthAlert = async (action: string) => {
    await Swal.fire({
      icon: 'warning',
      title: 'Login required',
      text: `Please log in to ${action}.`,
      confirmButtonColor: '#0052da',
      confirmButtonText: 'OK',
    });
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('write a comment'); return; }

    const text = draft.trim();
    if (!text) {
      await Swal.fire({ icon: 'info', title: 'Comment is empty', text: 'Please write something before submitting.', confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
      return;
    }

    try {
      const result = await createComment({
        variables: { input: { commentGroup: 'SERVICE', commentContent: text, commentRefId: serviceSlug } },
      });
      const realId = (result.data as { createComment?: { _id?: string } })?.createComment?._id ?? `local-${Date.now()}`;
      setComments((prev) => [{
        id: realId,
        author: myName,
        avatar: myAvatar,
        date: 'Just now',
        message: text,
        likes: 0,
        meLiked: false,
        replies: [],
      }, ...prev]);
      setDraft('');
    } catch {
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not post comment. Please try again.', confirmButtonColor: '#0052da' });
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like a comment'); return; }
    setComments((prev) =>
      prev.map((c) => c.id !== commentId ? c : { ...c, likes: c.likes + (c.meLiked ? -1 : 1), meLiked: !c.meLiked }),
    );
    try { await likeComment({ variables: { input: { likeRefId: commentId } } }); } catch {}
  };

  const handleReplyLike = async (commentId: string, replyId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like a reply'); return; }
    setComments((prev) =>
      prev.map((c) => c.id !== commentId ? c : {
        ...c,
        replies: c.replies.map((r) => r.id !== replyId ? r : { ...r, likes: r.likes + (r.meLiked ? -1 : 1), meLiked: !r.meLiked }),
      }),
    );
    try { await likeComment({ variables: { input: { likeRefId: replyId } } }); } catch {}
  };

  const handleReplySubmit = async (
    e: FormEvent<HTMLFormElement>,
    commentId: string,
    replyToId: string,
    replyToAuthor: string,
  ) => {
    e.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('reply'); return; }
    const text = (replyDrafts[replyToId] ?? '').trim();
    if (!text) return;
    try {
      await createReply({ variables: { input: { parentCommentId: commentId, commentContent: text } } });
      setComments((prev) =>
        prev.map((c) => c.id !== commentId ? c : {
          ...c,
          replies: [...c.replies, {
            id: `reply-${Date.now()}`,
            author: myName,
            avatar: myAvatar,
            date: 'Just now',
            message: text,
            likes: 0,
            meLiked: false,
            replyTo: replyToAuthor,
          }],
        }),
      );
      setReplyDrafts((prev) => ({ ...prev, [replyToId]: '' }));
      setActiveReplyId(null);
    } catch {
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not post reply.', confirmButtonColor: '#0052da' });
    }
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
              <Image src={comment.avatar} alt={comment.author} fill sizes="56px" className={styles.avatar} unoptimized />
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
                <button
                  type="button"
                  className={styles.replyBtn}
                  onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                >
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
                        <Image src={reply.avatar} alt={reply.author} fill sizes="40px" className={styles.avatar} unoptimized />
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
                          <button
                            type="button"
                            className={styles.replyBtn}
                            onClick={() => setActiveReplyId(activeReplyId === reply.id ? null : reply.id)}
                          >
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
