export type MessageData = {
  id: string;
  chatroom_id: number;
  content: string;
  type: string;
  created_at: string;
  sender: {
    id: number;
    username: string;
    slug: string;
    identity: {
      color: string;
      badges: unknown;
    };
  };
  metadata?: {
    original_sender: {
      id: string;
      username: string;
    };
    original_message: {
      id: string;
      content: string;
    };
  };
};

export type ParsedMessage =
  | { type: "ChatMessage"; data: MessageData }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "Subscription"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "GiftedSubscriptions"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "StreamHost"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "MessageDeleted"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "UserBanned"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "UserUnbanned"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "PinnedMessageCreated"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "PinnedMessageDeleted"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "PollUpdate"; data: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "PollDelete"; data: any }
  | null;
