import { JSDOM } from "jsdom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseYtInitialData = (text: string): any => {
  let match = text.match(/window\["ytInitialData"\]\s*=\s*(\{.*?\});/)?.[0];
  if (match) {
    return JSON.parse(match.replace(/window\["ytInitialData"\]\s*=\s*/, "").replace(";", ""));
  }
  match = text.match(/var ytInitialData = (\{.*?\});/)?.[0];
  if (match) {
    return JSON.parse(match.replace(/var ytInitialData = /, "").replace(";", ""));
  }
  return {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getYtInitialDataContent = async (url: string, headers: Headers): Promise<any> => {
  const response = await fetch(url, {
    cache: "no-cache",
    headers
  });
  if (!response.ok) {
    throw new Error("Failed to fetch YouTube");
  }
  const text = await response.text();
  const document = new JSDOM(text).window.document;
  if (!document) {
    console.error("Failed to load document");
    throw new Error("Failed to load document");
  }
  const ytInitialData = [...document.querySelectorAll("script")].filter(el => el.textContent?.includes("ytInitialData"))?.[0]?.textContent;
  if (!ytInitialData) {
    console.error("Failed to find ytInitialData in the document");
    throw new Error("Failed to find ytInitialData in the document");
  }
  const data = parseYtInitialData(ytInitialData);
  if (!data) {
    console.error("Failed to parse ytInitialData");
    throw new Error("Failed to parse ytInitialData");
  }
  if (!data || !data.contents) {
    console.error("Invalid ytInitialData structure", data);
    throw new Error("Failed to load YouTube data");
  }
  return data.contents;
};