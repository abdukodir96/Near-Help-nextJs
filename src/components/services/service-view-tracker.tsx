'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { recordServiceView } from './service-interactions';

export const ServiceViewTracker = ({ slug }: { slug: string }) => {
  useEffect(() => {
    if (Cookies.get(ACCESS_TOKEN_KEY)) {
      recordServiceView(slug);
    }
  }, [slug]);

  return null;
};
