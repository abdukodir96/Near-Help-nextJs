import { PagePlaceholder } from '@/components/shared/page-placeholder';

export default function CsPage() {
  return (
    <PagePlaceholder
      eyebrow="CS"
      title="Customer support hub"
      description="This page will direct users to notices and FAQ content from the backend."
      links={[{ href: '/cs/notice', label: 'Notice' }, { href: '/cs/faq', label: 'FAQ' }]}
    />
  );
}
