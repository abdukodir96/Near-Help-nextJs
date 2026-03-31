import { PagePlaceholder } from '@/components/shared/page-placeholder';

export default function SignupPage() {
  return (
    <PagePlaceholder
      eyebrow="Auth"
      title="Signup page is ready for backend connection"
      description="We can now map signup inputs to NearHelp auth mutations and token flow."
      links={[{ href: '/auth/login', label: 'Open login' }, { href: '/', label: 'Back to home' }]}
    />
  );
}
