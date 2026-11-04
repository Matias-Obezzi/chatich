// Used only when /api/kick/connection fails. Kick rotates this key without notice.
const FALLBACK_CREDENTIALS = { app_key: "34bf7a0ff419a2a775b9", cluster: "us2" };

async function getCredentials(): Promise<typeof FALLBACK_CREDENTIALS> {
  try {
    const response = await fetch("/api/kick/connection", { cache: "no-store" });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error getting Kick credentials:", error);
  }
  return FALLBACK_CREDENTIALS;
}

export async function createWebSocket() {
  const { app_key, cluster } = await getCredentials();
  const urlParams = new URLSearchParams({
    protocol: "7",
    client: "js",
    version: "7.4.0",
    flash: "false"
  });
  const url = `wss://ws-${cluster}.pusher.com/app/${app_key}?${urlParams.toString()}`;
  const socket = new WebSocket(url);
  return socket;
};
