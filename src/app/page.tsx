import { headers as getHeaders } from "next/headers";
import MessagesLayout from "@/layouts/messagesLayout";
import HomeLayout from "@/layouts/homeLayout";
import { PageContext } from "@/type";

const Layouts = [
  MessagesLayout,
  HomeLayout
]

export default async function Page() {
  const headers = await getHeaders();
  const context: PageContext = {
    url: headers.get("x-url") || "",
    pathname: headers.get("x-pathname") || "",
    search: headers.get("x-search") || "",
    lang: headers.get("x-lang") || "en",
  }
  const matchedLayout = await Promise.all(
    Layouts.map(async (layout) => {
      const isMatch = await layout.Evaluator(context);
      return isMatch ? layout.Layout : null;
    })
  ).then(layouts => layouts.filter(layout => layout !== null));
  const LayoutComponent = matchedLayout[0]
  return <LayoutComponent context={context} />;
}
