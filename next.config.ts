import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    if (process.env.NODE_ENV === "development") {
      return [
      {
        source: "/api/youtube/:id",
        destination: "https://www.youtube.com/live_chat?is_popout=1&v=:id&embed_domain=localhost",
      }
    ]
    }
    return [
      {
        source: "/api/youtube/:id",
        destination: "https://www.youtube.com/live_chat?is_popout=1&v=:id&embed_domain=chatich.vercel.app"
      }
    ]
  }
};

export default nextConfig;
