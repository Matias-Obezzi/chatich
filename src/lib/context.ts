import { headers as getHeaders } from "next/headers";
import { PageContext } from "@/type";

export const getContext = async () : Promise<PageContext> => {
  const headers = await getHeaders();
  return {
    url: headers.get("x-url") || "",
    pathname: headers.get("x-pathname") || "",
    search: headers.get("x-search") || "",
    lang: headers.get("x-lang") || "en",
  }
}