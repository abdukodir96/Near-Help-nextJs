import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function CommunityDetailPage({params}: {params: {id: string}}) {
  return (
    <PagePlaceholder
      eyebrow="Article Detail"
      title={`Community article placeholder: ${params.id}`}
      description="We will map this route to getArticle, comments, replies, likes and author info."
      links={[{href: '/community', label: 'Back to community'}]}
    />
  );
}
