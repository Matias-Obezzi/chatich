import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const ignore = [
    "/((_next/static|_next/image|favicon.ico).*)",
    "/sitemap?.*.xml",
    "/robots.txt",
  ];

  const response = NextResponse.next();

  if (ignore.some((path) => request.nextUrl.pathname.match(path))) {
    return response;
  }

  response.headers.set("x-url", request.url);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  response.headers.set("x-search", request.nextUrl.search);
  const lang = new URLSearchParams(request.nextUrl.search || '').get('lang') || request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || "en";
  const allowedLangs = ["en", "es", "pt"];
  response.headers.set("x-lang", allowedLangs.includes(lang) ? lang : "en");

  return response;
}