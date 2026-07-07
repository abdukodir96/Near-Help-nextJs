import { PagePlaceholder } from '@/components/shared/page-placeholder';

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="NearHelp Admin"
      description="Manage users, services, blog moderation, and CS notices from one place."
      links={[
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/services', label: 'Services' },
        { href: '/admin/blog', label: 'Blog' },
        { href: '/admin/cs', label: 'CS' },
      ]}
    />
  );
}
