import { PageContext } from "@/type";
import { KickContextProvider } from "../contexts/kickContext";
import { MessagesContextProvider } from "../contexts/messagesContext";
import { TmiContextProvider } from "../contexts/tmiContext";
import { YoutubeContextProvider } from "../contexts/youtubeContext";
import ChannelPage from "../pages/channel";

function Layout() {
  return (
    <MessagesContextProvider>
      <TmiContextProvider>
        <KickContextProvider>
          <YoutubeContextProvider>
            <ChannelPage />
          </YoutubeContextProvider>
        </KickContextProvider>
      </TmiContextProvider>
    </MessagesContextProvider>
  );
}

async function Evaluator(context: PageContext) {
  const params = new URLSearchParams(context.search);
  return params.has('twitch') || params.has('youtube') || params.has('kick')
}

const MessagesLayout = {
  Layout,
  Evaluator
}

export default MessagesLayout;