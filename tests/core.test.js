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
