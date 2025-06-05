import { getYtInitialDataContent } from "@/lib/youtube";
import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

export type YoutubeMessageType = {
  username: string;
  message: string;
  channel: string;
}

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const url = process.env.NODE_ENV === "development" ?
    `https://www.youtube.com/live_chat?is_popout=1&v=${id}&embed_domain=localhost` :
    `https://www.youtube.com/live_chat?is_popout=1&v=${id}&embed_domain=chatich.vercel.app`;
  const content = await getYtInitialDataContent(url, request.headers);
  const liveChat = content?.liveChatRenderer;
  if (!liveChat || !liveChat.actions) {
    console.error("No live chat actions found in ytInitialData");
    return new Response("Failed to load chat", { status: 500 });
  }
  const messages: YoutubeMessageType[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveChat.actions.forEach((action: any) => {
    if (action.addChatItemAction && action.addChatItemAction.item) {
      const item = action.addChatItemAction.item.liveChatTextMessageRenderer;
      if (item) {
        const username = item.authorName?.simpleText || item.authorName?.runs?.[0]?.text || "Unknown";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = item.message?.simpleText || item.message?.runs?.map((run: any) => run.text).join("") || "";
        messages.push({ username, message, channel: id });
      }
    }
  });

  return NextResponse.json({
    messages
  }, {
    status: 200
  });
};