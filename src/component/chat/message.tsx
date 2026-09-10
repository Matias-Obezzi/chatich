import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessageEvent } from "@/lib/events/types";
import { hexToRgb } from "@/lib/colots";
import type { CustomStyles } from "./index";
import { themeSurface, type OverlayTheme } from "@/component/overlays/ui";

export function Message({
  message,
  styles,
  layout,
  ttl,
  theme,
}: {
  message: ChatMessageEvent;
  styles: CustomStyles;
  layout?: "horizontal" | "vertical";
  ttl?: number;
  theme?: OverlayTheme;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (ttl) {
      const timer = setTimeout(() => setVisible(false), ttl);
      return () => clearTimeout(timer);
    }
  }, [ttl]);

  if (!visible) return null;

  return (
    <DefaultMessage
      message={{
        username: message.actor.displayName || message.actor.username,
        color: message.actor.color,
        message: message.text,
        platform: message.platform,
      }}
      styles={styles}
      layout={layout}
      theme={theme}
    />
  );
}

const DefaultMessage = ({
  message,
  styles,
  layout,
  theme = "glass",
}: {
  message: {
    username: string;
    color?: string;
    message: string;
    platform: string;
  };
  styles: CustomStyles;
  layout?: "horizontal" | "vertical";
  theme?: OverlayTheme;
}) => {
  const PLATFORM_ICONS: Record<string, string> = {
    twitch: "/twitch.png",
    kick: "/kick.ico",
    youtube: "/youtube.png",
  };

  const PLATFORM_COLORS: Record<string, string> = {
    twitch: "var(--twitch, #9146FF)",
    kick: "var(--kick, #53FC18)",
    youtube: "var(--youtube, #FF0033)",
  };

  const platformColor = PLATFORM_COLORS[message.platform] || "var(--neon, #8B5CF6)";

  const colorAsRgb = message.color ? hexToRgb(message.color) : null;
  const userColor = colorAsRgb
    ? `rgb(${colorAsRgb.r}, ${colorAsRgb.g}, ${colorAsRgb.b})`
    : platformColor;

  const defaultBackground = "rgba(18, 18, 29, 0.85)";
  const surface = themeSurface(theme);
  const hasCustomTextShadow = !!styles["message-text-shadow"];

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, x: layout === 'vertical' ? 0 : 20, y: layout === 'vertical' ? 20 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`message flex items-center gap-3 px-4 py-2 ${
        layout === "vertical" ? "w-full max-w-sm mb-2" : ""
      }`}
      style={{
        background: styles["message-background"] || defaultBackground,
        backdropFilter: surface.style.backdropFilter,
        border: surface.style.border,
        borderLeft: `3px solid ${userColor}`,
        boxShadow: styles["message-box-shadow"] || surface.style.boxShadow,
        color: styles["message-color"] || "var(--text, #EDEDF5)",
        fontWeight: styles["message-font-weight"] || "500",
        fontSize: styles["message-font-size"] || "0.95rem",
        fontFamily: styles["message-font-family"] || "var(--font-inter), sans-serif",
        textDecoration: styles["message-text-decoration"] || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textTransform: (styles["message-text-transform"] as any) || undefined,
        textShadow: styles["message-text-shadow"] || "0px 1px 2px rgba(0,0,0,0.8)",
        borderRadius: styles["message-border-radius"] || "0.5rem",
        padding: styles["message-padding"] || undefined,
        margin: styles["message-margin"] || undefined,
        lineHeight: styles["message-line-height"] || "1.4",
        letterSpacing: styles["message-letter-spacing"] || undefined,
        wordSpacing: styles["message-word-spacing"] || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textAlign: (styles["message-text-align"] as any) || "left",
        textOverflow: styles["message-text-overflow"] || undefined,
        whiteSpace:
          styles["message-white-space"] || (layout === "vertical" ? "normal" : "nowrap"),
        wordBreak: layout === "vertical" ? "break-word" : undefined,
      }}
    >
      <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden flex items-center justify-center bg-black/40 border border-white/10 shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PLATFORM_ICONS[message.platform]}
          alt={message.platform}
          className="w-3.5 h-3.5 object-contain drop-shadow-md"
        />
      </div>
      <div
        className={`${
          layout === "vertical"
            ? "flex flex-col items-start gap-0.5"
            : "flex items-center gap-2"
        } flex-1 min-w-0`}
      >
        <div
          className="font-title flex-shrink-0"
          style={{
            color: styles["username-color"] || userColor,
            fontWeight: styles["username-font-weight"] || "700",
            fontSize: styles["username-font-size"] || "1rem",
            textShadow: hasCustomTextShadow ? undefined : "0px 1px 3px rgba(0,0,0,0.9)",
            // If they provided a global font family in styles['message-font-family'], we shouldn't hardcode title font here if they want everything uniform?
            // Wait, CustomStyles doesn't have `username-font-family`.
            fontFamily: "var(--font-chakra), sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {message.username}
        </div>
        <div
          className={`${layout === "vertical" ? "w-full" : ""}`}
        >
          {message.message}
        </div>
      </div>
    </motion.div>
  );
};