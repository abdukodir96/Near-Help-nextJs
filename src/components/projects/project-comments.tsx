'use client';

import Image from 'next/image';
import { type FormEvent, useState } from 'react';
import { Heart, PaperPlaneTilt } from 'phosphor-react';
import styles from '../services/service-comments.module.scss';

type Comment = {
  id: string;
  author: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  avatar: string;
  replies: Reply[];
};

type Reply = {
  id: string;
  author: string;
  date: string;
  message: string;
  likes: number;
  meLiked: boolean;
  avatar: string;
  replyTo?: string;
};

const initialComments: Comment[] = [
  {
    id: 'c1',
    author: 'James Harrington',
    date: 'April 12, 2025',
    message: 'Absolutely outstanding work! The team was professional from start to finish. The results exceeded our expectations.',
    likes: 11,
    meLiked: false,
    avatar: '/theme/images/team/1.jpg',
    replies: [],
  },
  {
    id: 'c2',
    author: 'Sofia Müller',
    date: 'March 28, 2025',
    message: 'Really impressed by the quality of this project. The attention to detail is remarkable and everything was completed on schedule. Highly recommend NearHelp!',
    likes: 18,
    meLiked: false,
    avatar: '/theme/images/team/3.jpg',
    replies: [],
  },
  {
    id: 'c3',
    author: 'Kevin Park',
    date: 'February 15, 2025',
    message: 'Great experience working with the team. They explained every step of the process and left the area spotless after finishing. Will definitely hire again.',
    likes: 4,
    meLiked: false,
    avatar: '/theme/images/team/4.jpg',
    replies: [],
  },
];

export const ProjectComments = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setComments((prev) => [{
      id: `local-${Date.now()}`,
      author: 'You',
      date: 'Just now',
      message: text,
      likes: 0,
      meLiked: false,
      avatar: '/theme/images/team/2.jpg',
      replies: [],
    }, ...prev]);
    setDraft('');
  };

  const handleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id !== commentId ? c : { ...c, likes: c.likes + (c.meLiked ? -1 : 1), meLiked: !c.meLiked },
      ),
    );
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id !== commentId ? c : {
          ...c,
          replies: c.replies.map((r) =>
            r.id !== replyId ? r : { ...r, likes: r.likes + (r.meLiked ? -1 : 1), meLiked: !r.meLiked },
          ),
        },
      ),
    );
  };

  const handleReplySubmit = (e: FormEvent<HTMLFormElement>, commentId: string, replyToId: string, replyToAuthor: string) => {
    e.preventDefault();
    const text = (replyDrafts[replyToId] ?? '').trim();
    if (!text) return;

    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      author: 'You',
      date: 'Just now',
      message: text,
      likes: 0,
      meLiked: false,
      avatar: '/theme/images/team/2.jpg',
      replyTo: replyToAuthor,
    };

    setComments((prev) =>
      prev.map((c) => c.id !== commentId ? c : { ...c, replies: [...c.replies, newReply] }),
    );
    setReplyDrafts((prev) => ({ ...prev, [replyToId]: '' }));
    setActiveReplyId(null);
  };

  const totalCount = comments.reduce((t, c) => t + 1 + c.replies.length, 0);

  return (
    <section id="comments" className={styles.section}>
      <h2 className={styles.heading}>{totalCount} comment{totalCount !== 1 ? 's' : ''}</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="project-comment">Comment</label>
        <textarea
          id="project-comment"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share your thoughts about this project..."
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
};
