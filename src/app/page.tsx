import { getContext } from "@/lib/context";
import Landing from "@/component/landing/Landing";

export default async function Page() {
  const context = await getContext();
  return <Landing lang={context.lang} />;
}
