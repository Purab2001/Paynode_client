import { describe, expect, it } from "vitest";
import { initialState, reducer, typingNames } from "@/features/chat/chatState";

const msg = (id, extra = {}) => ({ id, channel: "general", text: id, sender: { id: "u2" }, createdAt: "2026-10-28T09:00:00.000Z", ...extra });
const run = (state, ...actions) => actions.reduce(reducer, state);
const items = (state, channel = "general") => state.threads[channel].items.map((m) => m.id);

describe("messages", () => {
  it("shows a sent message at once and swaps in the server copy when acknowledged", () => {
    const pending = msg("c1", { clientId: "c1", status: "sending" });
    let state = run(initialState, { type: "message/pending", message: pending });
    expect(state.threads.general.items[0].status).toBe("sending");

    state = run(state, { type: "message/sent", channel: "general", clientId: "c1", message: msg("m1") });
    expect(items(state)).toEqual(["m1"]);
    expect(state.threads.general.items[0].status).toBeUndefined();
  });

  it("doesn't duplicate a message the server pushed before acknowledging it", () => {
    const state = run(
      initialState,
      { type: "message/pending", message: msg("c1", { clientId: "c1", status: "sending" }) },
      { type: "message/incoming", message: msg("m1"), own: true },
      { type: "message/sent", channel: "general", clientId: "c1", message: msg("m1") },
    );
    expect(items(state)).toEqual(["m1"]);
  });

  it("marks failures and lets them be retried or discarded", () => {
    let state = run(initialState, { type: "message/pending", message: msg("c1", { clientId: "c1", status: "sending" }) }, { type: "message/failed", channel: "general", clientId: "c1", error: "offline" });
    expect(state.threads.general.items[0]).toMatchObject({ status: "failed", error: "offline" });

    state = run(state, { type: "message/retrying", channel: "general", clientId: "c1" });
    expect(state.threads.general.items[0]).toMatchObject({ status: "sending", error: undefined });

    state = run(state, { type: "message/discard", channel: "general", clientId: "c1" });
    expect(items(state)).toEqual([]);
  });

  it("ignores a message it already has", () => {
    const state = run(initialState, { type: "message/incoming", message: msg("m1"), own: false }, { type: "message/incoming", message: msg("m1"), own: false });
    expect(items(state)).toEqual(["m1"]);
  });

  it("blanks a deleted message but keeps its place", () => {
    const state = run(initialState, { type: "message/incoming", message: msg("m1"), own: false }, { type: "message/deleted", channel: "general", id: "m1" });
    expect(state.threads.general.items[0]).toMatchObject({ id: "m1", deleted: true, text: "" });
  });
});

describe("history", () => {
  it("prepends older pages and keeps unsent messages after the latest page", () => {
    let state = run(
      initialState,
      { type: "message/pending", message: msg("c1", { clientId: "c1", status: "sending" }) },
      { type: "history/latest", channel: "general", messages: [msg("m3"), msg("m4")], hasMore: true },
    );
    expect(items(state)).toEqual(["m3", "m4", "c1"]);
    expect(state.threads.general).toMatchObject({ hasMore: true, loaded: true });

    state = run(state, { type: "history/loading-older", channel: "general" }, { type: "history/older", channel: "general", messages: [msg("m1"), msg("m2")], hasMore: false });
    expect(items(state)).toEqual(["m1", "m2", "m3", "m4", "c1"]);
    expect(state.threads.general).toMatchObject({ hasMore: false, loadingOlder: false });
  });
});

describe("unread counts", () => {
  it("counts messages in conversations that aren't open, never your own, and clears on open", () => {
    let state = run(initialState, { type: "open", id: "general" });
    state = run(state, { type: "message/incoming", message: msg("m1", { channel: "staff" }), own: false }, { type: "message/incoming", message: msg("m2", { channel: "staff" }), own: false });
    expect(state.unread.staff).toBe(2);

    state = run(state, { type: "message/incoming", message: msg("m3"), own: false });
    expect(state.unread.general ?? 0).toBe(0); // the open conversation is being read

    state = run(state, { type: "message/incoming", message: msg("m4", { channel: "staff", sender: { id: "me" } }), own: true });
    expect(state.unread.staff).toBe(2);

    state = run(state, { type: "open", id: "staff" });
    expect(state.unread.staff).toBe(0);
  });

  it("counts messages as unread when the tab is hidden, even in the open conversation", () => {
    const state = run(initialState, { type: "open", id: "general" }, { type: "message/incoming", message: msg("m1"), own: false, hidden: true });
    expect(state.unread.general).toBe(1);
  });
});

describe("presence, lists and typing", () => {
  it("tracks who is online from the lists and from live updates", () => {
    let state = run(initialState, {
      type: "lists",
      channels: [{ id: "dm:a:b", type: "dm", partner: { id: "u2", online: true } }],
      people: [{ id: "u3", online: false }],
    });
    expect(state.online).toEqual({ u2: true, u3: false });
    state = run(state, { type: "presence", userId: "u3", online: true });
    expect(state.online.u3).toBe(true);
  });

  it("adds a not-yet-started conversation once", () => {
    const dm = { id: "dm:a:b", type: "dm", name: "Hana" };
    const state = run(initialState, { type: "dm/open", channel: dm }, { type: "dm/open", channel: dm });
    expect(state.channels).toEqual([dm]);
  });

  it("shows who is typing and drops them after they go quiet, but never yourself", () => {
    let state = run(
      initialState,
      { type: "typing", channel: "general", user: { id: "u2", name: "Ann" }, typing: true, until: 5000 },
      { type: "typing", channel: "general", user: { id: "me", name: "Me" }, typing: true, until: 5000 },
    );
    expect(typingNames(state, "general", "me")).toEqual(["Ann"]);

    expect(run(state, { type: "typing/prune", now: 4000 })).toBe(state); // nothing expired: same object, no re-render
    state = run(state, { type: "typing/prune", now: 6000 });
    expect(typingNames(state, "general", "me")).toEqual([]);

    state = run(state, { type: "typing", channel: "general", user: { id: "u2", name: "Ann" }, typing: true, until: 9000 }, { type: "typing", channel: "general", user: { id: "u2", name: "Ann" }, typing: false });
    expect(typingNames(state, "general", "me")).toEqual([]);
  });
});
