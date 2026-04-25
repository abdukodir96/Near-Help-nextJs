'use client';

import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Eye,
  Heart,
  HeartStraight,
  MapPin,
  UsersThree,
} from 'phosphor-react';
import { serviceItems } from '@/components/services/services-data';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import type { AgentItem, AgentReview } from './agents-data';
import { AgentFollowButton } from './agent-follow-button';
import styles from './agent-detail-page.module.scss';

type ReviewReply = {
  id: string;
  author: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  replyTo: string;
  avatar: string;
  backendId?: string;
};

type ReviewThreadItem = {
  id: string;
  author: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  avatar: string;
  backendId?: string;
  replies: ReviewReply[];
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

type ReviewFeedback = {
  type: 'error' | 'success';
  text: string;
};

const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentContent
        createdAt
        commentLikes
        meLiked
        memberData {
          _id
          memberNick
          memberFullName
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

const GET_COMMENT_THREAD = gql`
  query GetCommentThread($input: GetCommentThreadInput!) {
    getCommentThread(input: $input) {
      list {
        _id
        parentCommentId
        commentContent
        createdAt
        commentLikes
        meLiked
        memberData {
          _id
          memberNick
          memberFullName
          memberImage
        }
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
    }
  }
`;

const CREATE_REPLY = gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      _id
    }
  }
`;

const LIKE_TARGET_COMMENT = gql`
  mutation LikeTargetComment($input: LikeTargetCommentInput!) {
    likeTargetComment(input: $input) {
      likeRefId
      myFavorite
    }
  }
`;

const compactNumberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const reviewAvatars = [
  '/theme/images/testimonial/img-1.jpg',
  '/theme/images/testimonial/img-2.jpg',
  '/theme/images/testimonial/img-3.jpg',
  '/theme/images/testimonial/img-4.jpg',
  '/theme/images/testimonial/img-5.jpg',
] as const;

const replyAvatars = [
  '/theme/images/team/1.jpg',
  '/theme/images/team/2.jpg',
  '/theme/images/team/3.jpg',
  '/theme/images/team/4.jpg',
] as const;

const GRAPHQL_ORIGIN = (process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3007/graphql').replace(/\/graphql$/, '');

const formatCompactNumber = (value: number) => compactNumberFormatter.format(value);

const formatRelativeShort = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'now';
  }

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < minute) return 'now';
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m`;
  if (diffMs < day) return `${Math.max(1, Math.floor(diffMs / hour))}h`;
  if (diffMs < week) return `${Math.max(1, Math.floor(diffMs / day))}d`;
  if (diffMs < month) return `${Math.max(1, Math.floor(diffMs / week))}w`;
  if (diffMs < year) return `${Math.max(1, Math.floor(diffMs / month))}mo`;
  return `${Math.max(1, Math.floor(diffMs / year))}y`;
};

const normalizeAssetUrl = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/uploads/')) return `${GRAPHQL_ORIGIN}${value}`;
  return value;
};

const getCommentAuthor = (memberData?: BackendCommentMember | null) => memberData?.memberFullName || memberData?.memberNick || 'NearHelp user';

const toThreadReviews = (reviews: AgentReview[]): ReviewThreadItem[] =>
  reviews.map((review, index) => ({
    id: review.id,
    author: review.author,
    date: review.date,
    message: review.message,
    likes: Math.max(12, 96 - index * 18),
    meLiked: false,
    avatar: reviewAvatars[index % reviewAvatars.length],
    replies: [],
  }));

const mapThreadReplies = (items: BackendComment[]): ReviewReply[] => {
  const authorById = new Map<string, string>();

  items.forEach((item) => {
    authorById.set(item._id, getCommentAuthor(item.memberData));
  });

  return items.slice(1).map((item, index) => ({
    id: item._id,
    backendId: item._id,
    author: getCommentAuthor(item.memberData),
    date: formatRelativeShort(item.createdAt),
    message: item.commentContent,
    likes: item.commentLikes ?? 0,
    meLiked: Boolean(item.meLiked),
    replyTo: item.parentCommentId ? authorById.get(item.parentCommentId) || 'user' : 'user',
    avatar: normalizeAssetUrl(item.memberData?.memberImage, replyAvatars[index % replyAvatars.length]),
  }));
};

