// Pure state for the chat screen, kept apart from the socket so it can be unit tested.

export const initialState = {
  status: "connecting", // connecting | online | offline | denied
  error: null,
  channels: [],
  people: [],
  active: null,
  threads: {}, // channelId -> { items, hasMore, loaded, loadingOlder }
  online: {}, // userId -> boolean
  typing: {}, // channelId -> { userId -> { name, until } }
  unread: {}, // channelId -> number
};

const thread = (state, channel) => state.threads[channel] ?? { items: [], hasMore: false, loaded: false, loadingOlder: false };
const withThread = (state, channel, patch) => ({ ...state, threads: { ...state.threads, [channel]: { ...thread(state, channel), ...patch } } });
const mapItems = (state, channel, fn) => withThread(state, channel, { items: fn(thread(state, channel).items) });

export function reducer(state, action) {
  switch (action.type) {
    case "status":
      return { ...state, status: action.status, error: action.error ?? null };

    case "lists": {
      const online = { ...state.online };
      for (const p of action.people ?? []) online[p.id] = p.online;
      for (const c of action.channels ?? []) if (c.partner) online[c.partner.id] = c.partner.online;
      return { ...state, channels: action.channels ?? state.channels, people: action.people ?? state.people, online };
    }

    case "dm/open": {
      // A conversation that has no messages yet isn't in the server's list, so add it locally.
      if (state.channels.some((c) => c.id === action.channel.id)) return state;
      return { ...state, channels: [...state.channels, action.channel] };
    }

    case "open":
      return { ...state, active: action.id, unread: { ...state.unread, [action.id]: 0 } };

    case "history/latest": {
      // Keep any messages still waiting to be sent, and add the server's latest page.
      const waiting = thread(state, action.channel).items.filter((m) => m.status);
      return withThread(state, action.channel, { items: [...action.messages, ...waiting], hasMore: action.hasMore, loaded: true });
    }

    case "history/loading-older":
      return withThread(state, action.channel, { loadingOlder: true });

    case "history/older":
      return withThread(state, action.channel, {
        items: [...action.messages, ...thread(state, action.channel).items],
        hasMore: action.hasMore,
        loadingOlder: false,
      });

    case "message/incoming": {
      const { message, own } = action;
      let next = mapItems(state, message.channel, (items) => (items.some((m) => m.id === message.id) ? items : [...items, message]));
      // Count it as unread unless the person is looking at that conversation right now.
      if (!own && (state.active !== message.channel || action.hidden)) {
        next = { ...next, unread: { ...next.unread, [message.channel]: (next.unread[message.channel] ?? 0) + 1 } };
      }
      return next;
    }

    case "message/pending":
      return mapItems(state, action.message.channel, (items) => [...items, action.message]);

    case "message/sent":
      // The server may already have pushed this message to us; if so just drop the placeholder.
      return mapItems(state, action.channel, (items) =>
        items.some((m) => m.id === action.message.id)
          ? items.filter((m) => m.clientId !== action.clientId)
          : items.map((m) => (m.clientId === action.clientId ? action.message : m)),
      );

    case "message/failed":
      return mapItems(state, action.channel, (items) => items.map((m) => (m.clientId === action.clientId ? { ...m, status: "failed", error: action.error } : m)));

    case "message/retrying":
      return mapItems(state, action.channel, (items) => items.map((m) => (m.clientId === action.clientId ? { ...m, status: "sending", error: undefined } : m)));

    case "message/discard":
      return mapItems(state, action.channel, (items) => items.filter((m) => m.clientId !== action.clientId));

    case "message/deleted":
      return mapItems(state, action.channel, (items) => items.map((m) => (m.id === action.id ? { ...m, deleted: true, text: "" } : m)));

    case "presence":
      return { ...state, online: { ...state.online, [action.userId]: action.online } };

    case "typing": {
      const forChannel = { ...(state.typing[action.channel] ?? {}) };
      if (action.typing) forChannel[action.user.id] = { name: action.user.name, until: action.until };
      else delete forChannel[action.user.id];
      return { ...state, typing: { ...state.typing, [action.channel]: forChannel } };
    }

    case "typing/prune": {
      let changed = false;
      const typing = {};
      for (const [channel, users] of Object.entries(state.typing)) {
        const live = Object.entries(users).filter(([, u]) => u.until > action.now);
        if (live.length !== Object.keys(users).length) changed = true;
        typing[channel] = Object.fromEntries(live);
      }
      return changed ? { ...state, typing } : state;
    }

    default:
      return state;
  }
}

export const typingNames = (state, channel, selfId) =>
  Object.entries(state.typing[channel] ?? {})
    .filter(([id]) => id !== selfId)
    .map(([, u]) => u.name);
