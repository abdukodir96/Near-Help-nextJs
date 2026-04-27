import { ArticleDetailPage } from '@/components/community/article-detail-page';

type Props = {
  params: { id: string };
};

export default function CommunityDetailPage({ params }: Props) {
  return <ArticleDetailPage articleId={params.id} />;
}
