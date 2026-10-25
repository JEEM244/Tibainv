"use strict";

/**
 * Pure data helpers shared by Tibainv UI and Node tests.
 * No network access, account credentials, or browser APIs are required here.
 */
const TibainvCore = (() => {
  const MAX_ITEMS = 5000;
  const MAX_CREATURES = 5000;
  const MAX_NOTES = 10000;
  const MAX_TEXT = 10000;

  function normalizeSearch(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es");
  }

  function readStored(storage, key, fallback) {
    try {
      const value = storage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function writeStored(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function boundedString(value, max = 500) {
    if (value === undefined || value === null) return "";
    return String(value).slice(0, max);
  }

  function normalizeRecords(records, schema) {
    return records.map((record, index) => {
      if (!record || typeof record !== "object" || Array.isArray(record)) {
        throw new Error("El archivo contiene un registro inválido (posición " + (index + 1) + ").");
      }
      const result = {};
      for (const [key, maxLength] of Object.entries(schema)) {
        if (record[key] !== undefined && record[key] !== null &&
            typeof record[key] !== "string" && typeof record[key] !== "number" &&
            typeof record[key] !== "boolean" && !Array.isArray(record[key])) {
          throw new Error("El campo '" + key + "' contiene un valor no compatible.");
        }
        if (Array.isArray(record[key])) {
          result[key] = record[key].slice(0, 500).map(v => boundedString(v, 300));
        } else if (typeof record[key] === "boolean" || typeof record[key] === "number") {
          result[key] = record[key];
        } else if (record[key] !== undefined && record[key] !== null) {
          result[key] = boundedString(record[key], maxLength);
        } else {
          result[key] = "";
        }
      }
      if (!result.id) result.id = "import-" + (index + 1);
      return result;
    });
  }

  function parseImportText(text) {
    let payload;
    try {
      payload = JSON.parse(String(text));
    } catch {
      throw new Error("El archivo no contiene JSON válido.");
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("La estructura del archivo no es válida.");
    }
    if (payload.app !== "Tibainv") {
      throw new Error("Este archivo no parece una exportación de Tibainv.");
    }
    if (![1, 2].includes(Number(payload.version))) {
      throw new Error("La versión del archivo no es compatible.");
    }
    if (!Array.isArray(payload.items) || !Array.isArray(payload.creatures)) {
      throw new Error("Faltan las listas de objetos o criaturas.");
    }
    const notes = payload.notes === undefined ? [] : payload.notes;
    const hunts = payload.hunts === undefined ? [] : payload.hunts;
    if (!Array.isArray(notes)) throw new Error("La lista de notas no es válida.");
    if (!Array.isArray(hunts)) throw new Error("La lista de cacerías no es válida.");
    if (payload.items.length > MAX_ITEMS || payload.creatures.length > MAX_CREATURES || notes.length > MAX_NOTES || hunts.length > MAX_NOTES) {
      throw new Error("El archivo supera el máximo de registros permitido.");
    }
    return {
      items: normalizeRecords(payload.items, {
        id: 120, name: 300, category: 100, icon: 40, weight: 100, use: MAX_TEXT,
        source: 500, race: 300, kind: 100, danger: 100, xp: 100, notes: MAX_TEXT,
        loot: MAX_TEXT, image_url: 1000
      }),
      creatures: normalizeRecords(payload.creatures, {
        id: 300, name: 300, race: 300, kind: 100, danger: 100, xp: 100,
        notes: MAX_TEXT, loot: MAX_TEXT, image_url: 1000, hitpoints: 100,
        experience_points: 100, behaviour: MAX_TEXT, description: MAX_TEXT,
        immune: MAX_TEXT, strong: MAX_TEXT, weakness: MAX_TEXT, healed: MAX_TEXT,
        loot_list: MAX_TEXT
      }),
      notes: normalizeRecords(notes, { id: 120, title: 300, body: 3000, date: 100 }),
      hunts: normalizeRecords(hunts, { id: 120, name: 300, world: 100, startedAt: 100, endedAt: 100, durationMinutes: 100, kills: 1000, loot: 3000, notes: 3000 })
    };
  }

  function extractCharacterResponse(json) {
    const root = json?.character && typeof json.character === "object"
      ? json.character
      : (json?.characters && typeof json.characters === "object" ? json.characters : (json?.data || {}));
    const candidate = root.character || root.data || json?.data?.character || null;
    const character = candidate && typeof candidate === "object" && !Array.isArray(candidate) ? candidate : null;
    const deaths = root.deaths || candidate?.deaths || json?.character?.deaths || [];
    const achievements = root.achievements || candidate?.achievements || json?.character?.achievements || [];
    const accountInformation = root.account_information || candidate?.account_information || {};
    return {
      character,
      deaths: Array.isArray(deaths) ? deaths : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      accountInformation: accountInformation && typeof accountInformation === "object" ? accountInformation : {},
      timestamp: json?.information?.timestamp || ""
    };
  }

  return Object.freeze({ normalizeSearch, readStored, writeStored, parseImportText, extractCharacterResponse });
})();

if (typeof module !== "undefined" && module.exports) module.exports = TibainvCore;
if (typeof window !== "undefined") window.TibainvCore = TibainvCore;
