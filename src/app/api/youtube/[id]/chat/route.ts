import { getYtInitialDataContent } from "@/lib/youtube";
import { YoutubeMessageType } from "@/type";
import { NextResponse } from "next/server";

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
  const superchats: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members: any[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveChat.actions.forEach((action: any) => {
    if (action.addChatItemAction && action.addChatItemAction.item) {
      const itemAction = action.addChatItemAction.item;
      const textItem = itemAction.liveChatTextMessageRenderer;
      if (textItem) {
        const username = textItem.authorName?.simpleText || textItem.authorName?.runs?.[0]?.text || "Unknown";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = textItem.message?.simpleText || textItem.message?.runs?.map((run: any) => run.text).join("") || "";
        messages.push({ username, message, channel: id });
      }

      const superchatItem = itemAction.liveChatPaidMessageRenderer;
      if (superchatItem) {
        const username = superchatItem.authorName?.simpleText || superchatItem.authorName?.runs?.[0]?.text || "Unknown";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = superchatItem.message?.simpleText || superchatItem.message?.runs?.map((r: any) => r.text).join("") || "";
        const amountText = superchatItem.purchaseAmountText?.simpleText || "";

        let amount = 0;
        let currency = "USD";
        if (amountText) {
          const numMatch = amountText.match(/[\d.,]+/);
          if (numMatch) {
            let numStr = numMatch[0];
            if (numStr.includes(",") && numStr.includes(".")) {
              numStr = numStr.replace(/,/g, "");
            } else if (numStr.includes(",") && !numStr.includes(".")) {
              numStr = numStr.replace(/,/g, ".");
            }
            amount = parseFloat(numStr);
            if (isNaN(amount)) amount = 0;
          }
          const currencyMatch = amountText.replace(/[\d.,\s]/g, "");
          if (currencyMatch) {
            currency = currencyMatch;
          }
        }

        let tierColor = undefined;
        if (superchatItem.headerBackgroundColor) {
          const hex = (superchatItem.headerBackgroundColor >>> 0).toString(16);
          tierColor = hex.length === 8 ? `#${hex.slice(2)}` : `#${hex}`;
        }

        superchats.push({ username, message, amountText, amount, currency, tierColor, channel: id });
      }

      const memberItem = itemAction.liveChatMembershipItemRenderer;
      if (memberItem) {
        const username = memberItem.authorName?.simpleText || memberItem.authorName?.runs?.[0]?.text || "Unknown";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tierName = memberItem.headerSubtext?.simpleText || memberItem.headerSubtext?.runs?.map((r: any) => r.text).join("") || "New Member";
        members.push({ username, tierName, channel: id });
      }
    }
  });

  return NextResponse.json({
    messages,
    superchats,
    members
  }, {
    status: 200
  });
};