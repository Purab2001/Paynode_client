import { io } from "socket.io-client";
import { auth } from "@/lib/firebase";

let socket;

/**
 * One shared connection to the chat server. It is created on first use and not connected until
 * the chat screen asks. The auth callback runs on every (re)connect, so a long-lived tab always
 * presents a fresh Firebase ID token.
 */
export function getSocket() {
  socket ??= io(import.meta.env.VITE_REALTIME_URL, {
    autoConnect: false,
    transports: ["websocket"],
    auth: async (cb) => cb({ token: await auth.currentUser?.getIdToken() }),
  });
  return socket;
}

/** Emit an event and wait for the server's `{ ok, ... }` acknowledgement. Rejects with the server's error. */
export function request(event, payload) {
  return new Promise((resolve, reject) => {
    getSocket()
      .timeout(8000)
      .emit(event, payload, (timedOut, res) => {
        if (timedOut) return reject(Object.assign(new Error("Chat isn't responding. Check your connection."), { code: "TIMEOUT" }));
        if (!res?.ok) return reject(Object.assign(new Error(res?.error?.message ?? "Something went wrong."), { code: res?.error?.code }));
        resolve(res);
      });
  });
}
