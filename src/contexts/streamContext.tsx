"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createEventBus, EventBus } from "../lib/events/bus";
import { ChatMessageEvent, EventOf, Platform, StreamEvent, StreamEventType } from "../lib/events/types";
import { useTwitchAdapter } from "./tmiContext";
import { useKickAdapter } from "./kickContext";
import { useYoutubeAdapter } from "./youtubeContext";

type StreamContextType = {
  bus: EventBus;
  events: StreamEvent[];
  messages: ChatMessageEvent[];
  connected: Record<Platform, boolean>;
};

const StreamContext = createContext<StreamContextType | null>(null);

export const StreamProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const twitchChannel = searchParams.get("twitch");
  const kickChannel = searchParams.get("kick");
  const youtubeChannel = searchParams.get("youtube");
  
  const limitParam = searchParams.get("limit");
  const limit = Math.min(limitParam ? parseInt(limitParam, 10) : 200, 1000);

  const bus = useMemo(() => createEventBus(), []);

  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [messages, setMessages] = useState<ChatMessageEvent[]>([]);
  const [connected, setConnected] = useState<Record<Platform, boolean>>({
    twitch: false,
    kick: false,
    youtube: false,
  });

  useTwitchAdapter(bus, twitchChannel);
  useKickAdapter(bus, kickChannel);
  useYoutubeAdapter(bus, youtubeChannel);

  useEffect(() => {
    const unsub = bus.onAny((event) => {
      if (event.type === "stream.connected") {
        setConnected((prev) => ({ ...prev, [event.platform]: true }));
      } else if (event.type === "stream.disconnected") {
        setConnected((prev) => ({ ...prev, [event.platform]: false }));
      }

      setEvents((prev) => {
        const next = [...prev, event];
        if (next.length > limit) return next.slice(next.length - limit);
        return next;
      });

      if (event.type === "chat.message") {
        setMessages((prev) => {
          const next = [...prev, event as ChatMessageEvent];
          if (next.length > limit) return next.slice(next.length - limit);
          return next;
        });
      }

      if (event.type === "chat.delete") {
        setMessages((prev) => prev.filter((msg) => msg.id !== event.targetId));
      }

      if (event.type === "chat.clear") {
        setMessages((prev) => prev.filter((msg) => msg.platform !== event.platform));
      }
    });

    return unsub;
  }, [bus, limit]);

  return (
    <StreamContext.Provider value={{ bus, events, messages, connected }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};

export function useStreamEvent<T extends StreamEventType>(type: T, handler: (e: EventOf<T>) => void) {
  const { bus } = useStream();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const unsub = bus.on(type, (e) => handlerRef.current(e));
    return unsub;
  }, [bus, type]);
}
