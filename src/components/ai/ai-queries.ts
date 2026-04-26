import { gql } from '@apollo/client';

const SERVICE_FIELDS = gql`
  fragment ServiceFields on Service {
    _id
    serviceCategory
    serviceOption
    serviceTitle
    servicePrice
    serviceArea
    serviceAddress
    serviceViews
    serviceLikes
    serviceStatus
  }
`;

// ── Price Estimation ─────────────────────────────────────────────────────────

export const ESTIMATE_PRICE = gql`
  query EstimateServicePrice($input: EstimateServicePriceInput!) {
    estimateServicePrice(input: $input) {
      estimatedMinPrice
      estimatedMaxPrice
      currency
      confidence
      summary
      disclaimer
    }
  }
`;

// ── Semantic Search ───────────────────────────────────────────────────────────

export const SEMANTIC_SEARCH = gql`
  ${SERVICE_FIELDS}
  query SemanticSearchServices($input: SemanticSearchServicesInput!) {
    semanticSearchServices(input: $input) {
      list { ...ServiceFields }
      meta { totalCount }
    }
  }
`;

// ── Recommendations ───────────────────────────────────────────────────────────

export const GET_RECOMMENDATIONS = gql`
  ${SERVICE_FIELDS}
  query RecommendServices($input: RecommendServicesInput!) {
    recommendServices(input: $input) {
      list { ...ServiceFields }
      meta { totalCount }
    }
  }
`;

// ── Booking Assistant ─────────────────────────────────────────────────────────

export const BOOKING_ASSISTANT = gql`
  ${SERVICE_FIELDS}
  query RecommendAndEstimateServices($input: RecommendAndEstimateServicesInput!) {
    recommendAndEstimateServices(input: $input) {
      priceEstimate {
        estimatedMinPrice
        estimatedMaxPrice
        currency
        confidence
        summary
        disclaimer
      }
      recommendedServices {
        list { ...ServiceFields }
        meta { totalCount }
      }
      summary
      nextAction
    }
  }
`;

// ── AI Chat ───────────────────────────────────────────────────────────────────

export const CREATE_AI_CHAT_SESSION = gql`
  mutation CreateAiChatSession($input: CreateAiChatSessionInput) {
    createAiChatSession(input: $input) {
      _id
      title
      messageCount
      createdAt
    }
  }
`;

export const SEND_AI_CHAT_MESSAGE = gql`
  mutation SendAiChatMessage($input: SendAiChatMessageInput!) {
    sendAiChatMessage(input: $input) {
      userMessage      { _id role content createdAt }
      assistantMessage { _id role content createdAt }
    }
  }
`;

export const GET_AI_CHAT_SESSIONS = gql`
  query GetAiChatSessions {
    getAiChatSessions {
      list {
        _id
        title
        messageCount
        lastMessageAt
        createdAt
      }
      meta { totalCount }
    }
  }
`;

export const GET_AI_CHAT_MESSAGES = gql`
  query GetAiChatMessages($input: GetAiChatMessagesInput!) {
    getAiChatMessages(input: $input) {
      list { _id role content createdAt }
      meta { totalCount }
    }
  }
`;
