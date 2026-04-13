'use client';

import { useEffect } from 'react';
import { recordServiceView } from './service-interactions';

export const ServiceViewTracker = ({ slug }: { slug: string }) => {
  useEffect(() => {
    recordServiceView(slug);
  }, [slug]);

  return null;
};
