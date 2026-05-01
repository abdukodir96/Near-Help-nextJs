'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { ChatCenteredText, Eye, Heart, NotePencil, PaperPlaneTilt, Sparkle } from 'phosphor-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { communityCategories, type CommunityPost } from './blog-data';
import styles from './blog-detail-page.module.scss';

const authorAvatars: Record<string, string> = {
  Martin: '/theme/images/team/4.jpg',
  Neo: '/theme/images/team/1.jpg',
  PNU: '/theme/images/team/3.jpg',
  Soomin: '/theme/images/team/2.jpg',
  'Ara Kim': '/theme/images/team/1.jpg',
  'Yuna Park': '/theme/images/team/3.jpg',
  'NearHelp Team': '/theme/images/team/2.jpg',
  Joon: '/theme/images/team/1.jpg',
  Mina: '/theme/images/team/3.jpg',
};

const authorAgentSlugs: Record<string, string> = {
  Martin: 'shelia-lawrence',
  Neo: 'mattie-washington',
  PNU: 'elijah-foster',
  Soomin: 'winifred-harmon',
  'Ara Kim': 'grace-kim',
  'Yuna Park': 'shelia-lawrence',
  'NearHelp Team': 'henry-barton',
  Joon: 'owen-park',
  Mina: 'grace-kim',
};

const formatArticleDate = (post: CommunityPost) => {
  const monthIndex = new Date(`${post.month} 1, 2026`).getMonth() + 1;
  return `${String(monthIndex).padStart(2, '0')}.${String(post.day).padStart(2, '0')}.26 14:38`;
};

const articleParagraphs = (post: CommunityPost) => [
  post.excerpt,
  'This board article is shared by the NearHelp community so homeowners can compare service experiences before making a booking decision. The goal is to keep repair stories practical, transparent, and useful for the next customer.',
  'When the backend article module is connected, this page will load the full article body, nested comments, likes, and view tracking from the API. For now, the page uses local showcase content that follows the final layout.',
];

type CommunityReply = {
  id: string;
  author: string;
  date: string;
  message: string;
  avatar: string;
  likes: number;
  meLiked: boolean;
  replyTo?: string;
};

type CommunityComment = {
  id: string;
  author: string;
  date: string;
  message: string;
  avatar: string;
  likes: number;
  meLiked: boolean;
  replies: CommunityReply[];
};

type CommunityCommentTemplate = Omit<CommunityComment, 'id' | 'meLiked' | 'replies'> & {
  replies: Array<Omit<CommunityReply, 'id' | 'meLiked'>>;
};

const communityCommentTemplates: CommunityCommentTemplate[] = [
  {
    author: 'Yujin Park',
    date: '2 days ago',
    message: 'This helped me understand which service option fits a same-day repair. Clear examples make the booking flow easier.',
    avatar: '/theme/images/team/1.jpg',
    likes: 96,
    replies: [
      {
        author: 'NearHelp Team',
        date: '1 day ago',
        message: 'Thanks for sharing this. We are preparing clearer booking guidance for each service option.',
        avatar: '/theme/images/team/2.jpg',
        likes: 14,
      },
    ],
  },
  {
    author: 'Noah Kim',
    date: '6 days ago',
    message: 'I like that homeowners can compare real repair experiences before choosing an agent.',
    avatar: '/theme/images/team/3.jpg',
    likes: 78,
    replies: [],
  },
  {
    author: 'Eunji Han',
    date: '9 days ago',
    message: 'The article feels practical. It would be useful to add estimated response times for each service option later.',
    avatar: '/theme/images/team/4.jpg',
    likes: 60,
    replies: [
      {
        author: 'Martin',
        date: '8 days ago',
        message: 'Response time examples would definitely help people choose between standard and emergency bookings.',
        avatar: '/theme/images/team/4.jpg',
        likes: 9,
      },
    ],
  },
];

const createInitialComments = (post: CommunityPost): CommunityComment[] =>
  communityCommentTemplates.map((comment, index) => ({
    ...comment,
    id: `${post.id}-comment-${index + 1}`,
    meLiked: false,
    replies: comment.replies.map((reply, replyIndex) => ({
      ...reply,
      id: `${post.id}-comment-${index + 1}-reply-${replyIndex + 1}`,
      meLiked: false,
    })),
  }));

