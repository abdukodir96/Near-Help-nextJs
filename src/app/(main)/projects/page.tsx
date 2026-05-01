import Image from 'next/image';
import Link from 'next/link';
import { projectItems } from '@/components/projects/projects-data';
import styles from './projects-page.module.scss';

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Our Projects</p>
        <h1 className={styles.heading}>Recent Work by Our Top Agents</h1>

        <div className={styles.grid}>
          {projectItems.map((item) => (
            <Link key={item.slug} href={`/projects/${item.slug}`} prefetch={false} className={styles.cardLink}>
              <article className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" className={styles.cardImg} />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.category}>{item.category}</span>
                  <h2 className={styles.title}>{item.title}</h2>
                  <p className={styles.meta}>{item.clientName} · {item.date}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
