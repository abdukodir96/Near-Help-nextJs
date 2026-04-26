import Image from 'next/image';
import Link from 'next/link';
import { projectItems } from '@/components/projects/projects-data';

export default function ProjectsPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh', padding: '72px 24px 96px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ color: '#0052da', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: 12 }}>
          Our Projects
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, color: '#1a202c', letterSpacing: '-0.04em', margin: '0 0 48px' }}>
          Recent Work by Our Top Agents
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
          {projectItems.map((item) => (
            <Link key={item.slug} href={`/projects/${item.slug}`} prefetch={false} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(0,0,0,0.14)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px 24px 24px', background: '#fff' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0052da', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</span>
                  <h2 style={{ margin: '8px 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#1a202c' }}>{item.title}</h2>
                  <p style={{ margin: '10px 0 0', fontSize: '0.88rem', color: '#6b7280' }}>{item.clientName} · {item.date}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
