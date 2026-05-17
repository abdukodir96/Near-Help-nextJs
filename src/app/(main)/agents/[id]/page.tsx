import { AgentDetailPageContent } from '@/components/agents/agent-detail-page';
import { BackendAgentDetailPage } from '@/components/agents/backend-agent-detail-page';
import { getAgentBySlug } from '@/components/agents/agents-data';

const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (isMongoId(id)) {
    return <BackendAgentDetailPage memberId={id} />;
  }

  const agent = getAgentBySlug(id);
  if (!agent) return null;

  return <AgentDetailPageContent agent={agent} />;
}
