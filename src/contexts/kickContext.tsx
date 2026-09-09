import { useEffect } from "react";
import { createClient } from "../lib/kickChat";
import type { MessageData } from "../lib/kickChat/types";
import { EventBus } from "../lib/events/bus";
import { EventActor } from "../lib/events/types";
import { stringToHash } from "../lib/hash";

export function useKickAdapter(bus: EventBus, channel: string | null) {
  useEffect(() => {
    if (!channel) return;

    let clientRef: Awaited<ReturnType<typeof createClient>> | null = null;

    const getActor = (sender: MessageData["sender"]): EventActor => ({
      id: sender.id.toString(),
      username: sender.username,
      color: sender.identity.color,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      badges: (sender.identity.badges as any[])?.map(b => b.type) || [],
    });

    createClient(channel).then((client) => {
      clientRef = client;

      client.on("ready", () => {
        bus.emit({
          id: `kick-connected-${Date.now()}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "stream.connected",
        });
      });

      client.on("disconnect", () => {
        bus.emit({
          id: `kick-disconnected-${Date.now()}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "stream.disconnected",
        });
      });

      client.on("ChatMessage", (message: MessageData) => {
        bus.emit({
          id: `kick-${message.id}`,
          platform: "kick",
          channel,
          timestamp: Date.now(), // Kick might have a timestamp in message.created_at, using Date.now() for simplicity if not parsed
          type: "chat.message",
          actor: getActor(message.sender),
          text: message.content,
        });
      });

      client.on("MessageDeleted", (message: MessageData) => {
        // Kick MessageDeleted usually contains the ID of the deleted message
        // I will assume message.id is the deleted message ID
        // Note: assumed message.id is the ID of the message being deleted
        bus.emit({
          id: `kick-del-${message.id}-${Date.now()}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "chat.delete",
          targetId: `kick-${message.id}`,
        });
      });

      client.on("Subscription", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-sub-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "sub.new",
          actor: { username: (data.username as string) || "unknown" }, // Assumed data.username exists
        });
      });

      client.on("GiftedSubscriptions", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-subgift-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "sub.gift",
          actor: { username: (data.gifter_username as string) || "unknown" }, // Assumed gifter_username exists
          count: (data.gifted_count as number) || 1, // Assumed gifted_count exists
        });
      });

      client.on("StreamHost", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-host-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "host",
          actor: { username: (data.host_username as string) || "unknown" }, // Assumed host_username exists
          viewers: data.viewers_count as number, // Assumed viewers_count exists
        });
      });

      client.on("UserBanned", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-ban-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "mod.ban",
          targetUsername: (data.banned_username as string) || "unknown", // Assumed banned_username exists
          permanent: data.expires_at === null, // Assumed expires_at exists
        });
      });

      client.on("UserUnbanned", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-unban-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "mod.unban",
          targetUsername: (data.unbanned_username as string) || "unknown", // Assumed unbanned_username exists
        });
      });

      client.on("PinnedMessageCreated", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-pin-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "message.pin",
          actor: { username: (data.author_username as string) || "unknown" }, // Assumed author_username
          text: (data.content as string) || "", // Assumed content
        });
      });

      client.on("PinnedMessageDeleted", () => {
        bus.emit({
          id: `kick-unpin-${Date.now()}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "message.unpin",
        });
      });

      client.on("PollUpdate", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-poll-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "poll.update",
          pollId: (data.id as string) || "unknown",
          title: (data.title as string) || "", // Assumed title
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options: (data.options as any[]) || [], // Assumed options is PollOption[]
        });
      });

      client.on("PollDelete", (data: Record<string, unknown>) => {
        bus.emit({
          id: `kick-poll-end-${data.id || stringToHash(JSON.stringify(data))}`,
          platform: "kick",
          channel,
          timestamp: Date.now(),
          type: "poll.end",
          pollId: (data.id as string) || "unknown",
        });
      });

    }).catch(console.error);

    return () => {
      if (clientRef) {
        clientRef.close();
      }
    };
  }, [bus, channel]);
}