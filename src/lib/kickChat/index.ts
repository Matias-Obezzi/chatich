import { EventEmitter } from "../eventEmitter";
import { getChannelData } from "./channelData";
import { parseMessage } from "./parser";
import { createWebSocket } from "./webSocket";

export async function createClient(channelName: string) {
  const emitter = new EventEmitter();
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  let isClosed = false;
  let connectTimeout: NodeJS.Timeout | null = null;

  async function connect() {
    if (isClosed) return;
    
    try {
      const channelInfo = await getChannelData(channelName);
      if (!channelInfo) {
        throw new Error("Unable to fetch channel data");
      }
      socket = createWebSocket();

      socket.onopen = () => {
        reconnectAttempts = 0;
        const subscribe = JSON.stringify({
          event: "pusher:subscribe",
          data: { auth: "", channel: `chatrooms.${channelInfo.chatroom.id}.v2` }
        });
        socket?.send(subscribe);
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
        if (!isClosed) {
          scheduleReconnect();
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        emitter.emit("error", error);
      };
    } catch (error) {
      console.error("Error connecting to Kick:", error);
      if (!isClosed) {
        scheduleReconnect();
      }
    }
  }

  function scheduleReconnect() {
    if (isClosed) return;
    const baseDelay = 1000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts), maxDelay);
    reconnectAttempts++;
    console.log(`Reconnecting to Kick in ${delay}ms...`);
    if (connectTimeout) clearTimeout(connectTimeout);
    connectTimeout = setTimeout(connect, delay);
  }

  // Initial connection
  connect();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on: (event: string, listener: (...args: any[]) => void) => {
      return emitter.on(event, listener);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off: (event: string, listener: (...args: any[]) => void) => {
      emitter.off(event, listener);
    },
    close: () => {
      isClosed = true;
      if (connectTimeout) clearTimeout(connectTimeout);
      if (socket) {
        socket.close();
      }
    }
  }
}