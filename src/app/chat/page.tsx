import { KickContextProvider } from "@/contexts/kickContext";
import { MessagesContextProvider } from "@/contexts/messagesContext";
import { TmiContextProvider } from "@/contexts/tmiContext";
import { YoutubeContextProvider } from "@/contexts/youtubeContext";
import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import { ChatViewClient } from "@/component/chat"

export default async function Chat() {
  const context = await getContext();
  const params = new URLSearchParams(context.search);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers : React.FC<any>[] = [];
  if (params.has("twitch")) {
    providers.push(TmiContextProvider);
  }
  if (params.has("youtube")) {
    providers.push(YoutubeContextProvider);
  }
  if (params.has("kick")) {
    providers.push(KickContextProvider);
  }
  if (providers.length === 0) {
    redirect('/');
    return;
  }
  return [MessagesContextProvider, ...providers].reduceRight(
    (children, Provider) => (
      <Provider {...({ isChat: true })}>
        {children}
      </Provider>
    ),
    <ChatViewClient />
  );
}