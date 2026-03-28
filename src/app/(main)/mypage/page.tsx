import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function MyPage() {
  return (
    <PagePlaceholder
      eyebrow="My Page"
      title="My Page dashboard route is ready."
      description="Next step is wiring profile, bookings, favorites, recent views, followers and agent-specific sections."
      links={[
        {href: '/mypage/bookings', label: 'Bookings'},
        {href: '/mypage/favorites', label: 'Favorites'},
        {href: '/mypage/recent', label: 'Recently visited'}
      ]}
    />
  );
}
