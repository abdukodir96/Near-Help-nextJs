import { AgentDetailPageContent } from '@/components/agents/agent-detail-page';
import { getAgentBySlug } from '@/components/agents/agents-data';
import { notFound } from 'next/navigation';

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = getAgentBySlug(params.id);

  if (!agent) {
    notFound();
  }

  return <AgentDetailPageContent agent={agent} />;
}
