import { AgentDetailPageContent } from '@/components/agents/agent-detail-page';

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return <AgentDetailPageContent slug={params.id} />;
}
