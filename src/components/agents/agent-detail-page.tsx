import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAgentBySlug } from './agents-data';
import styles from './agent-detail-page.module.scss';

export const AgentDetailPageContent = ({ slug }: { slug: string }) => {
  const agent = getAgentBySlug(slug);

  if (!agent) {
    notFound();
  }

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
    </main>
  );
};
