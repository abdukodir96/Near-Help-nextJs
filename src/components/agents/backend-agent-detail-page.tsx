'use client';

import { gql } from '@apollo/client';
import { useApolloClient, useQuery, useMutation } from '@apollo/client/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Check,
  Eye,
  Heart,
  HeartStraight,
  MapPin,
  PaperPlaneTilt,
  UserPlus,
  UsersThree,
} from 'phosphor-react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { BACKEND_URL } from '@/lib/config/env';
import {
  GET_MEMBER,
  GET_AGENT_SERVICES,
  TOGGLE_FOLLOW,
  GET_COMMENTS,
} from '@/lib/graphql/queries';
import styles from './agent-detail-page.module.scss';

// ── Local GQL ─────────────────────────────────────────────────────────────────

const GET_COMMENT_THREAD = gql`
  query GetCommentThread($input: GetCommentThreadInput!) {
    getCommentThread(input: $input) {
      list {
        _id parentCommentId commentContent createdAt commentLikes meLiked
        memberData { _id memberNick memberFullName memberImage }
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) { _id }
  }
`;

const CREATE_REPLY = gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) { _id }
  }
`;

const LIKE_TARGET_COMMENT = gql`
  mutation LikeTargetComment($input: LikeTargetCommentInput!) {
    likeTargetComment(input: $input) { likeRefId myFavorite }
  }
