import { gql } from '@apollo/client';

// ── Fragments ────────────────────────────────────────────────────────────────

export const MEMBER_FIELDS = gql`
  fragment MemberFields on Member {
    _id
    memberType
    memberStatus
    memberNick
    memberFullName
    memberImage
    memberAddress
    memberDesc
    memberServices
    memberArticles
    memberFollowers
    memberFollowings
    memberPoints
    memberLikes
    memberViews
    memberComments
    memberRank
    meFollowed
    createdAt
  }
`;

export const SERVICE_FIELDS = gql`
  fragment ServiceFields on Service {
    _id
    serviceCategory
    serviceStatus
    serviceOption
    serviceAddress
    serviceArea
    serviceTitle
    servicePrice
    serviceViews
    serviceLikes
    serviceComments
    serviceImages
    serviceDesc
    memberId
    meLiked
    createdAt
    updatedAt
    memberData {
      _id
      memberNick
      memberFullName
      memberImage
    }
  }
`;

export const ARTICLE_FIELDS = gql`
  fragment ArticleFields on Article {
    _id
    articleCategory
    articleStatus
    articleTitle
    articleContent
    articleImage
    articleViews
    articleLikes
    articleComments
    memberId
    meLiked
    createdAt
    updatedAt
    memberData {
      _id
      memberNick
      memberFullName
      memberImage
    }
  }
`;

export const COMMENT_FIELDS = gql`
  fragment CommentFields on Comment {
    _id
    commentStatus
    commentGroup
    commentContent
    commentRefId
    memberId
    parentCommentId
    depth
    repliesCount
    commentLikes
    meLiked
    createdAt
    updatedAt
    memberData {
      _id
      memberNick
      memberFullName
      memberImage
    }
  }
`;

// ── Auth ─────────────────────────────────────────────────────────────────────

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      member {
        _id
        memberNick
        memberFullName
        memberImage
        memberType
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
      accessToken
      refreshToken
      member {
        _id
        memberNick
        memberFullName
        memberType
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      message
    }
  }
`;

export const GET_ME = gql`
  ${MEMBER_FIELDS}
  query GetMe {
    getMember {
      ...MemberFields
      memberPhone
      memberEmail
    }
  }
`;

// ── Services ─────────────────────────────────────────────────────────────────

export const GET_SERVICES = gql`
  query GetServices($input: GetServicesInput) {
    getServices(input: $input) {
      list {
        _id
        serviceCategory
        serviceStatus
        serviceOption
        serviceAddress
        serviceArea
        serviceTitle
        servicePrice
        serviceViews
        serviceLikes
        serviceComments
        serviceImages
        serviceDesc
        memberId
        meLiked
        createdAt
        updatedAt
        memberData {
          _id
          memberNick
          memberFullName
          memberImage
        }
      }
      meta { totalCount page }
    }
  }
`;

export const GET_SERVICE = gql`
  query GetService($input: GetServiceInput!) {
    getService(input: $input) {
      _id serviceCategory serviceStatus serviceOption serviceAddress serviceArea
      serviceTitle servicePrice serviceViews serviceLikes serviceComments
      serviceImages serviceDesc memberId meLiked createdAt updatedAt
      memberData { _id memberNick memberFullName memberImage }
    }
  }
`;

export const GET_AGENT_SERVICES = gql`
  query GetAgentServices($input: GetAgentServicesInput!) {
    getAgentServices(input: $input) {
      list {
        _id serviceCategory serviceStatus serviceOption serviceAddress serviceArea
        serviceTitle servicePrice serviceViews serviceLikes serviceComments
        serviceImages serviceDesc memberId meLiked createdAt updatedAt
        memberData { _id memberNick memberFullName memberImage }
      }
      meta { totalCount page }
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      _id serviceTitle serviceCategory servicePrice serviceStatus
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      _id serviceTitle serviceCategory servicePrice serviceStatus
    }
  }
