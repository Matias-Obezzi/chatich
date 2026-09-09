import { useEffect } from "react";
import tmi from "tmi.js";
import { EventBus } from "../lib/events/bus";
import { EventActor } from "../lib/events/types";
import { stringToHash } from "../lib/hash";

export function useTwitchAdapter(bus: EventBus, channel: string | null) {
  useEffect(() => {
    if (!channel) return;

    const client = new tmi.Client({
      connection: {
        reconnect: true,
        secure: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getActor = (userstate: any): EventActor => ({
      id: userstate["user-id"],
      username: userstate.username || "unknown",
      displayName: userstate["display-name"],
      color: userstate.color,
      badges: userstate.badges ? Object.keys(userstate.badges) : [],
      isMod: userstate.mod,
      isSubscriber: userstate.subscriber,
      isBroadcaster: userstate.badges?.broadcaster === "1",
    });

    client.connect().then(() => {
      client.join(channel);
      bus.emit({
        id: `twitch-connected-${Date.now()}`,
        platform: "twitch",
        channel,
        timestamp: Date.now(),
        type: "stream.connected",
      });
    }).catch(console.error);

    client.on("message", (channel, tags, message, self) => {
      if (self) return;
      const cleanChannel = channel.replace("#", "");
      bus.emit({
        id: `twitch-${tags.id || stringToHash(tags.username + message + cleanChannel + Date.now())}`,
        platform: "twitch",
        channel: cleanChannel,
        timestamp: Date.now(),
        type: "chat.message",
        actor: getActor(tags),
        text: message,
      });
    });

    client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
      bus.emit({
        id: `twitch-del-${userstate["target-msg-id"] || stringToHash(username + deletedMessage + channel + Date.now())}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "chat.delete",
        targetId: `twitch-${userstate["target-msg-id"] || stringToHash(username + deletedMessage + channel)}`,
      });
    });

    client.on("clearchat", (channel) => {
      bus.emit({
        id: `twitch-clear-${Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "chat.clear",
      });
    });

    client.on("ban", (channel, username) => {
      bus.emit({
        id: `twitch-ban-${username}-${Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "mod.ban",
        targetUsername: username,
        permanent: true,
      });
    });

    client.on("timeout", (channel, username, reason, duration) => {
      bus.emit({
        id: `twitch-timeout-${username}-${Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "mod.ban",
        targetUsername: username,
        permanent: false,
        durationSec: duration,
      });
    });

    client.on("subscription", (channel, username, method, message, userstate) => {
      bus.emit({
        id: `twitch-sub-${userstate.id || Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "sub.new",
        actor: getActor(userstate),
        tier: method.plan,
        text: message,
      });
    });

    client.on("resub", (channel, username, months, message, userstate, methods) => {
      bus.emit({
        id: `twitch-resub-${userstate.id || Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "sub.resub",
        actor: getActor(userstate),
        tier: methods.plan,
        months,
        text: message,
      });
    });

    client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
      bus.emit({
        id: `twitch-subgift-${userstate.id || Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "sub.gift",
        actor: getActor(userstate),
        recipient,
        count: 1,
        tier: methods.plan,
      });
    });

    client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
      bus.emit({
        id: `twitch-submysterygift-${userstate.id || Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "sub.gift",
        actor: getActor(userstate),
        count: numbOfSubs,
        tier: methods.plan,
      });
    });

    client.on("cheer", (channel, userstate, message) => {
      bus.emit({
        id: `twitch-cheer-${userstate.id || Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "cheer",
        actor: getActor(userstate),
        bits: parseInt(userstate.bits || "0", 10),
        text: message,
      });
    });

    client.on("raided", (channel, username, viewers) => {
      bus.emit({
        id: `twitch-raid-${username}-${Date.now()}`,
        platform: "twitch",
        channel: channel.replace("#", ""),
        timestamp: Date.now(),
        type: "raid",
        actor: { username, displayName: username },
        viewers,
      });
    });

    // TODO: requiere EventSub + OAuth (fase desktop) para Follows

    return () => {
      if (client && client.readyState() === "OPEN") {
        client.disconnect().catch(console.error);
        bus.emit({
          id: `twitch-disconnected-${Date.now()}`,
          platform: "twitch",
          channel,
          timestamp: Date.now(),
          type: "stream.disconnected",
        });
      }
    };
  }, [bus, channel]);
}