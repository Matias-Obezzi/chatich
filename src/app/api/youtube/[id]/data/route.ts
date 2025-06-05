import { getYtInitialDataContent } from "@/lib/youtube";
import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

export type YoutubeDataType = {
  followers: string;
  views: string;
  title: string;
  description: string;
}

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const content = await getYtInitialDataContent(`https://www.youtube.com/watch?v=${id}`, request.headers);
  const contents = content?.twoColumnWatchNextResults?.results?.results?.contents;
  if (!contents || !contents.length) {
    console.error("No contents found in ytInitialData");
    return new Response("Failed to load YouTube data", { status: 500 });
  }
  const videoPrimaryInfo = contents.find((c: any) => c.videoPrimaryInfoRenderer);
  const videoSecondaryInfo = contents.find((c: any) => c.videoSecondaryInfoRenderer);
  const title = videoPrimaryInfo.videoPrimaryInfoRenderer.title.runs[0].text;
  const liveViewCount = videoPrimaryInfo.videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount.runs[0].text;
  const description = videoSecondaryInfo.videoSecondaryInfoRenderer.attributedDescription.content;
  const subscribers = videoSecondaryInfo.videoSecondaryInfoRenderer.owner.videoOwnerRenderer.subscriberCountText.simpleText;
  const subscribersParts = subscribers?.split(" ");
  const subscribersCount = subscribersParts?.[0].replace(/,/g, "");
  const data: YoutubeDataType = {
    followers: subscribersCount ? (subscribersCount.includes("K") ? subscribersCount.slice(0, -2) + "K" : subscribersCount) : "0",
    views: liveViewCount?.replace(/,/g, "") || "0",
    title: title || "No title",
    description: description || "No description",
  }
  return NextResponse.json({
    data,
  });
}