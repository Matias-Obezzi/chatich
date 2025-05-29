"use client";
import { createContext, useState } from "react";
import type { TwitchMessageType } from "./tmiContext";
import type { KickMessageType } from "./kickContext";
import type { YoutubeMessageType } from "./youtubeContext";

export type MessagePlatform = 'twitch' | 'youtube' | 'kick';

type TwitchMessage = {
  platform: 'twitch';
} & TwitchMessageType

type YouTubeMessage = {
  platform: 'youtube';
} & YoutubeMessageType

type KickMessage = {
  platform: 'kick';
} & KickMessageType

export type Message = {
  hash: number;
  platform: MessagePlatform;
  timestamp: number;
} & (TwitchMessage | YouTubeMessage | KickMessage)

export type MessagesContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (platform: MessagePlatform, hash: number) => void;
  clearMessages: () => void;
  getMessagesByPlatform: (platform: MessagePlatform) => Message[];
}

export const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  addMessage: () => {},
  removeMessage: () => {},
  clearMessages: () => {},
  getMessagesByPlatform: () => [],
});

export const MessagesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prev) => {
      if (!prev.some(msg => msg.hash === message.hash && msg.platform === message.platform)) {
        return [...prev, message];
      }
      return prev;
    });
  };

  const removeMessage = (platform: MessagePlatform, hash: number) => {
    setMessages((prev) => prev.filter(msg => msg.platform !== platform && msg.hash !== hash));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getMessagesByPlatform = (platform: MessagePlatform) => {
    return messages.filter(msg => msg.platform === platform);
  };

  return (
    <MessagesContext.Provider value={{ messages, addMessage, removeMessage, clearMessages, getMessagesByPlatform }}>
      {children}
    </MessagesContext.Provider>
  );
}