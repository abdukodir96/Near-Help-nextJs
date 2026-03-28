import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function CsPage() {
  return (
    <PagePlaceholder
      eyebrow="Customer Support"
      title="CS hub route is ready."
      description="Notice and FAQ now have backend support. The next step is rendering those two filtered views here."
      links={[
        {href: '/cs/notice', label: 'Open notices'},
        {href: '/cs/faq', label: 'Open FAQ'}
      ]}
    />
  );
}
