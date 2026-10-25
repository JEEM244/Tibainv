"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../core.js");

test("search normalization ignores accents and case", () => {
  assert.equal(Core.normalizeSearch("Poción Ámbar"), "pocion ambar");
});

test("import parser accepts a valid Tibainv export", () => {
  const result = Core.parseImportText(JSON.stringify({
    app: "Tibainv", version: 1,
    items: [{ id: "rope", name: "Rope", use: "Subir" }],
    creatures: [{ id: "rat", name: "Rat" }],
    notes: [{ id: "n1", title: "Ruta", body: "Cueva", date: "hoy" }]
  }));
  assert.equal(result.items[0].name, "Rope");
  assert.equal(result.creatures[0].name, "Rat");
  assert.equal(result.notes[0].title, "Ruta");
});

test("import parser rejects malformed JSON and unrelated files", () => {
  assert.throws(() => Core.parseImportText("{"), /JSON válido/);
  assert.throws(() => Core.parseImportText(JSON.stringify({ app: "otra-app", version: 1, items: [], creatures: [] })), /no parece/);
});

test("import parser rejects oversized or missing datasets", () => {
  assert.throws(() => Core.parseImportText(JSON.stringify({ app: "Tibainv", version: 1, items: [], creatures: "no" })), /Faltan/);
  assert.throws(() => Core.parseImportText(JSON.stringify({ app: "Tibainv", version: 1, items: Array(5001).fill({}), creatures: [] })), /máximo/);
});

test("storage helpers gracefully handle unavailable storage", () => {
  const storage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("full"); } };
  assert.deepEqual(Core.readStored(storage, "x", []), []);
  assert.equal(Core.writeStored(storage, "x", []), false);
});

test("import parser keeps hunting records and defaults old backups safely", () => {
  const current = Core.parseImportText(JSON.stringify({
    app: "Tibainv", version: 1, items: [], creatures: [], notes: [],
    hunts: [{ id: "h1", name: "Cueva", kills: 12, notes: "Primera prueba" }]
  }));
  assert.equal(current.hunts[0].name, "Cueva");
  assert.equal(current.hunts[0].kills, 12);
  const legacy = Core.parseImportText(JSON.stringify({ app: "Tibainv", version: 1, items: [], creatures: [] }));
  assert.deepEqual(legacy.hunts, []);
});
test("import parser rejects malformed hunting collection", () => {
  assert.throws(() => Core.parseImportText(JSON.stringify({ app: "Tibainv", version: 1, items: [], creatures: [], hunts: {} })), /cacerías/);
});

test("import parser preserves manual hunting fields", () => {
  const result = Core.parseImportText(JSON.stringify({
    app: "Tibainv", version: 1, items: [], creatures: [], notes: [],
    hunts: [{ id: "hunt-1", name: "Troll cave", world: "Antica", kills: 18, durationMinutes: 45, loot: "gold" }]
  }));
  assert.equal(result.hunts[0].kills, 18);
  assert.equal(result.hunts[0].durationMinutes, 45);
  assert.equal(result.hunts[0].world, "Antica");
});

test("API client uses a fresh local cache without another request", async () => {
  const Api = require("../api.js");
  const originalFetch = global.fetch;
  const originalStorage = global.localStorage;
  const storageMap = new Map();
  global.localStorage = { getItem: k => storageMap.has(k) ? storageMap.get(k) : null, setItem: (k,v) => storageMap.set(k,v) };
  let calls = 0;
  global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ demo: true, seq: ++calls }) });
  try {
    const first = await Api.get("worlds-test-cache", { ttlMs: 60000 });
    const second = await Api.get("worlds-test-cache", { ttlMs: 60000 });
    assert.equal(first.data.demo, true);
    assert.equal(second.fromCache, true);
    assert.equal(calls, 1);
  } finally {
    global.fetch = originalFetch;
    if (originalStorage === undefined) delete global.localStorage; else global.localStorage = originalStorage;
  }
});

test("API client can fall back to cached data after a network failure", async () => {
  const Api = require("../api.js");
  const originalFetch = global.fetch;
  const originalStorage = global.localStorage;
  const storageMap = new Map();
  global.localStorage = { getItem: k => storageMap.has(k) ? storageMap.get(k) : null, setItem: (k,v) => storageMap.set(k,v) };
  global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ available: "before" }) });
  try {
    await Api.get("fallback-test-cache", { ttlMs: 60000 });
    global.fetch = async () => { throw new Error("offline"); };
    const fallback = await Api.get("fallback-test-cache", { ttlMs: 0 });
    assert.equal(fallback.stale, true);
    assert.equal(fallback.data.available, "before");
  } finally {
    global.fetch = originalFetch;
    if (originalStorage === undefined) delete global.localStorage; else global.localStorage = originalStorage;
  }
});

test("character extractor handles the documented v4 response envelope", () => {
  const profile = Core.extractCharacterResponse({
    character: {
      character: { name: "Example Knight", level: 42, vocation: "Elite Knight", world: "Antica", guild: { name: "Guild One" } },
      deaths: [{ time: "today", level: 41, reason: "a rat" }],
      achievements: [{ name: "Test achievement" }],
      account_information: { loyalty_title: "Scout" }
    },
    information: { timestamp: "2026-10-25T00:00:00Z" }
  });
  assert.equal(profile.character.name, "Example Knight");
  assert.equal(profile.deaths[0].reason, "a rat");
  assert.equal(profile.achievements.length, 1);
  assert.equal(profile.accountInformation.loyalty_title, "Scout");
  assert.equal(profile.timestamp, "2026-10-25T00:00:00Z");
});

test("character extractor rejects a response with no character", () => {
  const profile = Core.extractCharacterResponse({ character: {}, information: {} });
  assert.equal(profile.character, null);
  assert.deepEqual(profile.deaths, []);
});
