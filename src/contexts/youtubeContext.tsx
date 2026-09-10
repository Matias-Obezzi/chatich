import { useEffect } from "react";
import { EventBus } from "../lib/events/bus";
import { stringToHash } from "../lib/hash";
import { YoutubeMessageType } from "@/type";

export function useYoutubeAdapter(bus: EventBus, channel: string | null) {
  useEffect(() => {
    if (!channel) return;

    let chatTimeout: NodeJS.Timeout | undefined;
    let isMounted = true;
    let failures = 0;

    const pollChat = async () => {
      if (!isMounted) return;
      try {
        const response = await fetch(`/api/youtube/${channel}/chat`, { cache: "no-cache" });
        if (!response.ok) {
          throw new Error("Failed to fetch YouTube chat");
        }
        const data = await response.json();
        const messages = data.messages as YoutubeMessageType[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const superchats = data.superchats as any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const members = data.members as any[];
        
        messages.forEach(({ username, message, channel }) => {
          const contentHash = stringToHash(username + message + channel);
          bus.emit({
            id: `youtube-${contentHash}`,
            platform: "youtube",
            channel,
            timestamp: Date.now(),
            type: "chat.message",
            actor: { username },
            text: message,
          });
        });

        superchats?.forEach((sc) => {
          const contentHash = stringToHash(`superchat-${sc.username}-${sc.amountText}-${sc.channel}-${sc.message}`);
          bus.emit({
            id: `youtube-superchat-${contentHash}`,
            platform: "youtube",
            channel: sc.channel,
            timestamp: Date.now(),
            type: "superchat",
            actor: { username: sc.username },
            amount: sc.amount,
            currency: sc.currency,
            tierColor: sc.tierColor,
            text: sc.message,
          });
        });

        members?.forEach((member) => {
          const contentHash = stringToHash(`member-${member.username}-${member.tierName}-${member.channel}`);
          bus.emit({
            id: `youtube-member-${contentHash}`,
            platform: "youtube",
            channel: member.channel,
            timestamp: Date.now(),
            type: "member.new",
            actor: { username: member.username },
            tierName: member.tierName,
          });
        });

        failures = 0;
        if (isMounted) {
          chatTimeout = setTimeout(pollChat, 1000);
        }
      } catch (error) {
        console.error("Failed to load YouTube chat:", error);
        failures++;
        // Exponential backoff, max 30s
        const backoff = Math.min(1000 * Math.pow(2, failures), 30000);
        if (isMounted) {
          chatTimeout = setTimeout(pollChat, backoff);
        }
      }
    };

    pollChat();
    
    bus.emit({
      id: `youtube-connected-${Date.now()}`,
      platform: "youtube",
      channel,
      timestamp: Date.now(),
      type: "stream.connected",
    });

    return () => {
      isMounted = false;
      if (chatTimeout) {
        clearTimeout(chatTimeout);
      }
      bus.emit({
        id: `youtube-disconnected-${Date.now()}`,
        platform: "youtube",
        channel,
        timestamp: Date.now(),
        type: "stream.disconnected",
      });
    };
  }, [bus, channel]);
}