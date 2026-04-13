import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serviceItems } from './services-data';
import styles from './service-detail-page.module.scss';

export const ServiceDetailPageContent = ({ slug }: { slug: string }) => {
  const service = serviceItems.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Services / Detail</p>
          <h1>{service.title}</h1>
          <p className={styles.lead}>{service.lead}</p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.layoutGrid}>
          <article className={styles.mainCard}>
            <div className={styles.imageWrap}>
              <Image src={service.image} alt={service.title} width={960} height={620} className={styles.image} />
            </div>

            <div className={styles.copy}>
              <span className={styles.categoryPill}>{service.category}</span>
              <h2>Service overview</h2>
              <p>{service.description}</p>
              <p>
                NearHelp coordinates vetted specialists, transparent communication, and cleaner scheduling so homeowners
                can move from inquiry to confirmed service without the usual back-and-forth.
              </p>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailBlock}>
                <h3>What this service helps with</h3>
                <ul>
                  {service.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.detailBlock}>
                <h3>What you can expect</h3>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Estimated price range</p>
              <h3>{service.priceLabel}</h3>
              <p className={styles.sideNote}>Final pricing is confirmed after scope review and scheduling priority.</p>
            </div>

            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Available service options</p>
              <div className={styles.tagList}>
                {service.options.map((option) => (
                  <span key={option} className={styles.tag}>
                    {option}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Coverage locations</p>
              <div className={styles.tagList}>
                {service.locations.map((location) => (
                  <span key={location} className={styles.tagMuted}>
                    {location}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Response timing</p>
              <h4>{service.responseTime}</h4>
              <Link prefetch={false} href="/#booking" className={styles.ctaButton}>
                Book this service
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};
