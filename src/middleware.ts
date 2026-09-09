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
  const allowedLangs = ["en", "es", "pt"];
  const explicitLang = request.nextUrl.searchParams.get("lang");
  
  let lang = "en";
  if (explicitLang && allowedLangs.includes(explicitLang)) {
    lang = explicitLang;
  } else {
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
      const parsedLangs = acceptLanguage
        .split(",")
        .map((l) => {
          const [locale, qValue] = l.split(";");
          const q = qValue && qValue.trim().startsWith("q=") ? parseFloat(qValue.trim().slice(2)) : 1;
          const code = locale.trim().substring(0, 2).toLowerCase();
          return { code, q: isNaN(q) ? 1 : q };
        })
        .sort((a, b) => b.q - a.q);
        
      const detected = parsedLangs.find((l) => allowedLangs.includes(l.code));
      if (detected) {
        lang = detected.code;
      }
    }
  }

  response.headers.set("x-lang", lang);

  return response;
}