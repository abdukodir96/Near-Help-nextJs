export type MessageType   = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
export type MemberType    = 'USER' | 'AGENT' | 'ADMIN';

export type MemberData = {
  _id: string;
  memberNick: string;
  memberFullName: string;
  memberImage: string | null;
  memberType: MemberType;
};

export type Message = {
  _id: string;
  messageType: MessageType;
  messageStatus: MessageStatus;
  messageText: string | null;
  messageImage: string | null;
  messageFile: string | null;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
};

export type LastMessage = {
  _id: string;
  messageText: string | null;
  messageType: MessageType;
  createdAt: string;
};

export type MessageThread = {
  _id: string;
  threadKey: string;
  memberData: MemberData;
  lastMessage: LastMessage | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};
