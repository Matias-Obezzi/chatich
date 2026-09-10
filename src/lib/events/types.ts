export type Platform = 'twitch' | 'kick' | 'youtube';

export type EventActor = {
  id?: string;
  username: string;
  displayName?: string;
  color?: string;
  badges?: string[];
  isMod?: boolean;
  isSubscriber?: boolean;
  isBroadcaster?: boolean;
};

export type EventBase = {
  id: string;
  platform: Platform;
  channel: string;
  timestamp: number;
};

export type PollOption = { id: string | number; label: string; votes: number };

export type StreamEvent =
  | (EventBase & { type: 'chat.message'; actor: EventActor; text: string })
  | (EventBase & { type: 'chat.delete'; targetId: string })
  | (EventBase & { type: 'chat.clear' })
  | (EventBase & { type: 'sub.new'; actor: EventActor; tier?: string; months?: number; text?: string })
  | (EventBase & { type: 'sub.resub'; actor: EventActor; tier?: string; months: number; streak?: number; text?: string })
  | (EventBase & { type: 'sub.gift'; actor: EventActor; recipient?: string; count: number; tier?: string })
  | (EventBase & { type: 'cheer'; actor: EventActor; bits: number; text?: string })
  | (EventBase & { type: 'raid'; actor: EventActor; viewers: number })
  | (EventBase & { type: 'host'; actor: EventActor; viewers?: number })
  | (EventBase & { type: 'superchat'; actor: EventActor; amount: number; currency: string; tierColor?: string; text?: string })
  | (EventBase & { type: 'member.new'; actor: EventActor; tierName?: string })
  | (EventBase & { type: 'poll.update'; pollId: string; title: string; options: PollOption[]; endsAt?: number })
  | (EventBase & { type: 'poll.end'; pollId: string })
  | (EventBase & { type: 'message.pin'; actor: EventActor; text: string })
  | (EventBase & { type: 'message.unpin' })
  | (EventBase & { type: 'mod.ban'; targetUsername: string; permanent: boolean; durationSec?: number })
  | (EventBase & { type: 'mod.unban'; targetUsername: string })
  | (EventBase & { type: 'stream.connected' })
  | (EventBase & { type: 'stream.disconnected' });

export type StreamEventType = StreamEvent['type'];
export type EventOf<T extends StreamEventType> = Extract<StreamEvent, { type: T }>;
export type ChatMessageEvent = EventOf<'chat.message'>;
