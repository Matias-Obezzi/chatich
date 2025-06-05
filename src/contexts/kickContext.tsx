"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../lib/kickChat";
import type { MessageData } from "../lib/kickChat/types";
import { MessagesContext } from "./messagesContext";
import { stringToHash } from "../lib/hash";

export type KickContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kickClient: any;
}

export const KickContext = createContext<KickContextType>({
  kickClient: null,
});

export const KickContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { addMessage, removeMessage } = useContext(MessagesContext);
  const [kickClient, setKickClient] = useState<Awaited<ReturnType<typeof createClient>>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = new URLSearchParams(window.location.search).get('kick');
    if (!channel) {
      setLoading(false);
      return;
    }
    createClient(channel).then((client) => {
      client.on("ready", () => {
        client.on("ChatMessage", async (message: MessageData) => {
          addMessage({
            sender: message.sender,
            message: message.content,
            channel: channel,
            hash: stringToHash(message.sender.username + message.content + channel),
            timestamp: Date.now(),
            platform: 'kick',
          });
        });
        client.on("ChatMessageDelete", (message: MessageData) => {
          removeMessage('kick', stringToHash(message.sender.username + message.content + channel));
        });
        setKickClient(client);
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return <div>Loading Kick client...</div>;
  }

  if (!kickClient) {
    console.log("No Kick Chat user");
    return children;
  }

  return (
    <KickContext.Provider value={{ kickClient }}>
      {children}
    </KickContext.Provider>
  );
}