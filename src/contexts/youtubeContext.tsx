"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { MessagesContext } from "./messagesContext";
import { stringToHash } from "../lib/hash";

export type YoutubeMessageType = {
  username: string;
  content: string;
  channel: string;
}

export const YoutubeContext = createContext<unknown>({});

export const YoutubeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { addMessage } = useContext(MessagesContext);
  const [channel, setChannel] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = new URLSearchParams(window.location.search).get("youtube");
    if (!channel) {
      setLoading(false);
      return;
    }
    setChannel(channel);
    const interval = setInterval(() => {
      load(channel)
    }, 1000); // 72,000 ms = 72 seconds
    load(channel)

    return () => {
      clearInterval(interval);
    }
  }, []);

  const load = async (channel: string) => {
    const response = await fetch(`${process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://chatich.vercel.app"}/api/youtube/${channel}`, { cache: "no-cache" });
    if (!response.ok) {
      return;
    }
    const responseText = await response.text();
    const parser = new DOMParser();
    const document = parser.parseFromString(responseText, "text/html");
    if (!document) {
      console.error("Failed to access iframe document");
      return;
    }
    const ytInitialData = [...document.querySelectorAll("script")].filter(el => el.textContent?.includes("ytInitialData"))?.[0]?.textContent;
    if (!ytInitialData) {
      console.error("Failed to find ytInitialData in the document");
      return;
    }
    const match = ytInitialData.match(/window\["ytInitialData"\]\s*=\s*(\{.*?\});/)?.[0];
    const data = JSON.parse(match?.replace(/window\["ytInitialData"\]\s*=\s*/, "").replace(";", "") || "{}");
    if (!data) {
      console.error("Failed to parse ytInitialData");
      return;
    }
    if (!data || !data.contents || !data.contents.liveChatRenderer) {
      console.error("Invalid ytInitialData structure", data);
      return;
    }
    const liveChat = data.contents.liveChatRenderer;
    if (!liveChat || !liveChat.actions) {
      console.error("No live chat actions found in ytInitialData");
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    liveChat.actions.forEach((action: any) => {
      if (action.addChatItemAction && action.addChatItemAction.item) {
        const item = action.addChatItemAction.item.liveChatTextMessageRenderer;
        if (item) {
          const username = item.authorName?.simpleText || item.authorName?.runs?.[0]?.text || "Unknown";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = item.message?.simpleText || item.message?.runs?.map((run: any) => run.text).join("") || "";
          addMessage({
            platform: "youtube",
            channel,
            username,
            content: message,
            hash: stringToHash(username + message + channel),
            timestamp: Date.now()
          });
        }
      }
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
    <YoutubeContext.Provider value={{}}>
      {children}
    </YoutubeContext.Provider>
  );
}