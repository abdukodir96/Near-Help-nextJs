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
