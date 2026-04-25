import { gql } from '@apollo/client';

// ── Price Estimation ─────────────────────────────────────────────────────────

export const ESTIMATE_PRICE = gql`
  mutation EstimatePrice($input: PriceEstimateInput!) {
    estimatePrice(input: $input) {
      minPrice
      maxPrice
      currency
      reasoning
      category
    }
  }
`;

// ── Semantic Search ───────────────────────────────────────────────────────────

export const SEMANTIC_SEARCH = gql`
  mutation SemanticSearch($input: SemanticSearchInput!) {
    semanticSearch(input: $input) {
      serviceId
      title
      category
      description
      score
      priceLabel
    }
  }
`;

// ── Recommendations ───────────────────────────────────────────────────────────

export const GET_RECOMMENDATIONS = gql`
  mutation GetRecommendations($input: RecommendationInput!) {
    getRecommendations(input: $input) {
      serviceId
      title
      category
      reason
      score
      priceLabel
    }
  }
`;

// ── Booking Assistant (price + recommendations combined) ──────────────────────

export const BOOKING_ASSISTANT = gql`
  mutation BookingAssistant($input: BookingAssistantInput!) {
    bookingAssistant(input: $input) {
      priceEstimate {
        minPrice
        maxPrice
        currency
        reasoning
      }
      recommendations {
        serviceId
        title
        category
        reason
        score
        priceLabel
      }
      summary
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
