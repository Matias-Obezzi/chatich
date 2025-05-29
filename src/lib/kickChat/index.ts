import { EventEmitter } from "../eventEmitter";
import { getChannelData } from "./channelData";
import { parseMessage } from "./parser";
import { createWebSocket } from "./webSocket";

export async function createClient(channelName: string) {
  try {
    const emitter = new EventEmitter();
    const channelInfo = await getChannelData(channelName);
    if (!channelInfo) {
      throw new Error("Unable to fetch channel data");
    }
    const socket = createWebSocket();

    socket.onopen = () => {
      const connect = JSON.stringify({
        event: "pusher:subscribe",
        data: { auth: "", channel: `chatrooms.${channelInfo.chatroom.id}.v2` }
      });
      socket.send(connect);
      emitter.emit("ready", channelInfo ? {
        id: channelInfo.id,
        username: channelInfo.slug,
        tag: channelInfo.user.username
      } : null);
    };

    socket.onmessage = (event) => {
      const data = typeof event.data === "string" ? event.data : "";
      const parsedMessage = parseMessage(data);
      if (!parsedMessage) {
        return;
      }
      if (parsedMessage.type === "ChatMessage") {
        const messageData = parsedMessage.data;
        messageData.content = messageData.content.replace(
          /\[emote:(\d+):(\w+)\]/g,
          (_: string, __: string, emoteName: string) => emoteName
        );
      }
      emitter.emit(parsedMessage.type, parsedMessage.data);
    };

    socket.onclose = () => {
      emitter.emit("disconnect");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      emitter.emit("error", error);
    };

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: (event: string, listener: (...args: any[]) => void) => {
        emitter.on(event, listener);
      }
    }
  } catch (error) {
    console.error("Error during initialization:", error);
    throw error;
  }
}