export const AgentDetailPageContent = ({ agent }: { agent: AgentItem }) => {
  const client = useApolloClient();
  const [reviews, setReviews] = useState<ReviewThreadItem[]>(() => toThreadReviews(agent.reviews));
  const [draftReview, setDraftReview] = useState('');
  const [showReviewError, setShowReviewError] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyErrors, setReplyErrors] = useState<Record<string, boolean>>({});
  const [replyTargets, setReplyTargets] = useState<Record<string, string>>({});
  const [replyParentIds, setReplyParentIds] = useState<Record<string, string>>({});
  const [collapsedReplies, setCollapsedReplies] = useState<Record<string, boolean>>({});
  const [pendingLikeIds, setPendingLikeIds] = useState<string[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);

  const backendReviewEnabled = Boolean(agent.backendMemberId);

  const relatedServices = agent.serviceSlugs
    .map((serviceSlug) => serviceItems.find((item) => item.slug === serviceSlug))
    .filter((service): service is (typeof serviceItems)[number] => Boolean(service));

  const showAuthRequired = useCallback(async (actionLabel: string) => {
    await Swal.fire({
      icon: 'warning',
      title: 'Login required',
      text: `Please log in to ${actionLabel}.`,
      confirmButtonColor: '#0052da',
      confirmButtonText: 'OK',
    });
  }, []);

  const loadBackendReviews = useCallback(async () => {
    if (!agent.backendMemberId) {
      setReviews(toThreadReviews(agent.reviews));
      return;
    }

    setReviewsLoading(true);

    try {
      const rootResponse = await client.query<{ getComments: { list: BackendComment[] } }>({
        query: GET_COMMENTS,
        variables: {
          input: {
            page: 1,
            limit: 20,
            sort: 'createdAt',
            direction: 'DESC',
            search: {
              commentRefId: agent.backendMemberId,
            },
          },
        },
        fetchPolicy: 'network-only',
      });

      const rootComments = rootResponse.data?.getComments?.list ?? [];

      const threadResponses = await Promise.all(
        rootComments.map((rootComment) =>
          client.query<{ getCommentThread: { list: BackendComment[] } }>({
            query: GET_COMMENT_THREAD,
            variables: {
              input: {
                rootCommentId: rootComment._id,
                page: 1,
                limit: 50,
                sort: 'createdAt',
                direction: 'ASC',
              },
            },
            fetchPolicy: 'network-only',
          }),
        ),
      );

      const nextReviews: ReviewThreadItem[] = rootComments.map((rootComment, index) => {
        const threadItems = threadResponses[index]?.data?.getCommentThread?.list ?? [rootComment];

        return {
          id: rootComment._id,
          backendId: rootComment._id,
          author: getCommentAuthor(rootComment.memberData),
          date: formatRelativeShort(rootComment.createdAt),
          message: rootComment.commentContent,
          likes: rootComment.commentLikes ?? 0,
          meLiked: Boolean(rootComment.meLiked),
          avatar: normalizeAssetUrl(rootComment.memberData?.memberImage, reviewAvatars[index % reviewAvatars.length]),
          replies: mapThreadReplies(threadItems),
        };
      });

      setReviews(nextReviews);
      setFeedback(null);
    } catch (error) {
      console.error('Failed to load agent reviews from backend:', error);
      setReviews(toThreadReviews(agent.reviews));
      setFeedback({
        type: 'error',
        text: 'Live reviews could not be loaded. Local showcase reviews are being used for now.',
      });
    } finally {
      setReviewsLoading(false);
    }
  }, [agent.backendMemberId, agent.reviews, client]);

  useEffect(() => {
    void loadBackendReviews();
  }, [loadBackendReviews]);

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Boolean(Cookies.get(ACCESS_TOKEN_KEY))) {
      await showAuthRequired('submit a review');
      return;
    }

    const normalizedReview = draftReview.trim();

    if (!normalizedReview) {
      setShowReviewError(true);
      return;
    }

    if (backendReviewEnabled && agent.backendMemberId) {
      try {
        await client.mutate({
          mutation: CREATE_COMMENT,
          variables: {
            input: {
              commentGroup: 'MEMBER',
              commentContent: normalizedReview,
              commentRefId: agent.backendMemberId,
            },
          },
        });

        setDraftReview('');
        setShowReviewError(false);
        setFeedback({ type: 'success', text: 'Your review has been submitted successfully.' });
        await loadBackendReviews();
        return;
      } catch (error) {
        console.error('Failed to create review:', error);
        setFeedback({ type: 'error', text: 'Your review could not be submitted. Please check your login session and try again.' });
        return;
      }
    }

    const nextReview: ReviewThreadItem = {
      id: `${agent.slug}-review-${Date.now()}`,
      author: 'you_nearhelp',
      date: 'now',
      message: normalizedReview,
      likes: 0,
      meLiked: false,
      avatar: reviewAvatars[0],
      replies: [],
    };

    setReviews((currentReviews) => [nextReview, ...currentReviews]);
    setDraftReview('');
    setShowReviewError(false);
    setFeedback({ type: 'success', text: 'Your review has been added locally.' });
  };

  const openReplyForm = async (reviewId: string, targetAuthor: string, parentCommentId?: string) => {
    if (!Boolean(Cookies.get(ACCESS_TOKEN_KEY))) {
      await showAuthRequired('reply to a review');
      return;
    }

    setActiveReplyId(reviewId);
    setReplyTargets((currentTargets) => ({ ...currentTargets, [reviewId]: targetAuthor }));
    setReplyParentIds((currentParents) => ({ ...currentParents, [reviewId]: parentCommentId ?? reviewId }));
    setReplyErrors((currentErrors) => ({ ...currentErrors, [reviewId]: false }));
    setCollapsedReplies((currentState) => ({ ...currentState, [reviewId]: false }));
  };

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>, reviewId: string) => {
    event.preventDefault();

    if (!Boolean(Cookies.get(ACCESS_TOKEN_KEY))) {
      await showAuthRequired('reply to a review');
      return;
    }

    const normalizedReply = (replyDrafts[reviewId] ?? '').trim();
    const replyTarget = replyTargets[reviewId];

    if (!normalizedReply) {
      setReplyErrors((currentErrors) => ({ ...currentErrors, [reviewId]: true }));
      return;
    }

    if (backendReviewEnabled && reviews.find((review) => review.id === reviewId)?.backendId) {
      try {
        await client.mutate({
          mutation: CREATE_REPLY,
          variables: {
            input: {
              parentCommentId: replyParentIds[reviewId] ?? reviewId,
              commentContent: normalizedReply,
            },
          },
        });

        setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [reviewId]: '' }));
        setReplyErrors((currentErrors) => ({ ...currentErrors, [reviewId]: false }));
        setActiveReplyId(null);
        setFeedback({ type: 'success', text: 'Your reply has been submitted successfully.' });
        await loadBackendReviews();
        return;
      } catch (error) {
        console.error('Failed to create reply:', error);
        setFeedback({ type: 'error', text: 'Your reply could not be submitted. Please check your login session and try again.' });
        return;
      }
    }

    const nextReply: ReviewReply = {
      id: `${reviewId}-reply-${Date.now()}`,
      author: 'nearhelp_team',
      date: 'now',
      message: normalizedReply,
      likes: 0,
      meLiked: false,
      replyTo: replyTarget || 'user',
      avatar: replyAvatars[0],
    };

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId ? { ...review, replies: [...review.replies, nextReply] } : review,
      ),
    );
    setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [reviewId]: '' }));
    setReplyErrors((currentErrors) => ({ ...currentErrors, [reviewId]: false }));
    setActiveReplyId(null);
    setFeedback({ type: 'success', text: 'Your reply has been added locally.' });
  };

  const toggleReviewLikeOptimistic = (reviewId: string) => {
    let nextLiked = false;

    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) return review;
        nextLiked = !review.meLiked;
        return {
          ...review,
          meLiked: !review.meLiked,
          likes: review.likes + (review.meLiked ? -1 : 1),
        };
      }),
    );

    return nextLiked;
  };

  const revertReviewLike = (reviewId: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              meLiked: !review.meLiked,
              likes: review.likes + (review.meLiked ? -1 : 1),
            }
          : review,
      ),
    );
  };

  const toggleReplyLikeOptimistic = (reviewId: string, replyId: string) => {
    let nextLiked = false;

    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) return review;
        return {
          ...review,
          replies: review.replies.map((reply) => {
            if (reply.id !== replyId) return reply;
            nextLiked = !reply.meLiked;
            return {
              ...reply,
              meLiked: !reply.meLiked,
              likes: reply.likes + (reply.meLiked ? -1 : 1),
            };
          }),
        };
      }),
    );

    return nextLiked;
  };

  const revertReplyLike = (reviewId: string, replyId: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) return review;
        return {
          ...review,
          replies: review.replies.map((reply) =>
            reply.id === replyId
              ? {
                  ...reply,
                  meLiked: !reply.meLiked,
                  likes: reply.likes + (reply.meLiked ? -1 : 1),
                }
              : reply,
          ),
        };
      }),
    );
  };

  const handleReviewLike = async (reviewId: string, backendCommentId?: string) => {
    if (pendingLikeIds.includes(reviewId)) return;

    if (!Boolean(Cookies.get(ACCESS_TOKEN_KEY))) {
      await showAuthRequired('like a review');
      return;
    }

    if (!backendCommentId) {
      toggleReviewLikeOptimistic(reviewId);
      return;
    }

    toggleReviewLikeOptimistic(reviewId);
    setPendingLikeIds((currentIds) => [...currentIds, reviewId]);

    try {
      await client.mutate({
        mutation: LIKE_TARGET_COMMENT,
        variables: {
          input: {
            targetCommentId: backendCommentId,
          },
        },
      });
      setFeedback(null);
    } catch (error) {
      console.error('Failed to toggle review like:', error);
      revertReviewLike(reviewId);
      setFeedback({ type: 'error', text: 'Review like status could not be updated.' });
    } finally {
      setPendingLikeIds((currentIds) => currentIds.filter((id) => id !== reviewId));
    }
  };

  const handleReplyLike = async (reviewId: string, replyId: string, backendCommentId?: string) => {
    if (pendingLikeIds.includes(replyId)) return;

    if (!Boolean(Cookies.get(ACCESS_TOKEN_KEY))) {
      await showAuthRequired('like a reply');
      return;
    }

    if (!backendCommentId) {
      toggleReplyLikeOptimistic(reviewId, replyId);
      return;
    }

    toggleReplyLikeOptimistic(reviewId, replyId);
    setPendingLikeIds((currentIds) => [...currentIds, replyId]);

    try {
      await client.mutate({
        mutation: LIKE_TARGET_COMMENT,
        variables: {
          input: {
            targetCommentId: backendCommentId,
          },
        },
      });
      setFeedback(null);
    } catch (error) {
      console.error('Failed to toggle reply like:', error);
      revertReplyLike(reviewId, replyId);
      setFeedback({ type: 'error', text: 'Reply like status could not be updated.' });
    } finally {
      setPendingLikeIds((currentIds) => currentIds.filter((id) => id !== replyId));
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.profileSection}>
        <div className={styles.profileInner}>
          <div className={styles.profileGrid}>
            <div className={styles.portraitPanel}>
              <div className={styles.portraitFrame}>
                <div className={styles.portraitWrap}>
                  <Image src={agent.image} alt={agent.name} fill sizes="(max-width: 1180px) 100vw, 48vw" className={styles.portrait} priority />
                </div>
              </div>
            </div>

            <article className={styles.infoPanel}>
              <div className={styles.nameBand}>
                <h1>{agent.name}</h1>
              </div>

              <p className={styles.roleLine}>
                {agent.role} · {agent.location}
              </p>

              <div className={styles.actionRow}>
                <AgentFollowButton />
                <Link prefetch={false} href="/booking" className={styles.bookButton}>
                  Book this agent
                </Link>
              </div>

              <div className={styles.statRow}>
                <div className={styles.statCard}>
                  <Briefcase size={20} weight="duotone" />
                  <strong>{formatCompactNumber(agent.completedProjects)}</strong>
                  <span>Projects</span>
                </div>
                <div className={styles.statCard}>
                  <HeartStraight size={20} weight="duotone" />
                  <strong>{formatCompactNumber(agent.likes)}</strong>
                  <span>Likes</span>
                </div>
                <div className={styles.statCard}>
                  <UsersThree size={20} weight="duotone" />
                  <strong>{formatCompactNumber(agent.followers)}</strong>
                  <span>Followers</span>
                </div>
                <div className={styles.statCard}>
                  <Eye size={20} weight="duotone" />
                  <strong>{formatCompactNumber(agent.profileViews)}</strong>
                  <span>Views</span>
                </div>
              </div>

              <dl className={styles.infoList}>
                <div className={styles.infoItem}>
                  <dt>Position:</dt>
                  <dd>{agent.position}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Practice Area:</dt>
                  <dd>{agent.practiceArea}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Experience:</dt>
                  <dd>{agent.experience}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Address:</dt>
                  <dd>{agent.address}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Phone:</dt>
                  <dd>{agent.phone}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Email:</dt>
                  <dd>{agent.email}</dd>
                </div>
                <div className={styles.infoItem}>
                  <dt>Fax:</dt>
                  <dd>{agent.fax}</dd>
                </div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.copySection}>
        <div className={styles.copyInner}>
          <h2>Personal Experience</h2>
          {agent.personalExperience.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.copyInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Agent Services</p>
            <h2>Services handled by {agent.name}</h2>
          </div>

          <div className={styles.serviceGrid}>
            {relatedServices.map((service) => (
              <article key={service.slug} className={styles.serviceCard}>
                <div className={styles.serviceImageWrap}>
                  <Image src={service.image} alt={service.title} width={720} height={520} className={styles.serviceImage} />
                </div>

                <div className={styles.serviceBody}>
                  <div className={styles.serviceMetaTop}>
                    <span className={styles.serviceTag}>{service.category}</span>
                    <span className={styles.servicePrice}>{service.priceLabel}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className={styles.serviceMetaBottom}>
                    <span>
                      <MapPin size={16} weight="bold" />
                      {service.locations.slice(0, 2).join(', ')}
                    </span>
                    <span>{service.responseTime}</span>
                  </div>
                  <Link prefetch={false} href={`/services/${service.slug}`} className={styles.inlineLink}>
                    View service
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.projectsSection}>
        <div className={styles.copyInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Completed Projects</p>
            <h2>Recent work delivered</h2>
          </div>

          <div className={styles.projectGrid}>
            {agent.completedProjectsList.map((project) => {
              const relatedService = serviceItems.find((item) => item.slug === project.serviceSlug);
              const projectImage = relatedService?.image ?? '/theme/images/projects/img-1.jpg';

              return (
                <article key={project.id} className={styles.projectCard}>
                  <div className={styles.projectImageWrap}>
                    <Image src={projectImage} alt={project.title} width={820} height={520} className={styles.projectImage} />
                  </div>

                  <div className={styles.projectContent}>
                    <div className={styles.projectTop}>
                      <span className={styles.projectOption}>{project.option}</span>
                      <span className={styles.projectLocation}>{project.location}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <Link prefetch={false} href={`/services/${project.serviceSlug}`} className={styles.projectLink}>
                      Related service
                      <ArrowRight size={15} weight="bold" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.copyInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Client Reviews</p>
            <h2>What customers say</h2>
            {backendReviewEnabled ? (
              <p className={styles.liveReviewsNote}>This section is synced with backend comments, replies, and likes.</p>
            ) : (
              <p className={styles.liveReviewsNote}>This agent currently uses local showcase reviews until backend member mapping is attached.</p>
            )}
            {reviewsLoading ? <p className={styles.reviewState}>Loading live reviews...</p> : null}
            {feedback ? (
              <p className={`${styles.reviewFeedback} ${feedback.type === 'error' ? styles.reviewFeedbackError : styles.reviewFeedbackSuccess}`}>
                {feedback.text}
              </p>
            ) : null}
          </div>

          <div className={styles.reviewList}>
            {reviews.map((review) => {
              const areRepliesCollapsed = collapsedReplies[review.id] ?? false;
              const reviewLikePending = pendingLikeIds.includes(review.id);

              return (
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
                          disabled={reviewLikePending}
                        >
                          <Heart size={24} weight={review.meLiked ? 'fill' : 'regular'} />
                        </button>
                      </div>

                      <div className={styles.commentMeta}>
                        <span>{review.date}</span>
                        <span>{formatCompactNumber(review.likes)} likes</span>
                        <button type="button" className={styles.inlineReplyButton} onClick={() => openReplyForm(review.id, review.author, review.backendId ?? review.id)}>
                          Reply
                        </button>
                      </div>

                      {review.replies.length > 0 && !areRepliesCollapsed ? (
                        <div className={styles.replyList}>
                          {review.replies.map((reply) => {
                            const replyLikePending = pendingLikeIds.includes(reply.id);

                            return (
                              <div key={reply.id} className={styles.replyRow}>
                                <div className={styles.replyAvatarWrap}>
                                  <Image src={reply.avatar} alt={reply.author} fill sizes="56px" className={styles.replyAvatar} unoptimized />
                                </div>

                                <div className={styles.replyBody}>
                                  <div className={styles.commentTop}>
                                    <p className={styles.replyText}>
                                      <strong>{reply.author}</strong>{' '}
                                      <span className={styles.replyMention}>@{reply.replyTo}</span> {reply.message}
                                    </p>
                                    <button
                                      type="button"
                                      className={`${styles.commentLikeButton} ${reply.meLiked ? styles.commentLikeButtonLiked : ''}`}
                                      aria-label="Like reply"
                                      onClick={() => handleReplyLike(review.id, reply.id, reply.backendId)}
                                      disabled={replyLikePending}
                                    >
                                      <Heart size={22} weight={reply.meLiked ? 'fill' : 'regular'} />
                                    </button>
                                  </div>

                                  <div className={styles.commentMeta}>
                                    <span>{reply.date}</span>
                                    <span>{formatCompactNumber(reply.likes)} likes</span>
                                    <button
                                      type="button"
                                      className={styles.inlineReplyButton}
                                      onClick={() => openReplyForm(review.id, reply.author, reply.backendId ?? review.backendId ?? review.id)}
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      {review.replies.length > 0 ? (
                        <button
                          type="button"
                          className={styles.toggleRepliesButton}
                          onClick={() =>
                            setCollapsedReplies((currentState) => ({
                              ...currentState,
                              [review.id]: !areRepliesCollapsed,
                            }))
                          }
                        >
                          <span className={styles.toggleRepliesLine} />
                          <span>{areRepliesCollapsed ? `View replies (${review.replies.length})` : 'Hide replies'}</span>
                        </button>
                      ) : null}

                      {activeReplyId === review.id ? (
                        <form onSubmit={(event) => handleReplySubmit(event, review.id)} className={styles.replyForm}>
                          <label htmlFor={`reply-${review.id}`} className={styles.replyLabel}>
                            Replying to @{replyTargets[review.id] || review.author}
                          </label>
                          <textarea
                            id={`reply-${review.id}`}
                            name={`reply-${review.id}`}
                            value={replyDrafts[review.id] ?? ''}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [review.id]: nextValue }));
                              if (replyErrors[review.id] && nextValue.trim()) {
                                setReplyErrors((currentErrors) => ({ ...currentErrors, [review.id]: false }));
                              }
                            }}
                            className={styles.replyTextarea}
                            placeholder="Write your reply here"
                          />
                          {replyErrors[review.id] ? <p className={styles.replyError}>Please write a reply before submitting.</p> : null}
                          <div className={styles.replyActions}>
                            <button type="button" className={styles.replyCancelButton} onClick={() => setActiveReplyId(null)}>
                              Cancel
                            </button>
                            <button type="submit" className={styles.replySubmitButton}>
                              <span>Post Reply</span>
                              <ArrowUpRight size={20} weight="regular" />
                            </button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.reviewComposer}>
            <h3>Leave A Review</h3>
            <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
              <label htmlFor="agent-review" className={styles.reviewLabel}>
                Review
              </label>
              <textarea
                id="agent-review"
                name="review"
                value={draftReview}
                onChange={(event) => {
                  setDraftReview(event.target.value);
                  if (showReviewError && event.target.value.trim()) {
                    setShowReviewError(false);
                  }
                }}
                className={styles.reviewTextarea}
                placeholder="Write your review here"
              />
              {showReviewError ? <p className={styles.reviewError}>Please write a review before submitting.</p> : null}
              <div className={styles.reviewSubmitRow}>
                <button type="submit" className={styles.reviewSubmitButton}>
                  <span>Submit Review</span>
                  <ArrowUpRight size={28} weight="regular" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};
