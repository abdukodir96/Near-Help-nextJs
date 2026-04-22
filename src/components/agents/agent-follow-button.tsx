'use client';

import { Check, UserPlus } from 'phosphor-react';
import { useState } from 'react';
import styles from './agent-detail-page.module.scss';

export const AgentFollowButton = () => {
  const [following, setFollowing] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFollowing((prev) => !prev)}
      className={following ? styles.followButtonActive : styles.followButton}
    >
      {following ? <Check size={18} weight="bold" /> : <UserPlus size={18} weight="bold" />}
      <span>{following ? 'Following' : 'Follow'}</span>
    </button>
  );
};