`;

// ── Types ─────────────────────────────────────────────────────────────────────

type BackendMember = {
  _id: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberServices: number;
  memberArticles: number;
  memberLikes: number;
  memberFollowers: number;
  memberFollowings: number;
  memberViews: number;
  memberComments: number;
  memberRank: number;
  meFollowed?: boolean;
  createdAt: string;
};

type BackendService = {
  _id: string;
  serviceCategory: string;
  serviceTitle: string;
  servicePrice: number;
  serviceViews: number;
  serviceLikes: number;
  serviceImages?: string[];
  serviceDesc?: string;
  serviceArea?: string;
  serviceOption: string;
};

type BackendCommentMember = {
  _id: string;
  memberNick: string;
  memberFullName?: string | null;
  memberImage?: string | null;
};

type BackendComment = {
  _id: string;
  commentContent: string;
  parentCommentId?: string | null;
  createdAt: string;
  commentLikes?: number | null;
  meLiked?: boolean | null;
  memberData?: BackendCommentMember | null;
};

type ReviewReply = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  replyTo?: string;
  backendId?: string;
};

type ReviewThread = {
  id: string;
  backendId: string;
  author: string;
  avatar: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  replies: ReviewReply[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const normalizeUrl = (val?: string | null, fallback = '/theme/images/team/1.jpg') => {
  if (!val) return fallback;
  if (val.startsWith('http')) return val;
  if (val.startsWith('/uploads/')) return `${BACKEND_URL}${val}`;
  return val;
};

const serviceImageUrl = (images?: string[]) => {
  if (!images?.length) return '/theme/images/service/1.jpg';
  return normalizeUrl(images[0]);
};

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = (n: number) => compact.format(n);

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = 60000; const h = m * 60; const d = h * 24; const w = d * 7; const mo = d * 30;
  if (diff < m)  return 'now';
  if (diff < h)  return `${Math.floor(diff / m)}m ago`;
  if (diff < d)  return `${Math.floor(diff / h)}h ago`;
  if (diff < w)  return `${Math.floor(diff / d)}d ago`;
  if (diff < mo) return `${Math.floor(diff / w)}w ago`;
  return `${Math.floor(diff / mo)}mo ago`;
};

const getAuthor = (m?: BackendCommentMember | null) => m?.memberFullName || m?.memberNick || 'NearHelp user';
const getAvatar = (m?: BackendCommentMember | null, fallback = '/theme/images/team/1.jpg') =>
  normalizeUrl(m?.memberImage, fallback);

const avatarPool = [
  '/theme/images/testimonial/img-1.jpg',
  '/theme/images/testimonial/img-2.jpg',
  '/theme/images/testimonial/img-3.jpg',
  '/theme/images/testimonial/img-4.jpg',
];

// ── Component ─────────────────────────────────────────────────────────────────

export function BackendAgentDetailPage({ memberId }: { memberId: string }) {
  const router = useRouter();
  const client = useApolloClient();

  const [following, setFollowing]     = useState(false);
  const [reviews, setReviews]         = useState<ReviewThread[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [pendingLikes, setPendingLikes] = useState<string[]>([]);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: memberData, loading: memberLoading, error: memberError } = useQuery<{
    getMember: BackendMember;
  }>(GET_MEMBER, {
    variables: { input: { targetMemberId: memberId } },
    fetchPolicy: 'network-only',
  });

  const { data: servicesData } = useQuery<{
    getAgentServices: { list: BackendService[]; meta: { totalCount: number } };
  }>(GET_AGENT_SERVICES, {
    variables: { input: { agentId: memberId, page: 1, limit: 6 } },
    fetchPolicy: 'cache-and-network',
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [toggleFollow] = useMutation<any>(TOGGLE_FOLLOW);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [createReply]   = useMutation(CREATE_REPLY);

  const member   = memberData?.getMember;
  const services = servicesData?.getAgentServices?.list ?? [];

  // ── Load reviews from backend ──────────────────────────────────────────────

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await client.query<{ getComments: { list: BackendComment[] } }>({
        query: GET_COMMENTS,
        variables: { input: { page: 1, limit: 20, search: { commentRefId: memberId } } },
        fetchPolicy: 'network-only',
      });

      const rootComments = res.data?.getComments?.list ?? [];

      const threadRes = await Promise.all(
        rootComments.map((c) =>
          client.query<{ getCommentThread: { list: BackendComment[] } }>({
            query: GET_COMMENT_THREAD,
            variables: { input: { rootCommentId: c._id, page: 1, limit: 50 } },
            fetchPolicy: 'network-only',
          }),
        ),
      );

      setReviews(
        rootComments.map((c: BackendComment, i: number) => {
          const thread = threadRes[i]?.data?.getCommentThread?.list ?? [c];
          return {
            id: c._id,
            backendId: c._id,
            author: getAuthor(c.memberData),
            avatar: getAvatar(c.memberData, avatarPool[i % avatarPool.length]),
            date: relativeTime(c.createdAt),
            message: c.commentContent,
            likes: c.commentLikes ?? 0,
            meLiked: Boolean(c.meLiked),
            replies: thread.slice(1).map((r: BackendComment, ri: number) => ({
              id: r._id,
              backendId: r._id,
              author: getAuthor(r.memberData),
              avatar: getAvatar(r.memberData, avatarPool[ri % avatarPool.length]),
              date: relativeTime(r.createdAt),
              message: r.commentContent,
              likes: r.commentLikes ?? 0,
              meLiked: Boolean(r.meLiked),
            })),
          };
        }),
      );
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [client, memberId]);

  useEffect(() => { void loadReviews(); }, [loadReviews]);

  // init follow state
  useEffect(() => {
    if (member?.meFollowed !== undefined) setFollowing(Boolean(member.meFollowed));
  }, [member?.meFollowed]);

  // ── Auth helper ────────────────────────────────────────────────────────────

  const showAuthAlert = async (action: string) => {
    await Swal.fire({ icon: 'warning', title: 'Login required', text: `Please log in to ${action}.`, confirmButtonColor: '#0052da', confirmButtonText: 'OK' });
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFollow = async () => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('follow this agent'); return; }
    const next = !following;
    setFollowing(next);
    try {
      await toggleFollow({ variables: { input: { targetMemberId: memberId } } });
    } catch {
      setFollowing(!next);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('write a review'); return; }
    const text = commentDraft.trim();
    if (!text) return;
    try {
      await createComment({ variables: { input: { commentGroup: 'MEMBER', commentContent: text, commentRefId: memberId } } });
      setCommentDraft('');
      await loadReviews();
    } catch {
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not post your review. Please try again.', confirmButtonColor: '#0052da' });
    }
  };

  const handleReplyToggle = async (id: string) => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('reply'); return; }
    setActiveReplyId((cur) => (cur === id ? null : id));
  };

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>, reviewId: string) => {
    e.preventDefault();
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('reply'); return; }
    const text = (replyDrafts[reviewId] ?? '').trim();
    if (!text) return;
    try {
      await createReply({ variables: { input: { parentCommentId: reviewId, commentContent: text } } });
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
      setActiveReplyId(null);
      await loadReviews();
    } catch {
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not post your reply.', confirmButtonColor: '#0052da' });
    }
  };

  const handleReviewLike = async (reviewId: string, backendId: string) => {
    if (pendingLikes.includes(reviewId)) return;
    if (!Cookies.get(ACCESS_TOKEN_KEY)) { await showAuthAlert('like a review'); return; }
    setReviews((prev) => prev.map((r) => r.id !== reviewId ? r : { ...r, likes: r.likes + (r.meLiked ? -1 : 1), meLiked: !r.meLiked }));
    setPendingLikes((p) => [...p, reviewId]);
    try {
      await client.mutate({ mutation: LIKE_TARGET_COMMENT, variables: { input: { targetCommentId: backendId } } });
    } catch {
      setReviews((prev) => prev.map((r) => r.id !== reviewId ? r : { ...r, likes: r.likes + (r.meLiked ? -1 : 1), meLiked: !r.meLiked }));
    } finally {
      setPendingLikes((p) => p.filter((id) => id !== reviewId));
    }
  };

  // ── Skeleton ───────────────────────────────────────────────────────────────

  if (memberLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.profileSection}>
          <div className={styles.profileInner} style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            Loading agent profile...
          </div>
        </section>
      </main>
    );
  }

  if (memberError || !member) {
    return (
      <main className={styles.page}>
        <section className={styles.profileSection}>
          <div className={styles.profileInner} style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>Agent not found.</p>
            <button
              type="button"
              onClick={() => router.push('/agents')}
              style={{ marginTop: 16, padding: '10px 24px', background: '#0052da', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}
            >
              Back to Agents
            </button>
          </div>
        </section>
      </main>
    );
  }

  const agentName  = member.memberFullName || member.memberNick;
  const agentImage = normalizeUrl(member.memberImage, '/theme/images/team/1.jpg');

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className={styles.page}>
      {/* ── Profile ── */}
      <section className={styles.profileSection}>
        <div className={styles.profileInner}>
          <div className={styles.profileGrid}>
            <div className={styles.portraitPanel}>
              <div className={styles.portraitFrame}>
                <div className={styles.portraitWrap}>
                  <Image src={agentImage} alt={agentName} fill sizes="(max-width: 1180px) 100vw, 48vw" className={styles.portrait} priority unoptimized />
                </div>
              </div>
            </div>

            <article className={styles.infoPanel}>
              <div className={styles.nameBand}>
                <h1>{agentName}</h1>
              </div>

              <p className={styles.roleLine}>
                {member.memberNick} · {member.memberRank === 1 ? 'Top Agent' : 'Agent'}
              </p>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={following ? styles.followButtonActive : styles.followButton}
                  onClick={handleFollow}
                >
                  {following ? <Check size={18} weight="bold" /> : <UserPlus size={18} weight="bold" />}
                  <span>{following ? 'Following' : 'Follow'}</span>
                </button>
                <Link prefetch={false} href="/booking" className={styles.bookButton}>
                  Book this agent
                </Link>
              </div>

              <div className={styles.statRow}>
                <div className={styles.statCard}>
                  <Briefcase size={20} weight="duotone" />
                  <strong>{fmt(member.memberServices)}</strong>
                  <span>Services</span>
                </div>
                <div className={styles.statCard}>
                  <HeartStraight size={20} weight="duotone" />
                  <strong>{fmt(member.memberLikes)}</strong>
                  <span>Likes</span>
                </div>
                <div className={styles.statCard}>
                  <UsersThree size={20} weight="duotone" />
                  <strong>{fmt(member.memberFollowers)}</strong>
                  <span>Followers</span>
                </div>
                <div className={styles.statCard}>
                  <Eye size={20} weight="duotone" />
                  <strong>{fmt(member.memberViews)}</strong>
                  <span>Views</span>
                </div>
              </div>

              <dl className={styles.infoList}>
                {member.memberAddress && (
                  <div className={styles.infoItem}>
                    <dt>Address:</dt>
                    <dd>{member.memberAddress}</dd>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <dt>Nick:</dt>
                  <dd>{member.memberNick}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Articles:</dt>
                  <dd>{member.memberArticles}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Followings:</dt>
                  <dd>{member.memberFollowings}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Member since:</dt>
                  <dd>{new Date(member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</dd>
                </div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      {member.memberDesc && (
        <section className={styles.copySection}>
          <div className={styles.copyInner}>
            <h2>About this Agent</h2>
            <p>{member.memberDesc}</p>
          </div>
        </section>
      )}

      {/* ── Services ── */}
      {services.length > 0 && (
        <section className={styles.servicesSection}>
          <div className={styles.copyInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Agent Services</p>
              <h2>Services by {agentName}</h2>
            </div>

            <div className={styles.serviceGrid}>
              {services.map((service) => (
                <article key={service._id} className={styles.serviceCard}>
                  <div className={styles.serviceImageWrap}>
                    <Image src={serviceImageUrl(service.serviceImages)} alt={service.serviceTitle} width={720} height={520} className={styles.serviceImage} unoptimized />
                  </div>
                  <div className={styles.serviceBody}>
                    <div className={styles.serviceMetaTop}>
                      <span className={styles.serviceTag}>{service.serviceCategory}</span>
                      <span className={styles.servicePrice}>
                        ₩{new Intl.NumberFormat('ko-KR').format(service.servicePrice)}
                      </span>
                    </div>
                    <h3>{service.serviceTitle}</h3>
                    {service.serviceDesc && <p>{service.serviceDesc.slice(0, 100)}...</p>}
                    <div className={styles.serviceMetaBottom}>
                      {service.serviceArea && (
                        <span>
                          <MapPin size={16} weight="bold" />
                          {service.serviceArea}
                        </span>
                      )}
                      <span>{service.serviceOption}</span>
                    </div>
                    <Link prefetch={false} href={`/services/${service._id}`} className={styles.inlineLink}>
                      View service
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      <section id="comments" className={styles.reviewsSection}>
        <div className={styles.copyInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Client Reviews</p>
            <h2>What customers say</h2>
            {reviewsLoading && <p className={styles.reviewState}>Loading reviews...</p>}
          </div>

          {/* Comment form */}
          <form className={styles.reviewForm} onSubmit={handleCommentSubmit}>
            <label htmlFor="agent-review">Leave a Review</label>
            <textarea
              id="agent-review"
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              placeholder="Share your experience with this agent..."
              rows={4}
            />
            <button type="submit" className={styles.reviewSubmitBtn}>
              Submit Review
              <PaperPlaneTilt size={20} weight="bold" />
            </button>
          </form>

          {/* Review list */}
          <div className={styles.reviewList}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.reviewThread}>
                <div className={styles.commentRow}>
                  <div className={styles.commentAvatarWrap}>
                    <Image src={review.avatar} alt={review.author} fill sizes="72px" className={styles.commentAvatar} unoptimized />
                  </div>
                  <div className={styles.commentBody}>
                    <div className={styles.commentTop}>
                      <p className={styles.commentText}>
                        <strong>{review.author}</strong> {review.message}
                      </p>
                      <button
                        type="button"
                        className={`${styles.commentLikeButton} ${review.meLiked ? styles.commentLikeButtonLiked : ''}`}
                        aria-label="Like review"
                        onClick={() => handleReviewLike(review.id, review.backendId)}
                        disabled={pendingLikes.includes(review.id)}
                      >
                        <Heart size={24} weight={review.meLiked ? 'fill' : 'regular'} />
                      </button>
                    </div>
                    <div className={styles.commentMeta}>
                      <span>{review.date}</span>
                      <span>{fmt(review.likes)} likes</span>
                      <button type="button" className={styles.inlineReplyButton} onClick={() => handleReplyToggle(review.id)}>
                        Reply
                      </button>
                    </div>

                    {activeReplyId === review.id && (
                      <form className={styles.replyForm} onSubmit={(e) => handleReplySubmit(e, review.id)}>
                        <textarea
                          value={replyDrafts[review.id] ?? ''}
                          onChange={(e) => setReplyDrafts((p) => ({ ...p, [review.id]: e.target.value }))}
                          placeholder={`Reply to ${review.author}...`}
                          rows={3}
                        />
                        <div className={styles.replyFormActions}>
                          <button type="button" onClick={() => setActiveReplyId(null)}>Cancel</button>
                          <button type="submit">Submit Reply</button>
                        </div>
                      </form>
                    )}

                    {review.replies.length > 0 && (
                      <div className={styles.replyList}>
                        {review.replies.map((reply) => (
                          <article key={reply.id} className={styles.replyThread}>
                            <div className={styles.replyAvatarWrap}>
                              <Image src={reply.avatar} alt={reply.author} fill sizes="44px" className={styles.commentAvatar} unoptimized />
                            </div>
                            <div className={styles.replyBody}>
                              <p className={styles.commentText}>
                                <strong>{reply.author}</strong> {reply.message}
                              </p>
                              <div className={styles.commentMeta}>
                                <span>{reply.date}</span>
                                <span>{fmt(reply.likes)} likes</span>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {!reviewsLoading && reviews.length === 0 && (
              <p style={{ color: '#9aa0ab', fontSize: '1rem', marginTop: 24 }}>No reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
