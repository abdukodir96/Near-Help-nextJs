import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectItems } from './projects-data';
import { NewsletterWidget } from './newsletter-widget';
import { ProjectComments } from './project-comments';
import styles from './project-detail-page.module.scss';

const processIcons = ['💡', '🏆', '⚙️'];

const allServices = [
  'Kitchen Plumbing',
  'Gas Line Services',
  'Water Line Repair',
  'Bathroom Plumbing',
  'Basement Plumbing',
  'Remodeling Service',
];

const instagramImages = [
  '/theme/images/projects/img-1.jpg',
  '/theme/images/projects/img-2.jpg',
  '/theme/images/projects/img-3.jpg',
  '/theme/images/projects/img-7.jpg',
  '/theme/images/projects/img-8.jpg',
  '/theme/images/projects/img-9.jpg',
];

export const ProjectDetailPage = ({ slug }: { slug: string }) => {
  const project = projectItems.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Main content ── */}
        <div className={styles.main}>
          {/* Hero image */}
          <div className={styles.heroWrap}>
            <Image src={project.image} alt={project.title} fill sizes="(max-width:1024px) 100vw, 65vw" className={styles.heroImage} priority />
          </div>

          {/* Info banner */}
          <div className={styles.infoBanner}>
            <div className={styles.infoItem}>
              <p>Client Name</p>
              <strong>{project.clientName}</strong>
            </div>
            <div className={styles.infoItem}>
              <p>Project Value</p>
              <strong>{project.projectValue}</strong>
            </div>
            <div className={styles.infoItem}>
              <p>Date</p>
              <strong>{project.date}</strong>
            </div>
          </div>

          {/* Title & description */}
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.desc}>{project.description}</p>
          <p className={styles.desc}>{project.description2}</p>

          {/* Gallery */}
          <div className={styles.gallery}>
            {project.galleryImages.map((src, i) => (
              <div key={i} className={styles.galleryImgWrap}>
                <Image src={src} alt={`${project.title} ${i + 1}`} fill sizes="(max-width:600px) 100vw, 45vw" className={styles.galleryImg} />
              </div>
            ))}
          </div>

          {/* Work process */}
          <h2 className={styles.sectionTitle}>Our work process</h2>
          <div className={styles.processGrid}>
            {project.workProcess.map((step, i) => (
              <div key={step.title} className={styles.processCard}>
                <span className={styles.processIcon}>{processIcons[i]}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <h2 className={styles.sectionTitle}>Benefits</h2>
          <div className={styles.benefitList}>
            {project.benefits.map((b) => (
              <div key={b} className={styles.benefitItem}>{b}</div>
            ))}
          </div>

          {/* Comments */}
          <ProjectComments />
        </div>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          {/* All Services */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetTitle}>All Services</div>
            <div className={styles.servicesList}>
              {allServices.map((s) => (
                <Link key={s} href="/services" className={styles.serviceLink}>{s}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetTitle}>Newsletter</div>
            <NewsletterWidget />
          </div>

          {/* Instagram */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetTitle}>Instagram Shot</div>
            <div className={styles.instagramGrid}>
              {instagramImages.map((src, i) => (
                <Image key={i} src={src} alt={`instagram ${i + 1}`} width={90} height={90} className={styles.instagramImg} />
              ))}
            </div>
          </div>

          {/* Help card */}
          <div className={styles.helpCard}>
            <h3 className={styles.helpTitle}>How We Can Help You!</h3>
            <p className={styles.helpDesc}>
              labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
              Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
            <Link href="/contact" className={styles.helpBtn}>
              Contact Us →
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
};
