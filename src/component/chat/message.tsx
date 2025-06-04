import type { KickMessageType } from "@/contexts/kickContext";
import type { Message } from "@/contexts/messagesContext";
import type { TwitchMessageType } from "@/contexts/tmiContext";
import type { YoutubeMessageType } from "@/contexts/youtubeContext";
import { hexToRgb } from "@/lib/colots";
import type { CustomStyles } from "./index";

export function Message({ message, styles }: { message: Message, styles: CustomStyles }) {
  if (message.platform === 'twitch') {
    return <TwitchMessage message={message} styles={styles} />;
  }
  if (message.platform === 'kick') {
    return <KickMessage message={message} styles={styles} />;
  }
  if (message.platform === 'youtube') {
    return <YoutubeMessage message={message} styles={styles} />;
  }
  return null;
}

function TwitchMessage({ message, styles }: { message: TwitchMessageType, styles: CustomStyles }) {
  return (
    <DefaultMessage
      message={{
        username: message.userstate.username!,
        color: message.userstate.color,
        message: message.message,
        platform: 'twitch',
      }}
      styles={styles}
    />
  );
}

function KickMessage({ message, styles }: { message: KickMessageType, styles: CustomStyles }) {
  return (
    <DefaultMessage
      message={{
        username: message.sender.username,
        color: message.sender.identity.color,
        message: message.message,
        platform: 'kick',
      }}
      styles={styles}
    />
  )
}

function YoutubeMessage({ message, styles }: { message: YoutubeMessageType, styles: CustomStyles }) {
  return (
    <DefaultMessage
      message={{
        username: message.username,
        color: undefined, // YouTube messages don't have a color
        message: message.content,
        platform: 'youtube',
      }}
      styles={styles}
    />
  );
}

const DefaultMessage = ({ message, styles } : { message: {
  username: string;
  color?: string;
  message: string;
  platform: string;
}, styles: CustomStyles }) => {
  const PLATFORM_ICONS: Record<string, string> = {
    twitch: "./twitch.png",
    kick: "./kick.ico",
    youtube: "./youtube.png",
  }

  const PLATFORM_COLORS: Record<string, string> = {
    twitch: "linear-gradient(120deg, rgba(145,70,255,0.2) 0%, rgba(145,70,255,0.5) 100%)",
    kick: "linear-gradient(120deg, rgba(83,252,24,0.2) 0%, rgba(83,252,24,0.5) 100%)",
    youtube: "linear-gradient(120deg, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0.5) 100%)"
  }

  const colorAsRgb = hexToRgb(message.color || '#000000')!;
  const color = !message.color
    ? PLATFORM_COLORS[message.platform]
    : `linear-gradient(120deg, rgba(${colorAsRgb.r}, ${colorAsRgb.g}, ${colorAsRgb.b}, 0.2) 0%, rgba(${colorAsRgb.r}, ${colorAsRgb.g}, ${colorAsRgb.b}, 0.5) 100%)`;

  return (
    <div
      className="px-4 py-2 message flex gap-2 items-center justify-center"
      style={{
        background: styles["message-background"] || color,
        color: styles['message-color'] || undefined,
        fontWeight: styles['message-font-weight'] || undefined,
        fontSize: styles['message-font-size'] || undefined,
        fontFamily: styles['message-font-family'] || undefined,
        textDecoration: styles['message-text-decoration'] || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textTransform: styles['message-text-transform'] as any || undefined,
        textShadow: styles['message-text-shadow'] || undefined,
        borderRadius: styles['message-border-radius'] || "0.25rem",
        padding: styles['message-padding'] || undefined,
        margin: styles['message-margin'] || undefined,
        boxShadow: styles['message-box-shadow'] || undefined,
        lineHeight: styles['message-line-height'] || undefined,
        letterSpacing: styles['message-letter-spacing'] || undefined,
        wordSpacing: styles['message-word-spacing'] || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textAlign: styles['message-text-align'] as any || "left",
        textOverflow: styles['message-text-overflow'] || undefined,
        whiteSpace: styles['message-white-space'] || "nowrap",
      }}
    >
      <div className="h-5 w-5 flex items-center justify-center rounded overflow-hidden">
        <img src={PLATFORM_ICONS[message.platform]} alt={message.platform} />
      </div>
      <div
        className="font-bold flex items-center justify-between w-fit"
        style={{
          color: styles['username-color'] || undefined,
          fontWeight: styles['username-font-weight'] || 'bold',
          fontSize: styles['username-font-size'] || undefined,
        }}
      >
        {message.username}
      </div>
      {message.message}
    </div>
  );
}