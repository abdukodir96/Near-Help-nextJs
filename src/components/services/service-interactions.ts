const VIEWED_SERVICES_KEY = 'nearhelp:viewed-services';
const LIKED_SERVICES_KEY = 'nearhelp:liked-services';

type StoredLookup = Record<string, true>;

const readLookup = (key: string): StoredLookup => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored) as StoredLookup;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeLookup = (key: string, value: StoredLookup) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getViewedServices = () => readLookup(VIEWED_SERVICES_KEY);
export const getLikedServices = () => readLookup(LIKED_SERVICES_KEY);

export const recordServiceView = (slug: string) => {
  const viewed = readLookup(VIEWED_SERVICES_KEY);
  if (viewed[slug]) {
    return false;
  }

  viewed[slug] = true;
  writeLookup(VIEWED_SERVICES_KEY, viewed);
  return true;
};

export const recordServiceLike = (slug: string) => {
  const liked = readLookup(LIKED_SERVICES_KEY);
  if (liked[slug]) {
    return false;
  }

  liked[slug] = true;
  writeLookup(LIKED_SERVICES_KEY, liked);
  return true;
};
