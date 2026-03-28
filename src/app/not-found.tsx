import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function NotFound() {
  return (
    <PagePlaceholder
      eyebrow="404"
      title="Page not found"
      description="This route is not mapped inside the new NearHelp frontend foundation yet."
      links={[{href: '/', label: 'Back to home'}]}
    />
  );
}
