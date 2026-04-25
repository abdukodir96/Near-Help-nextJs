import { gql } from '@apollo/client';

// ── Fragments ────────────────────────────────────────────────────────────────

const MESSAGE_FIELDS = gql`
  fragment MessageFields on Message {
    _id
    messageType
    messageStatus
    messageText
    messageImage
    messageFile
    senderId
    receiverId
    createdAt
    updatedAt
  }
`;

const THREAD_FIELDS = gql`
  fragment ThreadFields on MessageThread {
    _id
    threadKey
    memberData {
      _id
      memberNick
      memberFullName
      memberImage
      memberType
    }
    lastMessage {
      _id
      messageText
      messageType
      createdAt
    }
    unreadCount
    createdAt
    updatedAt
  }
`;

// ── Queries ───────────────────────────────────────────────────────────────────

export const GET_MY_THREADS = gql`
  ${THREAD_FIELDS}
  query GetMyThreads($input: ThreadsInquiry!) {
    getMyThreads(input: $input) {
      list { ...ThreadFields }
      metaCounter { total }
    }
  }
`;

export const GET_MESSAGES = gql`
  ${MESSAGE_FIELDS}
  query GetMessages($input: MessagesInquiry!) {
    getMessages(input: $input) {
      list { ...MessageFields }
      metaCounter { total }
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadMessageCount {
    getUnreadMessageCount
  }
`;

// ── Mutations ─────────────────────────────────────────────────────────────────

export const CREATE_THREAD = gql`
  ${THREAD_FIELDS}
  mutation CreateThread($input: CreateThreadInput!) {
    createThread(input: $input) { ...ThreadFields }
  }
`;

export const SEND_MESSAGE = gql`
  ${MESSAGE_FIELDS}
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { ...MessageFields }
  }
`;

export const MARK_MESSAGES_READ = gql`
  mutation MarkMessagesRead($threadId: String!) {
    markMessagesRead(threadId: $threadId)
  }
`;

export const DELETE_MESSAGE = gql`
  ${MESSAGE_FIELDS}
  mutation DeleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId) { ...MessageFields }
  }
`;

// ── Subscriptions ─────────────────────────────────────────────────────────────

export const ON_MESSAGE_SENT = gql`
  ${MESSAGE_FIELDS}
  subscription OnMessageSent($threadId: String!) {
    messageSent(threadId: $threadId) { ...MessageFields }
  }
`;

export const ON_THREAD_UPDATED = gql`
  ${THREAD_FIELDS}
  subscription OnThreadUpdated {
    threadUpdated { ...ThreadFields }
  }
`;
