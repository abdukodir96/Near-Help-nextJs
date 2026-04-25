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
