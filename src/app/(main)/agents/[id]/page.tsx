import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function AgentDetailPage({params}: {params: {id: string}}) {
  return (
    <PagePlaceholder
      eyebrow="Agent Detail"
      title={`Agent detail placeholder: ${params.id}`}
      description="We will map this route to getMember/getAgentServices, follow, messaging entry and portfolio sections."
      links={[{href: '/agents', label: 'Back to agents'}]}
    />
  );
}
