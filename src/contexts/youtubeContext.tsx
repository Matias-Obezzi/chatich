"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { MessagesContext } from "./messagesContext";
import { stringToHash } from "../lib/hash";
import { YoutubeDataType } from "@/app/api/youtube/[id]/data/route";
import { YoutubeMessageType } from "@/type";

export type YoutubeContextType = {
  data?: YoutubeDataType;
}

export const YoutubeContext = createContext<YoutubeContextType>({
});

export const YoutubeContextProvider = ({ children, isChat = false, isData = false }: { children: React.ReactNode, isChat: boolean, isData: boolean }) => {
  const { addMessage } = useContext(MessagesContext);
  const [channel, setChannel] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<YoutubeDataType>();

  useEffect(() => {
    const channel = new URLSearchParams(window.location.search).get("youtube");
    if (!channel || (!isChat && !isData)) {
      setLoading(false);
      return;
    }
    setChannel(channel);

    let dataInterval: NodeJS.Timeout | undefined;
    let chatInterval: NodeJS.Timeout | undefined;

    if (isData) {
      dataInterval = setInterval(() => {
        loadData(channel).catch((error) => {
          console.error("Failed to load YouTube data:", error);
          clearInterval(chatInterval);
          alert("Failed to load YouTube data. Please try again later.");
        });
      }, 5000);
      loadData(channel)
    }
    if (isChat) {
      chatInterval = setInterval(() => {
        loadChat(channel).catch((error) => {
          console.error("Failed to load YouTube chat:", error);
          clearInterval(chatInterval);
          alert("Failed to load YouTube chat. Please try again later.");
        });
      }, 1000);
      loadChat(channel)
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      dataInterval && clearInterval(dataInterval);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      chatInterval && clearInterval(chatInterval);
    }
  }, []);

  const loadData = async (channel: string) => {
    const response = await fetch(`/api/youtube/${channel}/data`, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error("Failed to fetch YouTube data");
    }
    const data = (await response.json()).data as YoutubeDataType;
    setData(data);
    setLoading(false);
  }

  const loadChat = async (channel: string) => {
    const response = await fetch(`/api/youtube/${channel}/chat`, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error("Failed to fetch YouTube chat");
    }
    const messages = (await response.json()).messages as YoutubeMessageType[];
    messages.forEach(({ username, message, channel }) => {
      addMessage({
        platform: "youtube",
        channel,
        username,
        message,
        hash: stringToHash(username + message + channel),
        timestamp: Date.now()
      });
    });
    setLoading(false);
  }

  if (loading) {
    return <div>Loading youtube client...</div>;
  }

  if (!channel) {
    return children;
  }

  return (
    <YoutubeContext.Provider value={{ data }}>
      {children}
    </YoutubeContext.Provider>
  );
}