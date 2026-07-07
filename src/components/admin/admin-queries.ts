import { gql } from '@apollo/client';

// ── Members ───────────────────────────────────────────────────────────────────

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: GetAllMembersByAdminInput) {
    getAllMembersByAdmin(input: $input) {
      list {
        _id
        memberType
        memberStatus
        memberNick
        memberFullName
        memberPhone
        memberEmail
        memberImage
        memberServices
        memberArticles
        memberWarnings
        memberBlocks
        createdAt
      }
      meta { totalCount }
    }
  }
`;

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: UpdateMemberByAdminInput!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberType
      memberStatus
    }
  }
`;

// ── Services ──────────────────────────────────────────────────────────────────

export const GET_ALL_SERVICES_BY_ADMIN = gql`
  query GetAllServicesByAdmin($input: GetAllServicesByAdminInput) {
    getAllServicesByAdmin(input: $input) {
      list {
        _id
        serviceCategory
        serviceOption
        serviceStatus
        serviceTitle
        servicePrice
        serviceArea
        serviceAddress
        serviceViews
        serviceLikes
        memberId
        createdAt
      }
      meta { totalCount }
    }
  }
`;

export const UPDATE_SERVICE_BY_ADMIN = gql`
  mutation UpdateServiceByAdmin($input: UpdateServiceByAdminInput!) {
    updateServiceByAdmin(input: $input) {
      _id
      serviceStatus
    }
  }
`;

export const REMOVE_SERVICE_BY_ADMIN = gql`
  mutation RemoveServiceByAdmin($input: RemoveServiceByAdminInput!) {
    removeServiceByAdmin(input: $input) {
      _id
    }
  }
`;

// ── Articles ──────────────────────────────────────────────────────────────────

export const GET_ALL_ARTICLES_BY_ADMIN = gql`
  query GetAllArticlesByAdmin($input: AllArticlesInquiry!) {
    getAllArticlesByAdmin(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleViews
        articleLikes
        memberId
        createdAt
      }
      meta { totalCount }
    }
  }
`;

export const UPDATE_ARTICLE_BY_ADMIN = gql`
  mutation UpdateArticleByAdmin($input: UpdateArticleByAdminInput!) {
    updateArticleByAdmin(input: $input) {
      _id
      articleStatus
    }
  }
`;

export const REMOVE_ARTICLE_BY_ADMIN = gql`
  mutation RemoveArticleByAdmin($input: RemoveArticleByAdminInput!) {
    removeArticleByAdmin(input: $input) {
      _id
    }
  }
`;

// ── Notices ───────────────────────────────────────────────────────────────────

export const GET_ALL_NOTICES_BY_ADMIN = gql`
  query GetAllNoticesByAdmin($input: AllNoticesInquiry!) {
    getAllNoticesByAdmin(input: $input) {
      list {
        _id
        noticeCategory
        noticeStatus
        noticeTitle
        noticeContent
        createdAt
        updatedAt
      }
      meta { totalCount }
    }
  }
`;

export const CREATE_NOTICE = gql`
  mutation CreateNotice($input: NoticeInput!) {
    createNotice(input: $input) {
      _id
    }
  }
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
  mutation UpdateNoticeByAdmin($input: UpdateNoticeByAdminInput!) {
    updateNoticeByAdmin(input: $input) {
      _id
      noticeStatus
    }
  }
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
  mutation RemoveNoticeByAdmin($input: RemoveNoticeByAdminInput!) {
    removeNoticeByAdmin(input: $input) {
      _id
    }
  }
`;
