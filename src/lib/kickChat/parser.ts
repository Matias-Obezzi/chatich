import type { ParsedMessage } from "./types";

export function parseMessage(message: string) {
  try {
    const messageEventJSON = JSON.parse(message);
    switch (messageEventJSON.event) {
      case "App\\Events\\ChatMessageEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "ChatMessage", data } as ParsedMessage;
      }
      case "App\\Events\\SubscriptionEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "Subscription", data } as ParsedMessage;
      }
      case "App\\Events\\GiftedSubscriptionsEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "GiftedSubscriptions", data } as ParsedMessage;
      }
      case "App\\Events\\StreamHostEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "StreamHost", data } as ParsedMessage;
      }
      case "App\\Events\\MessageDeletedEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "MessageDeleted", data } as ParsedMessage;
      }
      case "App\\Events\\UserBannedEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "UserBanned", data } as ParsedMessage;
      }
      case "App\\Events\\UserUnbannedEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "UserUnbanned", data } as ParsedMessage;
      }
      case "App\\Events\\PinnedMessageCreatedEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "PinnedMessageCreated", data } as ParsedMessage;
      }
      case "App\\Events\\PinnedMessageDeletedEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "PinnedMessageDeleted", data } as ParsedMessage;
      }
      case "App\\Events\\PollUpdateEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "PollUpdate", data } as ParsedMessage;
      }
      case "App\\Events\\PollDeleteEvent": {
        const data = JSON.parse(messageEventJSON.data);
        return { type: "PollDelete", data } as ParsedMessage;
      }
      default: {
        console.log("Unknown event type:", messageEventJSON.event);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};