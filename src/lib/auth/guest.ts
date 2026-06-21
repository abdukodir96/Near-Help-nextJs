const GUEST_ID_KEY = 'nearhelp_guest_id';
const GUEST_AI_SESSION_KEY = 'nearhelp_guest_ai_session';

export const getOrCreateGuestId = (): string => {
  if (typeof window === 'undefined') return '';

  let guestId = window.localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};

export const getGuestAiSessionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(GUEST_AI_SESSION_KEY);
};

export const setGuestAiSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GUEST_AI_SESSION_KEY, sessionId);
};
