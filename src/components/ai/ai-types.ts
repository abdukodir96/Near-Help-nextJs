// ── Enums (must match backend exactly) ───────────────────────────────────────

export const SERVICE_CATEGORIES = [
  'PLUMBING',
  'GAS_LINE',
  'ELECTRICITY',
  'WATER_LINE',
  'BATHROOM_PLUMBING',
  'BASEMENT_PLUMBING',
  'REMODELING',
  'CLEANING',
] as const;

export const SERVICE_OPTIONS = ['STANDARD', 'PREMIUM', 'EMERGENCY'] as const;

export const SERVICE_LOCATIONS = [
  'SEOUL', 'BUSAN', 'INCHEON', 'DAEGU',
  'GYEONGJU', 'GWANGJU', 'JEONJU', 'DAEJON', 'JEJU',
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
export type ServiceOption   = typeof SERVICE_OPTIONS[number];
export type ServiceLocation = typeof SERVICE_LOCATIONS[number];

// ── Backend DTOs ──────────────────────────────────────────────────────────────

export type PriceEstimate = {
  estimatedMinPrice: number;
  estimatedMaxPrice: number;
  currency: string;
  confidence: number;
  summary: string;
  disclaimer: string;
};

export type ServiceItem = {
  _id: string;
  serviceCategory: ServiceCategory;
  serviceOption: ServiceOption;
  serviceTitle: string;
  servicePrice: number;
  serviceArea?: ServiceLocation;
  serviceAddress: string;
  serviceViews: number;
  serviceLikes: number;
  serviceStatus: string;
};

export type ServicesResult = {
  list: ServiceItem[];
  meta: { totalCount: number };
};

export type BookingAssistantResult = {
  priceEstimate: PriceEstimate;
  recommendedServices: ServicesResult;
  summary: string;
  nextAction: string;
};

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