export function CommunityDetailPageContent({ post }: { post: CommunityPost }) {
  const activeCategory = communityCategories.find((category) => category.key === post.category) ?? communityCategories[0];
  const authorAvatar = authorAvatars[post.author] ?? '/theme/images/blog-details/author.jpg';
  const authorAgentSlug = authorAgentSlugs[post.author] ?? 'mattie-washington';
  const [likeCount, setLikeCount] = useState(post.likes);
  const [viewCount, setViewCount] = useState(post.views);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>(() => createInitialComments(post));
  const [commentDraft, setCommentDraft] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const commentsSectionRef = useRef<HTMLElement | null>(null);

  const totalCommentCount = comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);

  useEffect(() => {
    if (Cookies.get(ACCESS_TOKEN_KEY)) {
      setViewCount(post.views + 1);
    } else {
      setViewCount(post.views);
    }

    setLikeCount(post.likes);
    setLiked(false);
    setComments(createInitialComments(post));
    setCommentDraft('');
    setActiveReplyId(null);
    setReplyDrafts({});
  }, [post]);

  const showAuthRequired = async (actionLabel: string) => {
    await Swal.fire({
      icon: 'warning',
      title: 'Login required',
      text: `Please log in to ${actionLabel}.`,
      confirmButtonColor: '#0052da',
      confirmButtonText: 'OK',
    });
  };

  const handleCommentsClick = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLikeClick = async () => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await showAuthRequired('like this community post');
      return;
    }

    setLiked((currentLiked) => {
      setLikeCount((currentCount) => currentCount + (currentLiked ? -1 : 1));
      return !currentLiked;
    });
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await showAuthRequired('write a comment');
      return;
    }

    const nextMessage = commentDraft.trim();

    if (!nextMessage) {
      await Swal.fire({
        icon: 'info',
        title: 'Comment is empty',
        text: 'Please write your comment before submitting.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    setComments((currentComments) => [
      {
        id: `${post.id}-local-${Date.now()}`,
        author: 'You',
        date: 'Just now',
        message: nextMessage,
        avatar: '/theme/images/blog-details/author.jpg',
        likes: 0,
        meLiked: false,
        replies: [],
      },
      ...currentComments,
    ]);
    setCommentDraft('');
  };

  const handleCommentLike = async (commentId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await showAuthRequired('like a comment');
      return;
    }

    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          likes: comment.likes + (comment.meLiked ? -1 : 1),
          meLiked: !comment.meLiked,
        };
      }),
    );
  };

  const handleReplyLike = async (commentId: string, replyId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await showAuthRequired('like a reply');
      return;
    }

    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id !== replyId) return reply;

            return {
              ...reply,
              likes: reply.likes + (reply.meLiked ? -1 : 1),
              meLiked: !reply.meLiked,
            };
          }),
        };
      }),
    );
  };

  const handleReplyToggle = async (targetId: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await showAuthRequired('reply to a comment');
      return;
    }

    setActiveReplyId((currentId) => (currentId === targetId ? null : targetId));
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>, commentId: string, targetId: string, targetAuthor: string) => {
    event.preventDefault();

    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await showAuthRequired('reply to a comment');
      return;
    }

    const nextMessage = (replyDrafts[targetId] ?? '').trim();

    if (!nextMessage) {
      await Swal.fire({
        icon: 'info',
        title: 'Reply is empty',
        text: 'Please write your reply before submitting.',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: `${commentId}-local-reply-${Date.now()}`,
              author: 'You',
              date: 'Just now',
              message: nextMessage,
              avatar: '/theme/images/blog-details/author.jpg',
              likes: 0,
              meLiked: false,
              replyTo: targetId === commentId ? undefined : targetAuthor,
            },
          ],
        };
      }),
    );
    setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [targetId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <div className={styles.communityCard}>
            <div className={styles.brandRow}>
              <div className={styles.brandBadge}>
                <Sparkle size={34} weight="duotone" />
                <span>NearHelp</span>
              </div>

              <div className={styles.brandCopy}>
                <strong>Community</strong>
                <span>Board Article</span>
              </div>
            </div>

            <div className={styles.categoryList}>
              {communityCategories.map((category) => {
                const active = category.key === post.category;

                return (
                  <Link
                    prefetch={false}
                    key={category.key}
                    href="/blog"
                    className={`${styles.categoryButton} ${active ? styles.categoryButtonActive : ''}`}
                  >
                    {category.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <p className={styles.eyebrow}>{activeCategory.heading}</p>
              <h1>{activeCategory.description}</h1>
            </div>

            <button type="button" className={styles.writeButton}>
              <NotePencil size={18} weight="bold" />
              Write
            </button>
          </div>

          <article className={styles.articleCard}>
            <header className={styles.articleHeader}>
              <div className={styles.titleBlock}>
                <h2>{post.title}</h2>
                <div className={styles.authorRow}>
                  <Link
                    prefetch={false}
                    href={'/agents/' + authorAgentSlug}
                    className={styles.authorLink}
                    aria-label={'View ' + post.author + ' agent profile'}
                  >
                    <div className={styles.avatarWrap}>
                      <Image src={authorAvatar} alt={post.author} fill sizes="48px" className={styles.avatar} />
                    </div>
                    <strong>{post.author}</strong>
                  </Link>
                  <span>{formatArticleDate(post)}</span>
                </div>
              </div>

              <div className={styles.articleStats}>
                <button
                  type="button"
                  className={`${styles.statButton} ${liked ? styles.statButtonActive : ''}`}
                  aria-label={`Like ${post.title}`}
                  aria-pressed={liked}
                  onClick={handleLikeClick}
                >
                  <Heart size={26} weight={liked ? 'fill' : 'regular'} />
                  {likeCount}
                </button>
                <span>
                  <Eye size={28} weight="fill" />
                  {viewCount}
                </span>
                <button
                  type="button"
                  className={styles.statButton}
                  aria-label="Scroll to community comments"
                  onClick={handleCommentsClick}
                >
                  <ChatCenteredText size={28} weight="fill" />
                  {totalCommentCount}
                </button>
              </div>
            </header>

            <div className={styles.articleBody}>
              <p className={styles.kicker}>{post.title === 'Coming soon' ? 'New Era' : activeCategory.label}</p>

              <div className={styles.heroImageWrap}>
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 1180px) 100vw, 960px" className={styles.heroImage} priority />
              </div>

              <div className={styles.copyBlock}>
                {articleParagraphs(post).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <section className={styles.commentsSection} ref={commentsSectionRef}>
            <div className={styles.commentsHeader}>
              <div>
                <p className={styles.commentsEyebrow}>Community comments</p>
                <h2>Join the discussion</h2>
              </div>
              <span>{totalCommentCount} comments</span>
            </div>

            <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
              <label htmlFor="community-comment">Comment</label>
              <textarea
                id="community-comment"
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="Share your question, repair story, or advice..."
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

                    {activeReplyId === comment.id ? (
                      <form className={styles.replyForm} onSubmit={(event) => handleReplySubmit(event, comment.id, comment.id, comment.author)}>
                        <textarea
                          value={replyDrafts[comment.id] ?? ''}
                          onChange={(event) => setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [comment.id]: event.target.value }))}
                          placeholder={`Reply to ${comment.author}...`}
                        />
                        <div className={styles.replyFormActions}>
                          <button type="button" onClick={() => setActiveReplyId(null)}>
                            Cancel
                          </button>
                          <button type="submit">Submit Reply</button>
                        </div>
                      </form>
                    ) : null}

                    {comment.replies.length > 0 ? (
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
                                {reply.replyTo ? <span className={styles.replyMention}>@{reply.replyTo} </span> : null}
                                {reply.message}
                              </p>
                              <div className={styles.commentActions}>
                                <span>{reply.date}</span>
                                <span>{reply.likes} likes</span>
                                <button type="button" className={styles.commentActionButton} onClick={() => handleReplyToggle(reply.id)}>
                                  Reply
                                </button>
                              </div>

                              {activeReplyId === reply.id ? (
                                <form className={styles.replyForm} onSubmit={(event) => handleReplySubmit(event, comment.id, reply.id, reply.author)}>
                                  <textarea
                                    value={replyDrafts[reply.id] ?? ''}
                                    onChange={(event) => setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [reply.id]: event.target.value }))}
                                    placeholder={`Reply to ${reply.author}...`}
                                  />
                                  <div className={styles.replyFormActions}>
                                    <button type="button" onClick={() => setActiveReplyId(null)}>
                                      Cancel
                                    </button>
                                    <button type="submit">Submit Reply</button>
                                  </div>
                                </form>
                              ) : null}
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : null}
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
