export function createWebSocket() {
  const urlParams = new URLSearchParams({
    protocol: "7",
    client: "js",
    version: "7.4.0",
    flash: "false"
  });
  const url = `wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?${urlParams.toString()}`;
  const socket = new WebSocket(url);
  return socket;
};