import tmi from 'tmi.js'
import type { MessageData } from "@/lib/kickChat/types";

export type PageContext = {
  url: string;
  search: string;
  pathname: string;
  lang: string;
}

export type TwitchMessageType = {
  userstate: tmi.ChatUserstate;
  message: string;
  channel: string;
}

export type YoutubeMessageType = {
  username: string;
  message: string;
  channel: string;
}

export type KickMessageType = {
  sender: MessageData['sender'];
  message: string;
  channel: string;
}