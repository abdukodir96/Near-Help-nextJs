import { ServiceDetailPageContent } from '@/components/services/service-detail-page';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  return <ServiceDetailPageContent slug={params.id} />;
}
