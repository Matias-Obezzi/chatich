import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { GET } from "../../app/api/kick/connection/route.ts";
import { createWebSocket } from "./webSocket.ts";

const realFetch = globalThis.fetch;
const realWebSocket = globalThis.WebSocket;
const realConsoleError = console.error;

globalThis.WebSocket = class {
  constructor(url) {
    this.url = url;
  }
};
console.error = () => {};

afterEach(() => {
  globalThis.fetch = realFetch;
});

test.after(() => {
  globalThis.WebSocket = realWebSocket;
  console.error = realConsoleError;
});

const kickAnswers = (connections) => {
  globalThis.fetch = async () => Response.json({ data: { connections, mode: "websocket" } });
};

test("route returns the pusher credentials Kick hands out", async () => {
  kickAnswers([
    { provider: "centrifugo", credentials: { url: "wss://example.test" } },
    { provider: "pusher", credentials: { app_key: "newkey", cluster: "eu" } },
  ]);
  const response = await GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { app_key: "newkey", cluster: "eu" });
});

test("route rejects missing or unsafe credentials", async () => {
  kickAnswers([{ provider: "centrifugo", credentials: { url: "wss://example.test" } }]);
  assert.equal((await GET()).status, 502);
  kickAnswers([{ provider: "pusher", credentials: { app_key: "key", cluster: "evil.test/" } }]);
  assert.equal((await GET()).status, 502);
});

test("route answers 502 when Kick is unreachable", async () => {
  globalThis.fetch = async () => {
    throw new Error("down");
  };
  assert.equal((await GET()).status, 502);
});

test("socket connects with the credentials from the route", async () => {
  globalThis.fetch = async () => Response.json({ app_key: "newkey", cluster: "eu" });
  const socket = await createWebSocket();
  assert.match(socket.url, /^wss:\/\/ws-eu\.pusher\.com\/app\/newkey\?/);
});

test("socket falls back to the fixed key when the route fails", async () => {
  globalThis.fetch = async () => new Response("nope", { status: 502 });
  assert.match((await createWebSocket()).url, /^wss:\/\/ws-us2\.pusher\.com\/app\/34bf7a0ff419a2a775b9\?/);
  globalThis.fetch = async () => {
    throw new Error("offline");
  };
  assert.match((await createWebSocket()).url, /^wss:\/\/ws-us2\.pusher\.com\/app\/34bf7a0ff419a2a775b9\?/);
});
