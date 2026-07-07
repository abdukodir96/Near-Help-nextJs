// ── Members ───────────────────────────────────────────────────────────────────

export type MemberType = 'USER' | 'AGENT' | 'ADMIN';
export type MemberStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export type AdminMember = {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberFullName?: string;
  memberPhone?: string;
  memberEmail?: string;
  memberImage: string;
  memberServices: number;
  memberArticles: number;
  memberWarnings: number;
  memberBlocks: number;
  createdAt: string;
};

export type MembersByAdminResult = {
  list: AdminMember[];
  meta: { totalCount: number };
};

// ── Services ──────────────────────────────────────────────────────────────────

export type ServiceCategory =
  | 'PLUMBING' | 'GAS_LINE' | 'ELECTRICITY' | 'WATER_LINE'
  | 'BATHROOM_PLUMBING' | 'BASEMENT_PLUMBING' | 'REMODELING' | 'CLEANING';
export type ServiceOption = 'STANDARD' | 'PREMIUM' | 'EMERGENCY';
export type ServiceStatus = 'HOLD' | 'ACTIVE' | 'REJECTED' | 'DELETED';
export type ServiceLocation =
  | 'SEOUL' | 'BUSAN' | 'INCHEON' | 'DAEGU'
  | 'GYEONGJU' | 'GWANGJU' | 'JEONJU' | 'DAEJON' | 'JEJU';

export type AdminService = {
  _id: string;
  serviceCategory: ServiceCategory;
  serviceOption: ServiceOption;
  serviceStatus: ServiceStatus;
  serviceTitle: string;
  servicePrice: number;
  serviceArea?: ServiceLocation;
  serviceAddress: string;
  serviceViews: number;
  serviceLikes: number;
  memberId: string;
  createdAt: string;
};

export type ServicesByAdminResult = {
  list: AdminService[];
  meta: { totalCount: number };
};

// ── Articles ──────────────────────────────────────────────────────────────────

export type ArticleCategory = 'FREE' | 'RECOMMEND' | 'NEWS' | 'HUMOR';
export type ArticleStatus = 'ACTIVE' | 'DELETED';

export type AdminArticle = {
  _id: string;
  articleCategory: ArticleCategory;
  articleStatus: ArticleStatus;
  articleTitle: string;
  articleViews: number;
  articleLikes: number;
  memberId: string;
  createdAt: string;
};

export type ArticlesByAdminResult = {
  list: AdminArticle[];
  meta: { totalCount: number };
};

// ── Notices ───────────────────────────────────────────────────────────────────

export type NoticeCategory = 'NOTICE' | 'FAQ';
export type NoticeStatus = 'HOLD' | 'ACTIVE' | 'DELETED';

export type AdminNotice = {
  _id: string;
  noticeCategory: NoticeCategory;
  noticeStatus: NoticeStatus;
  noticeTitle: string;
  noticeContent: string;
  createdAt: string;
  updatedAt: string;
};

export type NoticesByAdminResult = {
  list: AdminNotice[];
  meta: { totalCount: number };
};
