import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function ServicesPage() {
  return (
    <PagePlaceholder
      eyebrow="Services"
      title="Service listing route is ready."
      description="Next step here is connecting getServices, semantic search, filters, sorting and pagination from the NearHelp backend."
      links={[{href: '/services/preview-service-id', label: 'Open detail placeholder'}]}
    />
  );
}
