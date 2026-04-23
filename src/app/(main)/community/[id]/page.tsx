import { notFound } from 'next/navigation';
import { CommunityDetailPageContent } from '@/components/community/community-detail-page';
import { communityPosts } from '@/components/community/community-data';

type CommunityDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return communityPosts.map((post) => ({ id: post.id }));
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const post = communityPosts.find((item) => item.id === params.id);

  if (!post) {
    notFound();
  }

  return <CommunityDetailPageContent post={post} />;
}
