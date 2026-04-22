'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Briefcase, Eye, HeartStraight, MapPin, Star, UsersThree } from 'phosphor-react';
import { serviceItems } from '@/components/services/services-data';
import type { AgentItem } from './agents-data';
import { AgentFollowButton } from './agent-follow-button';
import styles from './agent-detail-page.module.scss';

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

const formatCompactNumber = (value: number) => compactNumberFormatter.format(value);

export const AgentDetailPageContent = ({ agent }: { agent: AgentItem }) => {
  const relatedServices = agent.serviceSlugs
    .map((serviceSlug) => serviceItems.find((item) => item.slug === serviceSlug))
    .filter((service): service is (typeof serviceItems)[number] => Boolean(service));

  return (
    <main className={styles.page}>
      <section className={styles.profileSection}>
        <div className={styles.profileInner}>
          <div className={styles.profileGrid}>
            <div className={styles.portraitPanel}>
              <div className={styles.portraitFrame}>
                <div className={styles.portraitWrap}>
                  <Image src={agent.image} alt={agent.name} width={900} height={1120} className={styles.portrait} priority />
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
                <Link prefetch={false} href="/#booking" className={styles.bookButton}>
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
          </div>

          <div className={styles.reviewList}>
            {agent.reviews.map((review, index) => (
              <article key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.reviewStars}>
                    {Array.from({ length: review.rating }, (_, starIndex) => (
                      <Star key={`${review.id}-star-${starIndex}`} size={16} weight="fill" />
                    ))}
                  </div>
                </div>

                <p className={styles.reviewMessage}>{review.message}</p>

                <div className={styles.reviewMeta}>
                  <div className={styles.reviewAuthor}>
                    <div className={styles.reviewAvatarWrap}>
                      <Image
                        src={reviewAvatars[index % reviewAvatars.length]}
                        alt={review.author}
                        width={72}
                        height={72}
                        className={styles.reviewAvatar}
                      />
                    </div>
                    <div className={styles.reviewIdentity}>
                      <strong>{review.author}</strong>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
