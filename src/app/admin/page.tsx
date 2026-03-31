import { PagePlaceholder } from '@/components/shared/page-placeholder';

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Admin dashboard shell is ready"
      description="Next we can connect moderation counters, users, services, community and CS tables."
      links={[{ href: '/admin/users', label: 'Users' }, { href: '/admin/services', label: 'Services' }]}
    />
  );
}
