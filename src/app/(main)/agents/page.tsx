import {PagePlaceholder} from '@/components/shared/page-placeholder';

export default function AgentsPage() {
  return (
    <PagePlaceholder
      eyebrow="Agents"
      title="Agent listing route is ready."
      description="Next step here is wiring getAgents, sorting, follow status and agent cards to the backend."
      links={[{href: '/agents/preview-agent-id', label: 'Open detail placeholder'}]}
    />
  );
}
