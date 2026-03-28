import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function CommunityPage() {
  return (
    <PagePlaceholder
      eyebrow="Community"
      title="Community route is ready."
      description="Next step here is connecting getArticles, category tabs, article cards and search behavior."
      links={[{href: '/community/preview-article-id', label: 'Open article placeholder'}]}
    />
  );
}
