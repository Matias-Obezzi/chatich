"use client";
import { createContext, useContext, useEffect, useState } from "react";
import tmi from 'tmi.js'
import { MessagesContext } from "./messagesContext";
import { stringToHash } from "../lib/hash";

export type TwitchMessageType = {
  userstate: tmi.ChatUserstate;
  message: string;
  channel: string;
}

export type TmiContextType = {
  tmiClient: tmi.Client;
}

export const TmiContext = createContext<TmiContextType>({
  tmiClient: {} as tmi.Client
});

export const TmiContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { addMessage, removeMessage } = useContext(MessagesContext);
  const [tmiClient, setTmiClient] = useState<tmi.Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = new URLSearchParams(window.location.search).get('twitch');
    if (!channel) {
      setLoading(false);
      return;
    }
    const client = new tmi.Client({})
    client.connect().then(() => {
      return client.join(channel);
    }).then(() => {
      client.on('message', (channel, tags, message, self) => {
        if (self) return;
        addMessage({
          userstate: tags as tmi.ChatUserstate,
          message,
          channel: channel.replace('#', ''),
          hash: stringToHash(tags.username + message + channel),
          timestamp: Date.now(),
          platform: 'twitch'
        });
      });
      client.on('messagedeleted', (channel, username, deletedMessage) => {
        removeMessage('twitch', stringToHash(username + deletedMessage + channel));
      });
      setTmiClient(client);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to connect to TMI:", err);
    });

    return () => {
      if (client && client.readyState() === 'OPEN') {
        client.disconnect().catch((err) => {
          console.error("Failed to disconnect from TMI:", err);
        });
      }
    };
  }, []);

  if (loading) {
    return <div>Loading twitch client...</div>;
  }

  if (!tmiClient) {
    console.log("No Twitch Chat user");
    return children;
  }

  return (
    <TmiContext.Provider value={{
      tmiClient
    }}>
      {children}
    </TmiContext.Provider>
  );
}