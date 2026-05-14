'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './project-detail-page.module.scss';

type Comment = {
  id: number;
  name: string;
  avatar: string;
  date: string;
  text: string;
};

const initialComments: Comment[] = [
  {
    id: 1,
    name: 'James Harrington',
    avatar: '/theme/images/team/2.jpg',
    date: 'April 12, 2025',
    text: 'Absolutely outstanding work! The team was professional from start to finish. The kitchen plumbing was done efficiently and the results exceeded our expectations.',
  },
  {
    id: 2,
    name: 'Sofia Müller',
    avatar: '/theme/images/team/3.jpg',
    date: 'March 28, 2025',
    text: 'Really impressed by the quality of this project. The attention to detail is remarkable and everything was completed on schedule. Highly recommend NearHelp!',
  },
  {
    id: 3,
    name: 'Kevin Park',
    avatar: '/theme/images/team/4.jpg',
    date: 'February 15, 2025',
    text: 'Great experience working with the team. They explained every step of the process and left the area spotless after finishing. Will definitely hire again.',
  },
];

export const ProjectComments = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      name: name.trim(),
      avatar: '/theme/images/team/2.jpg',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      text: text.trim(),
    };

    setComments((prev) => [newComment, ...prev]);
    setName('');
    setText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Comments ({comments.length})</h2>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.commentAvatarWrap}>
              <Image
                src={comment.avatar}
                alt={comment.name}
                fill
                sizes="48px"
                className={styles.commentAvatar}
              />
            </div>
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.commentName}>{comment.name}</span>
                <span className={styles.commentDate}>{comment.date}</span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.commentFormWrap}>
        <h3 className={styles.commentFormTitle}>Leave a Comment</h3>
        {submitted && (
          <p className={styles.commentSuccess}>Your comment has been posted!</p>
        )}
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.commentInput}
            required
          />
          <textarea
            placeholder="Write your comment here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.commentTextarea}
            rows={4}
            required
          />
          <button type="submit" className={styles.commentSubmitBtn}>
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};
