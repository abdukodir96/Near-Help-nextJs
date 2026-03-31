import { PagePlaceholder } from '@/components/shared/page-placeholder';

export default function LoginPage() {
  return (
    <PagePlaceholder
      eyebrow="Auth"
      title="Login page is ready for backend connection"
      description="Next step here is wiring GraphQL login mutation, token storage and redirect flow."
      links={[{ href: '/auth/signup', label: 'Open signup' }, { href: '/', label: 'Back to home' }]}
    />
  );
}
