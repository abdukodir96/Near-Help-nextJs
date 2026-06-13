'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GET_SERVICE } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';
import { ServiceComments } from './service-comments';
import styles from './service-detail-page.module.scss';

type BackendService = {
  _id: string;
  serviceCategory: string;
  serviceOption: string;
  serviceAddress: string;
  serviceArea?: string;
  serviceTitle: string;
  servicePrice: number;
  serviceViews: number;
  serviceLikes: number;
  serviceComments: number;
  serviceImages?: string[];
  serviceDesc?: string;
  meLiked?: boolean;
  memberData?: { _id: string; memberNick: string; memberFullName?: string; memberImage?: string };
};

const getImageUrl = (images?: string[]) => {
  if (!images?.length) return '/theme/images/service/1.jpg';
  return getAssetUrl(images[0]) || '/theme/images/service/1.jpg';
};

const formatKRW = (price: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price);

export const ServiceDetailPageContent = ({ slug }: { slug: string }) => {
  const { data, loading, error } = useQuery<{ getService: BackendService }>(GET_SERVICE, {
    variables: { input: { serviceId: slug } },
  });

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !data?.getService) {
    notFound();
  }

  const service = data.getService;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Services / Detail</p>
          <h1>{service.serviceTitle}</h1>
          <p className={styles.lead}>{service.serviceDesc}</p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.layoutGrid}>
          <article className={styles.mainCard}>
            <div className={styles.imageWrap}>
              <Image
                src={getImageUrl(service.serviceImages)}
                alt={service.serviceTitle}
                width={960}
                height={620}
                className={styles.image}
              />
            </div>

            <div className={styles.copy}>
              <span className={styles.categoryPill}>{service.serviceCategory}</span>
              <h2>Service overview</h2>
              <p>{service.serviceDesc}</p>
              <p>
                NearHelp coordinates vetted specialists, transparent communication, and cleaner scheduling so homeowners
                can move from inquiry to confirmed service without the usual back-and-forth.
              </p>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailBlock}>
                <h3>Service details</h3>
                <ul>
                  <li>Category: {service.serviceCategory}</li>
                  <li>Option: {service.serviceOption}</li>
                  {service.serviceArea && <li>Area: {service.serviceArea}</li>}
                  <li>Address: {service.serviceAddress}</li>
                  <li>Views: {service.serviceViews}</li>
                  <li>Likes: {service.serviceLikes}</li>
                </ul>
              </div>
              <div className={styles.detailBlock}>
                <h3>Agent information</h3>
                <ul>
                  <li>Name: {service.memberData?.memberFullName || service.memberData?.memberNick || 'NearHelp Agent'}</li>
                  {service.memberData?._id && (
                    <li>
                      <Link href={`/agents/${service.memberData._id}`} style={{ color: '#0052da' }}>
                        View agent profile →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <ServiceComments serviceSlug={service._id} />
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Service price</p>
              <h3>{formatKRW(service.servicePrice)}</h3>
              <p className={styles.sideNote}>Final pricing is confirmed after scope review and scheduling priority.</p>
            </div>

            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Service option</p>
              <div className={styles.tagList}>
                <span className={styles.tag}>{service.serviceOption}</span>
              </div>
            </div>

            {service.serviceArea && (
              <div className={styles.sideCard}>
                <p className={styles.sideLabel}>Coverage area</p>
                <div className={styles.tagList}>
                  <span className={styles.tagMuted}>{service.serviceArea}</span>
                </div>
              </div>
            )}

            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Location</p>
              <h4>{service.serviceAddress}</h4>
              <Link prefetch={false} href={`/booking?service=${service._id}`} className={styles.ctaButton}>
                Book this service
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};
