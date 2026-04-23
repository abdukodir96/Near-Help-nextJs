'use client';

import Cookies from 'js-cookie';
import { Check, UserPlus } from 'phosphor-react';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import styles from './agent-detail-page.module.scss';

export const AgentFollowButton = () => {
  const [following, setFollowing] = useState(false);

  const handleFollowClick = async () => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);

    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: "Please log in before following an agent.",
        confirmButtonColor: '#0052da',
        confirmButtonText: 'OK',
      });
      return;
    }

    const nextFollowing = !following;
    setFollowing(nextFollowing);

    await Swal.fire({
      icon: 'success',
      title: nextFollowing ? 'Followed successfully' : 'Unfollowed successfully',
      text: nextFollowing
        ? 'You are now following this agent.'
        : "This agent has been removed from your following list.",
      confirmButtonColor: '#0052da',
      confirmButtonText: 'OK',
      timer: 1800,
      timerProgressBar: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleFollowClick}
      className={following ? styles.followButtonActive : styles.followButton}
    >
      {following ? <Check size={18} weight="bold" /> : <UserPlus size={18} weight="bold" />}
      <span>{following ? 'Following' : 'Follow'}</span>
    </button>
  );
};