`;

export const LIKE_SERVICE = gql`
  mutation LikeTargetService($input: LikeTargetServiceInput!) {
    likeTargetService(input: $input) {
      likeRefId
      myFavorite
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($input: GetFavoritesInput) {
    getFavorites(input: $input) {
      list {
        _id serviceCategory serviceOption serviceArea serviceTitle servicePrice
        serviceViews serviceLikes serviceImages serviceDesc meLiked
        memberData { _id memberNick memberFullName memberImage }
      }
      meta { totalCount page }
    }
  }
`;

export const GET_VISITED = gql`
  query GetVisited($input: GetVisitedInput) {
    getVisited(input: $input) {
      list {
        _id serviceCategory serviceOption serviceArea serviceTitle servicePrice
        serviceViews serviceLikes serviceImages serviceDesc meLiked
        memberData { _id memberNick memberFullName memberImage }
      }
      meta { totalCount page }
    }
  }
`;

// ── Agents ────────────────────────────────────────────────────────────────────

export const GET_AGENTS = gql`
  query GetAgents($input: GetAgentsInput) {
    getAgents(input: $input) {
      list {
        _id memberType memberStatus memberNick memberFullName memberImage
        memberAddress memberDesc memberServices memberArticles memberFollowers
        memberFollowings memberPoints memberLikes memberViews memberComments
        memberRank meFollowed createdAt
      }
      meta { totalCount }
    }
  }
`;

export const GET_MEMBER = gql`
  query GetMember($input: GetMemberInput) {
    getMember(input: $input) {
      _id memberType memberStatus memberNick memberFullName memberImage
      memberAddress memberDesc memberServices memberArticles memberFollowers
      memberFollowings memberPoints memberLikes memberViews memberComments
      memberRank meFollowed createdAt
    }
  }
`;

export const LIKE_MEMBER = gql`
  mutation LikeTargetMember($input: LikeTargetMemberInput!) {
    likeTargetMember(input: $input) {
      likeRefId
      myFavorite
    }
  }
`;

export const TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($input: ToggleFollowInput!) {
    toggleFollow(input: $input) {
      followingId
      myFollowing
    }
  }
`;

export const GET_FOLLOWERS = gql`
  ${MEMBER_FIELDS}
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        followingId
        followerData { ...MemberFields }
      }
      metaCounter { total }
    }
  }
`;

export const GET_FOLLOWINGS = gql`
  ${MEMBER_FIELDS}
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        followerId
        followingData { ...MemberFields }
      }
      metaCounter { total }
    }
  }
`;

// ── Articles ─────────────────────────────────────────────────────────────────

export const GET_ARTICLES = gql`
  query GetArticles($input: ArticlesInquiry!) {
    getArticles(input: $input) {
      list {
        _id articleCategory articleStatus articleTitle articleContent
        articleImage articleViews articleLikes articleComments memberId
        meLiked createdAt updatedAt
        memberData { _id memberNick memberFullName memberImage }
      }
      metaCounter { total }
    }
  }
`;

export const GET_ARTICLE = gql`
  query GetArticle($input: GetArticleInput!) {
    getArticle(input: $input) {
      _id articleCategory articleStatus articleTitle articleContent
      articleImage articleViews articleLikes articleComments memberId
      meLiked createdAt updatedAt
      memberData { _id memberNick memberFullName memberImage }
    }
  }
`;

export const LIKE_ARTICLE = gql`
  mutation LikeTargetArticle($input: LikeTargetArticleInput!) {
    likeTargetArticle(input: $input) {
      likeRefId
      myFavorite
    }
  }
`;

// ── Comments ─────────────────────────────────────────────────────────────────

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id commentStatus commentGroup commentContent commentRefId memberId
        parentCommentId depth repliesCount commentLikes meLiked createdAt updatedAt
        memberData { _id memberNick memberFullName memberImage }
      }
      metaCounter { total }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
      commentContent
      commentGroup
      commentRefId
    }
  }
`;

export const CREATE_REPLY = gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      _id
      commentContent
      parentCommentId
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeTargetComment($input: LikeTargetCommentInput!) {
    likeTargetComment(input: $input) {
      likeRefId
      myFavorite
    }
  }
`;

// ── Bookings ─────────────────────────────────────────────────────────────────

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      _id
      bookingStatus
      serviceCategory
      serviceOption
      serviceTitleSnapshot
      bookingDate
      bookingAddress
      quotedPrice
      createdAt
    }
  }
`;

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings($input: BookingsInquiry) {
    getMyBookings(input: $input) {
      list {
        _id
        bookingStatus
        serviceCategory
        serviceOption
        serviceTitleSnapshot
        bookingDate
        bookingTime
        bookingAddress
        quotedPrice
        finalPrice
        createdAt
        agentData {
          _id
          memberNick
          memberFullName
          memberImage
        }
        serviceData {
          _id
          serviceTitle
          serviceImages
        }
      }
      metaCounter { total }
    }
  }
`;

// ── Notifications ─────────────────────────────────────────────────────────────

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($input: NotificationsInquiry) {
    getNotifications(input: $input) {
      list {
        _id
        notificationStatus
        notificationGroup
        notificationTitle
        notificationDesc
        authorId
        receiverId
        createdAt
        authorData {
          _id
          memberNick
          memberImage
        }
      }
      metaCounter { total }
    }
  }
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    getUnreadNotificationCount
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      modifiedCount
    }
  }
`;

// ── Upload ────────────────────────────────────────────────────────────────────

export const UPLOAD_IMAGE = gql`
  mutation UploadSingleImage($file: Upload!) {
    uploadSingleImage(file: $file) {
      url
      filename
    }
  }
`;

export const UPLOAD_IMAGES = gql`
  mutation UploadMultipleImages($files: [Upload!]!) {
    uploadMultipleImages(files: $files) {
      url
      filename
    }
  }
`;
