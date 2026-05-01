import { ArticleDetailPage } from '@/components/blog/article-detail-page';

type Props = {
  params: { id: string };
};

export default function CommunityDetailPage({ params }: Props) {
  return <ArticleDetailPage articleId={params.id} />;
}
