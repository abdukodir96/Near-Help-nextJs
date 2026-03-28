import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function ServiceDetailPage({params}: {params: {id: string}}) {
  return (
    <PagePlaceholder
      eyebrow="Service Detail"
      title={`Service detail placeholder: ${params.id}`}
      description="We will map this route to getService, booking CTA, like/favorite, reviews and message-thread creation."
      links={[{href: '/services', label: 'Back to services'}]}
    />
  );
}
