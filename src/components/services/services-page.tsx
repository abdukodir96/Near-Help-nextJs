import Image from 'next/image';
import Link from 'next/link';
import styles from './services-page.module.scss';

const serviceItems = [
  {
    slug: 'emergency-plumbing',
    image: '/theme/images/service/1.jpg',
    title: 'Emergency plumbing',
    category: 'PLUMBING',
    description:
      'Rapid response for burst pipes, severe leaks, blocked drains, and urgent water damage before things get worse.',
  },
  {
    slug: 'water-heater-support',
    image: '/theme/images/service/2.jpg',
    title: 'Water heater support',
    category: 'WATER_LINE',
    description:
      'Diagnostics, repair, replacement planning, and hot water recovery support for apartments and family homes.',
  },
  {
    slug: 'gas-line-services',
    image: '/theme/images/service/3.jpg',
    title: 'Gas line services',
    category: 'GAS_LINE',
    description:
      'Certified help for gas appliance hookup, safety checks, valve replacement, leak inspection, and line upgrades.',
  },
  {
    slug: 'electrical-repairs',
    image: '/theme/images/service/4.jpg',
    title: 'Electrical repairs',
    category: 'ELECTRICITY',
    description:
      'Fix switches, outlets, lighting issues, and urgent breaker faults with specialists who work clean and safely.',
  },
  {
    slug: 'bathroom-remodeling',
    image: '/theme/images/service/5.jpg',
    title: 'Bathroom remodeling',
    category: 'REMODELING',
    description:
      'Upgrade fixtures, tiling, layout, and finishes with coordinated bathroom refresh work from vetted crews.',
  },
  {
    slug: 'clean-up-services',
    image: '/theme/images/service/6.jpg',
    title: 'Clean-up services',
    category: 'CLEANING',
    description:
      'Post-repair, move-in, and post-renovation cleaning support so every job ends with a ready-to-use space.',
  },
  {
    slug: 'water-line-repair',
    image: '/theme/images/service/2.jpg',
    title: 'Water line repair',
    category: 'WATER_LINE',
    description:
      'Track down pressure issues, hidden pipe damage, and main line problems before they disrupt daily living.',
  },
  {
    slug: 'basement-plumbing',
    image: '/theme/images/service/5.jpg',
    title: 'Basement plumbing',
    category: 'BASEMENT_PLUMBING',
    description:
      'Sump pump, utility drains, moisture-prone pipework, and basement plumbing upgrades handled by trusted pros.',
  },
] as const;

export const ServicesPageContent = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Our Services</p>
          <h1>Best Service We Offer</h1>
          <p className={styles.lead}>
            Explore NearHelp&apos;s core home-service categories, from urgent repairs to clean-up and remodeling,
            all organized for faster booking and clearer comparison.
          </p>
        </div>
      </section>

      <section className={styles.serviceSection}>
        <div className={styles.serviceGrid}>
          {serviceItems.map((service) => (
            <article key={service.slug} className={styles.serviceCard}>
              <div className={styles.serviceImageWrap}>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={560}
                  height={420}
                  className={styles.serviceImage}
                />
              </div>

              <div className={styles.serviceBody}>
                <span className={styles.categoryPill}>{service.category.replaceAll('_', ' ')}</span>
                <h2>
                  <Link prefetch={false} href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h2>
                <p>{service.description}</p>
                <Link prefetch={false} href={`/services/${service.slug}`} className={styles.inlineLink}>
                  Read more
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
