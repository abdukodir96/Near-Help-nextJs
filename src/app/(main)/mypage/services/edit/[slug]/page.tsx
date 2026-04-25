import { MyServiceForm } from '@/components/mypage/my-service-form';

export default function EditServicePage({ params }: { params: { slug: string } }) {
  return <MyServiceForm slug={params.slug} />;
}
