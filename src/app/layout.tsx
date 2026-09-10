import type { Metadata } from "next";
import { getUserLanguage } from "@/lib/userLanguage";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-chakra',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Chatich",
  description: "Chatich is a web application that displays live chat messages from Twitch, Kick, and YouTube channels.",
  keywords: ["chat", "twitch", "kick", "youtube", "live", "messages"],
  authors: [{
    name: "Matias Obezzi",
    url: "https://matias-obezzi.vercel.app",
  }],
  creator: "Matias Obezzi",
  openGraph: {
    title: "Chatich",
    description: "Chatich is a web application that displays live chat messages from Twitch, Kick, and YouTube channels.",
    url: "https://chatich.vercel.app",
    siteName: "Chatich",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "Chatich Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatich",
    description: "Chatich is a web application that displays live chat messages from Twitch, Kick, and YouTube channels.",
    images: ["/icon.svg"],
    creator: "@matiasobezzi",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getUserLanguage()
  return (
    <html lang={lang} className={`dark bg-transparent ${chakra.variable} ${inter.variable} ${mono.variable}`}>
      <body className="antialiased bg-transparent font-inter text-text">
        {children}
      </body>
    </html>
  );
}
