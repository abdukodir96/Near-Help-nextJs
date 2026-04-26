import { projectItems } from '@/components/projects/projects-data';
import { ProjectDetailPage } from '@/components/projects/project-detail-page';

export function generateStaticParams() {
  return projectItems.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetailRoute({ params }: { params: { slug: string } }) {
  return <ProjectDetailPage slug={params.slug} />;
}
