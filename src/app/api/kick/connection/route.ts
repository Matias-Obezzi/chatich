export const dynamic = "force-dynamic";

const isSafe = (value: unknown) => typeof value === "string" && /^[\w-]+$/.test(value);

// Runs on the server because web.kick.com's CORS rejects chatich.vercel.app.
export const GET = async () => {
  try {
    const response = await fetch("https://web.kick.com/api/v1/realtime/connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        client: { id: crypto.randomUUID(), type: "web" },
        capabilities: { accepted_providers: [{ provider: "pusher" }] },
      }),
    });
    const { data } = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pusher = data?.connections?.find((connection: any) => connection.provider === "pusher");
    const { app_key, cluster } = pusher?.credentials ?? {};
    // These end up in the WebSocket host name, so don't trust them blindly.
    if (isSafe(app_key) && isSafe(cluster)) {
      return Response.json({ app_key, cluster });
    }
    console.error("Unexpected Kick realtime response:", response.status);
  } catch (error) {
    console.error("Error getting Kick realtime credentials:", error);
  }
  return new Response("Failed to get Kick credentials", { status: 502 });
};
