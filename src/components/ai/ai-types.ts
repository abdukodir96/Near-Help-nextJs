export type PriceEstimate = {
  minPrice: number;
  maxPrice: number;
  currency: string;
  reasoning: string;
  category: string;
};

export type ServiceResult = {
  serviceId: string;
  title: string;
  category: string;
  description?: string;
  reason?: string;
  score: number;
  priceLabel: string;
};

export type BookingAssistantResult = {
  priceEstimate: PriceEstimate;
  recommendations: ServiceResult[];
  summary: string;
};

export const SERVICE_CATEGORIES = [
  'PLUMBING',
  'ELECTRICAL',
  'GAS',
  'CLEANING',
  'RENOVATION',
  'HVAC',
  'PAINTING',
  'CARPENTRY',
  'ROOFING',
  'LANDSCAPING',
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

// ── AI Chat ───────────────────────────────────────────────────────────────────

export type AiChatSessionStatus = 'ACTIVE' | 'ARCHIVED';
export type AiChatMessageRole   = 'USER' | 'ASSISTANT';

export type AiChatSession = {
  _id: string;
  sessionStatus: AiChatSessionStatus;
  memberId: string;
  title?: string;
  lastMessageAt?: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AiChatMessage = {
  _id: string;
  sessionId: string;
  memberId: string;
  role: AiChatMessageRole;
  content: string;
  createdAt: string;
};

export type AiChatSendResult = {
  userMessage: AiChatMessage;
  assistantMessage: AiChatMessage;
};

export type AiChatSessionsResult = {
  list: AiChatSession[];
  meta: { totalCount: number };
};

export type AiChatMessagesResult = {
  list: AiChatMessage[];
  meta: { totalCount: number };
};
