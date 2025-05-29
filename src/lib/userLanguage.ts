import { headers as getHeaders } from "next/headers";

export const getUserLanguage = async () => {
  const headers = await getHeaders();
  const langByHeader = headers.get("x-lang") || "en";
  return langByHeader;
};
