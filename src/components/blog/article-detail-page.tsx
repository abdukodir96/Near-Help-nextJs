'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChatCenteredText, Eye, Heart, NotePencil, PaperPlaneTilt, Sparkle } from 'phosphor-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useQuery, useMutation } from '@apollo/client/react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import {
  GET_ARTICLE,
  LIKE_ARTICLE,
  GET_COMMENTS,
  CREATE_COMMENT,
  CREATE_REPLY,
  LIKE_COMMENT,
} from '@/lib/graphql/queries';
import { communityCategories } from './blog-data';
import styles from './blog-detail-page.module.scss';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3007';

const getImageUrl = (img?: string) => {
  if (!img) return '/theme/images/blog/img-1.jpg';
  if (img.startsWith('http')) return img;
  return `${BACKEND_URL}${img}`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// ── Types ─────────────────────────────────────────────────────────────────────

type ArticleData = {
  _id: string;
  articleCategory: string;
  articleTitle: string;
  articleContent: string;
  articleImage?: string;
  articleViews: number;
  articleLikes: number;
  articleComments: number;
  meLiked?: boolean;
  createdAt: string;
  memberData?: { _id: string; memberNick: string; memberFullName?: string; memberImage?: string };
};

type BackendComment = {
  _id: string;
  commentContent: string;
  commentLikes?: number;
  meLiked?: boolean;
  createdAt: string;
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

const getAuthorName = (m?: BackendComment['memberData']) =>
  m?.memberFullName ?? m?.memberNick ?? 'Anonymous';

const getAuthorAvatar = (m?: BackendComment['memberData']) => {
  if (!m?.memberImage) return '/theme/images/team/2.jpg';
  if (m.memberImage.startsWith('http')) return m.memberImage;
  return `${BACKEND_URL}${m.memberImage}`;
};

const toRuntime = (c: BackendComment): RuntimeComment => ({
  id: c._id,
  author: getAuthorName(c.memberData),
  avatar: getAuthorAvatar(c.memberData),
  date: formatDate(c.createdAt),
  message: c.commentContent,
  likes: c.commentLikes ?? 0,
  meLiked: Boolean(c.meLiked),
  replies: [],
});

// ── Component ─────────────────────────────────────────────────────────────────

type ArticleDetailPageProps = { articleId: string };

export function ArticleDetailPage({ articleId }: ArticleDetailPageProps) {
  const router = useRouter();
  const commentsSectionRef = useRef<HTMLElement | null>(null);
  const commentsInitedRef = useRef(false);

  // Article like state
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number | null>(null);

  // Comment state
  const [comments, setComments] = useState<RuntimeComment[]>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // ── Queries ────────────────────────────────────────────────────────────────

  // GET_ARTICLE with auth → backend auto-increments view for logged-in users
  const { data, loading, error } = useQuery<{ getArticle: ArticleData }>(GET_ARTICLE, {
    variables: { input: { articleId } },
    fetchPolicy: 'network-only',
  });

  const { data: commentsData } = useQuery<{
    getComments: { list: BackendComment[]; metaCounter: { total: number }[] };
  }>(GET_COMMENTS, {
    variables: {
      input: { page: 1, limit: 20, search: { commentRefId: articleId } },
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (commentsData?.getComments?.list && !commentsInitedRef.current) {
      commentsInitedRef.current = true;
      setComments(commentsData.getComments.list.map(toRuntime));
    }
  }, [commentsData]);

  // ── Mutations ──────────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [likeArticle]  = useMutation<any>(LIKE_ARTICLE);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [createReply]   = useMutation(CREATE_REPLY);
  const [likeComment]   = useMutation(LIKE_COMMENT);

  // ── Derived ────────────────────────────────────────────────────────────────

  const article             = data?.getArticle;
  const currentLikedFromData = article?.meLiked ?? false;
  const currentLiked         = liked ?? currentLikedFromData;
  const currentLikeCount     = likeCount ?? article?.articleLikes ?? 0;
  const totalCommentCount    = comments.reduce((t, c) => t + 1 + c.replies.length, 0);
  const authorName           = article?.memberData?.memberFullName ?? article?.memberData?.memberNick ?? 'Anonymous';
  const authorImage          = article?.memberData?.memberImage
    ? getImageUrl(article.memberData.memberImage)
    : '/theme/images/team/2.jpg';

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showAuthAlert = async (action: string) => {
    await Swal.fire({
      icon: 'warning',
      title: 'Login required',
      text: `Please log in to ${action}.`,
      confirmButtonColor: '#0052da',
      confirmButtonText: 'OK',
    });
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCommentsClick = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLike = async () => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like this article'); return; }
    const prev = liked ?? currentLikedFromData;
    setLiked(!prev);
    setLikeCount((c) => (c ?? article?.articleLikes ?? 0) + (!prev ? 1 : -1));
    try {
      const { data: res } = await likeArticle({ variables: { input: { targetArticleId: articleId } } });
      if (res?.likeTargetArticle) {
        const isFav = res.likeTargetArticle.myFavorite as boolean;
        setLiked(isFav);
        setLikeCount(isFav ? (article?.articleLikes ?? 0) + 1 : article?.articleLikes ?? 0);
      }
    } catch {
      setLiked(prev);
      setLikeCount(article?.articleLikes ?? 0);
    }
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('write a comment'); return; }
    const text = commentDraft.trim();
    if (!text) {
      await Swal.fire({ icon: 'info', title: 'Comment is empty', text: 'Please write something before submitting.', confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
      return;
    }
    try {
      await createComment({ variables: { input: { commentGroup: 'ARTICLE', commentContent: text, commentRefId: articleId } } });
      setComments((prev) => [{
        id: `local-${Date.now()}`,
        author: 'You',
        avatar: '/theme/images/team/2.jpg',
        date: 'Just now',
        message: text,
        likes: 0,
        meLiked: false,
        replies: [],
      }, ...prev]);
      setCommentDraft('');
    } catch {
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not post your comment. Please try again.', confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
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

  const handleReplyToggle = async (targetId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('reply to a comment'); return; }
    setActiveReplyId((cur) => (cur === targetId ? null : targetId));
  };

  const handleReplySubmit = async (
    event: FormEvent<HTMLFormElement>,
    commentId: string,
    targetId: string,
    targetAuthor: string,
  ) => {
    event.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('reply to a comment'); return; }
    const text = (replyDrafts[targetId] ?? '').trim();
    if (!text) return;
    try {
      await createReply({ variables: { input: { parentCommentId: commentId, commentContent: text } } });
      setComments((prev) =>
        prev.map((c) => c.id !== commentId ? c : {
          ...c,
          replies: [...c.replies, {
            id: `reply-${Date.now()}`,
            author: 'You',
            avatar: '/theme/images/team/2.jpg',
            date: 'Just now',
            message: text,
            likes: 0,
            meLiked: false,
            replyTo: targetId !== commentId ? targetAuthor : undefined,
          }],
        }),
      );
      setReplyDrafts((prev) => ({ ...prev, [targetId]: '' }));
      setActiveReplyId(null);
    } catch {
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not post your reply. Please try again.', confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
    }
  };

  // ── Skeleton / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <aside className={styles.sidebar}><div className={styles.communityCard} style={{ height: 360 }} /></aside>
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#6b7280' }}>Loading article...</div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <aside className={styles.sidebar}><SidebarCard /></aside>
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>Article not found.</p>
            <button
              type="button"
              onClick={() => router.push('/blog')}
              style={{ marginTop: 16, padding: '10px 24px', background: '#0052da', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}
            >
              Back to Blog
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <SidebarCard />
        </aside>

        <section className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <p className={styles.eyebrow}>Blog Article</p>
              <h1>Share your ideas with the community</h1>
            </div>
            <button
              type="button"
              className={styles.writeButton}
              onClick={() => router.push('/blog/write')}
            >
              <NotePencil size={18} weight="bold" />
              Write
            </button>
          </div>

          <article className={styles.articleCard}>
            <header className={styles.articleHeader}>
              <div className={styles.titleBlock}>
                <h2>{article.articleTitle}</h2>
                <div className={styles.authorRow}>
                  <div className={styles.authorLink}>
                    <div className={styles.avatarWrap}>
                      <Image src={authorImage} alt={authorName} fill sizes="48px" className={styles.avatar} unoptimized />
                    </div>
                    <strong>{authorName}</strong>
                  </div>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>

              <div className={styles.articleStats}>
                <button
                  type="button"
                  className={`${styles.statButton} ${currentLiked ? styles.statButtonActive : ''}`}
                  aria-label="Like this article"
                  aria-pressed={currentLiked}
                  onClick={handleLike}
                >
                  <Heart size={26} weight={currentLiked ? 'fill' : 'regular'} />
                  {currentLikeCount}
                </button>

                <span>
                  <Eye size={28} weight="fill" />
                  {article.articleViews}
                </span>

                <button
                  type="button"
                  className={styles.statButton}
                  aria-label="Scroll to comments"
                  onClick={handleCommentsClick}
                >
                  <ChatCenteredText size={28} weight="fill" />
                  {totalCommentCount}
                </button>
              </div>
            </header>

            <div className={styles.articleBody}>
              <p className={styles.kicker}>{article.articleCategory}</p>

              <div className={styles.heroImageWrap}>
                <Image
                  src={getImageUrl(article.articleImage)}
                  alt={article.articleTitle}
                  fill
                  sizes="(max-width: 1180px) 100vw, 960px"
                  className={styles.heroImage}
                  priority
                  unoptimized
                />
              </div>

              <div className={styles.copyBlock}>
                {(article.articleContent ?? '').split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </article>

          {/* ── Comments ── */}
          <section className={styles.commentsSection} ref={commentsSectionRef}>
            <div className={styles.commentsHeader}>
              <div>
                <p className={styles.commentsEyebrow}>Community comments</p>
                <h2>Join the discussion</h2>
              </div>
              <span>{totalCommentCount} comment{totalCommentCount !== 1 ? 's' : ''}</span>
            </div>

            <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
              <label htmlFor="article-comment">Comment</label>
              <textarea
                id="article-comment"
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Share your thoughts about this article..."
              />
              <button type="submit">
                Submit Comment
                <PaperPlaneTilt size={22} weight="bold" />
              </button>
            </form>

            <div className={styles.commentList}>
              {comments.map((comment) => (
                <article className={styles.commentItem} key={comment.id}>
                  <div className={styles.commentAvatarWrap}>
                    <Image src={comment.avatar} alt={comment.author} fill sizes="58px" className={styles.commentAvatar} />
                  </div>
                  <div className={styles.commentContent}>
                    <button
                      type="button"
                      className={`${styles.commentHeartButton} ${comment.meLiked ? styles.commentActionActive : ''}`}
                      aria-label={`Like comment by ${comment.author}`}
                      aria-pressed={comment.meLiked}
                      onClick={() => handleCommentLike(comment.id)}
                    >
                      <Heart size={22} weight={comment.meLiked ? 'fill' : 'regular'} />
                    </button>
                    <div className={styles.commentMeta}>
                      <strong>{comment.author}</strong>
                    </div>
                    <p>{comment.message}</p>
                    <div className={styles.commentActions}>
                      <span>{comment.date}</span>
                      <span>{comment.likes} likes</span>
                      <button type="button" className={styles.commentActionButton} onClick={() => handleReplyToggle(comment.id)}>
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
                              <Image src={reply.avatar} alt={reply.author} fill sizes="42px" className={styles.commentAvatar} />
                            </div>
                            <div className={styles.replyContent}>
                              <button
                                type="button"
                                className={`${styles.replyHeartButton} ${reply.meLiked ? styles.commentActionActive : ''}`}
                                aria-label={`Like reply by ${reply.author}`}
                                aria-pressed={reply.meLiked}
                                onClick={() => handleReplyLike(comment.id, reply.id)}
                              >
                                <Heart size={20} weight={reply.meLiked ? 'fill' : 'regular'} />
                              </button>
                              <div className={styles.commentMeta}>
                                <strong>{reply.author}</strong>
                              </div>
                              <p>
                                {reply.replyTo && <span className={styles.replyMention}>@{reply.replyTo} </span>}
                                {reply.message}
                              </p>
                              <div className={styles.commentActions}>
                                <span>{reply.date}</span>
                                <span>{reply.likes} likes</span>
                                <button type="button" className={styles.commentActionButton} onClick={() => handleReplyToggle(reply.id)}>
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
        </section>
      </div>
    </main>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function SidebarCard() {
  return (
    <div className={styles.communityCard}>
      <div className={styles.brandRow}>
        <div className={styles.brandBadge}>
          <Sparkle size={34} weight="duotone" />
          <span>NearHelp</span>
        </div>
        <div className={styles.brandCopy}>
          <strong>NearHelp</strong>
          <span>Blog</span>
        </div>
      </div>
      <div className={styles.categoryList}>
        {communityCategories.map((cat) => (
          <Link
            key={cat.key}
            href="/blog"
            prefetch={false}
            className={styles.categoryButton}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
