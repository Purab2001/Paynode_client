import { useCallback, useEffect, useReducer, useRef } from "react";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { getSocket, request } from "@/lib/socket";
import { initialState, reducer } from "@/features/chat/chatState";

const TYPING_VISIBLE_MS = 4000;
const TYPING_REFRESH_MS = 2500;
const TOKEN_REFRESH_MARGIN_MS = 2 * 60 * 1000;

/** Resolves on the socket's next (re)connect, or after a timeout. */
const nextConnect = (socket, timeoutMs = 8000) =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    socket.once("connect", () => {
      clearTimeout(timer);
      resolve();
    });
  });

/**
 * Connects to the chat server while the chat screen is open and keeps its state in step with it.
 * `selfId` is the signed-in user's id, used to tell their own messages apart.
 */
export function useChat(selfId) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  const lastTypingSent = useRef(0);

  // Socket callbacks read the latest state through this ref instead of re-subscribing on every change.
  useEffect(() => {
    stateRef.current = state;
  });

  const loadLists = useCallback(async () => {
    const [channels, people] = await Promise.all([request("channels:list"), request("people:list")]);
    dispatch({ type: "lists", channels: channels.channels, people: people.people });
  }, []);

  const loadLatest = useCallback(async (channel) => {
    const { messages, hasMore } = await request("messages:history", { channel });
    dispatch({ type: "history/latest", channel, messages, hasMore });
  }, []);

  useEffect(() => {
    const socket = getSocket();
    let refreshTimer;

    // The server only checks the Firebase ID token when we connect, and those last an hour. Reconnect a little
    // before it lapses (the handshake picks up a fresh token) so a long session never has an action refused.
    const scheduleTokenRefresh = async () => {
      clearTimeout(refreshTimer);
      const token = await auth.currentUser?.getIdTokenResult();
      if (!token) return;
      const wait = Date.parse(token.expirationTime) - Date.now() - TOKEN_REFRESH_MARGIN_MS;
      refreshTimer = setTimeout(() => {
        socket.disconnect();
        socket.connect();
      }, Math.max(wait, 30_000));
    };

    const onConnect = async () => {
      dispatch({ type: "status", status: "online" });
      scheduleTokenRefresh().catch(() => {});
      try {
        await loadLists();
        // After a reconnect, catch up on whatever was missed in the open conversation.
        if (stateRef.current.active) await loadLatest(stateRef.current.active);
      } catch (err) {
        toast.error(err.message);
      }
    };
    const onDisconnect = (reason) => {
      // "io server disconnect" means the server closed us (deactivated, token lapsed). Socket.IO won't retry
      // on its own in that case, so reconnect with a fresh token unless the account was cut off.
      dispatch({ type: "status", status: "offline" });
      if (reason === "io server disconnect") socket.connect();
    };
    const onConnectError = (err) => {
      const code = err.data?.code;
      if (code === "ACCOUNT_DEACTIVATED" || code === "PROFILE_INCOMPLETE") dispatch({ type: "status", status: "denied", error: err.message });
      else dispatch({ type: "status", status: "offline", error: err.message });
    };

    const onMessage = (message) => {
      dispatch({ type: "message/incoming", message, own: message.sender.id === selfId, hidden: document.hidden });
      // Someone started a conversation with us: it isn't in our list yet.
      if (message.channel.startsWith("dm:") && !stateRef.current.channels.some((c) => c.id === message.channel)) loadLists().catch(() => {});
    };
    const onDeleted = ({ id, channel }) => dispatch({ type: "message/deleted", id, channel });
    const onPresence = ({ userId, online }) => dispatch({ type: "presence", userId, online });
    const onTyping = (e) => dispatch({ type: "typing", ...e, until: Date.now() + TYPING_VISIBLE_MS });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("message:new", onMessage);
    socket.on("message:deleted", onDeleted);
    socket.on("presence", onPresence);
    socket.on("typing", onTyping);
    dispatch({ type: "status", status: "connecting" });
    socket.connect();

    const prune = setInterval(() => dispatch({ type: "typing/prune", now: Date.now() }), 1000);

    return () => {
      clearInterval(prune);
      clearTimeout(refreshTimer);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("message:new", onMessage);
      socket.off("message:deleted", onDeleted);
      socket.off("presence", onPresence);
      socket.off("typing", onTyping);
      socket.disconnect();
    };
  }, [selfId, loadLists, loadLatest]);

  const open = useCallback(
    async (id) => {
      dispatch({ type: "open", id });
      if (stateRef.current.threads[id]?.loaded) return;
      try {
        await loadLatest(id);
      } catch (err) {
        toast.error(err.message);
      }
    },
    [loadLatest],
  );

  /** Start (or resume) a private conversation with someone from the people list. */
  const openPerson = useCallback(
    (person) => {
      dispatch({ type: "dm/open", channel: { id: person.channel, type: "dm", name: person.name, partner: { ...person, online: !!stateRef.current.online[person.id] } } });
      return open(person.channel);
    },
    [open],
  );

  const loadOlder = useCallback(async () => {
    const { active, threads } = stateRef.current;
    const current = threads[active];
    if (!current?.hasMore || current.loadingOlder) return;
    const before = current.items.find((m) => !m.status)?.id; // oldest message the server knows about
    dispatch({ type: "history/loading-older", channel: active });
    try {
      const { messages, hasMore } = await request("messages:history", { channel: active, before });
      dispatch({ type: "history/older", channel: active, messages, hasMore });
    } catch (err) {
      dispatch({ type: "history/older", channel: active, messages: [], hasMore: true });
      toast.error(err.message);
    }
  }, []);

  const deliver = useCallback(async (channel, text, clientId) => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        const { message } = await request("message:send", { channel, text });
        dispatch({ type: "message/sent", channel, clientId, message });
        return;
      } catch (err) {
        // The server drops the connection when the token has lapsed. Send once more after the client reconnects.
        if (err.code === "TOKEN_EXPIRED" && attempt === 0) {
          await nextConnect(getSocket());
          continue;
        }
        dispatch({ type: "message/failed", channel, clientId, error: err.message });
        return;
      }
    }
  }, []);

  const send = useCallback(
    (text) => {
      const { active } = stateRef.current;
      const clientId = crypto.randomUUID();
      // Show it straight away; it's replaced by the server's copy once acknowledged.
      dispatch({
        type: "message/pending",
        message: { id: clientId, clientId, status: "sending", channel: active, text, createdAt: new Date().toISOString(), sender: { id: selfId }, deleted: false },
      });
      lastTypingSent.current = 0;
      request("typing", { channel: active, typing: false }).catch(() => {});
      return deliver(active, text, clientId);
    },
    [selfId, deliver],
  );

  const retry = useCallback(
    (message) => {
      dispatch({ type: "message/retrying", channel: message.channel, clientId: message.clientId });
      return deliver(message.channel, message.text, message.clientId);
    },
    [deliver],
  );

  const discard = useCallback((message) => dispatch({ type: "message/discard", channel: message.channel, clientId: message.clientId }), []);

  const remove = useCallback(async (message) => {
    try {
      await request("message:delete", { id: message.id });
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  /** Tell others we're typing, at most every couple of seconds. */
  const notifyTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingSent.current < TYPING_REFRESH_MS) return;
    lastTypingSent.current = now;
    request("typing", { channel: stateRef.current.active, typing: true }).catch(() => {});
  }, []);

  return { state, open, openPerson, loadOlder, send, retry, discard, remove, notifyTyping };
}
