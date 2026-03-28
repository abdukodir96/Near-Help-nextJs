import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function NoticePage() {
  return (
    <PagePlaceholder
      eyebrow="CS Notice"
      title="Notice list route is ready."
      description="We will connect this route to getNotices with noticeCategory=NOTICE and render admin-managed announcements."
    />
  );
}
