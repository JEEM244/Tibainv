"use strict";

/**
 * Public item reference lookup. Results come from TibiaWiki (Fandom).
 * Requests are anonymous, browser-side and do not include Tibia account data.
 */
const TibainvWiki = (() => {
  const API_URL = "https://tibia.fandom.com/api.php";
  const CACHE_PREFIX = "tibainv-wiki-cache-v1:";
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  function readCache(key) {
    try {
      const value = localStorage.getItem(CACHE_PREFIX + key);
      if (!value) return null;
      const record = JSON.parse(value);
      return record && Number.isFinite(record.storedAt) && Object.hasOwn(record, "data") ? record : null;
    } catch { return null; }
  }

  function writeCache(key, data) {
    try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ storedAt: Date.now(), data })); }
    catch { /* Reference lookup must still work if storage is full/blocked. */ }
  }

  async function request(params) {
    const url = new URL(API_URL);
    Object.entries({ ...params, format: "json", origin: "*" }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit"
    });
    if (!response.ok) throw new Error("TibiaWiki respondió con HTTP " + response.status + ".");
    const data = await response.json();
    if (data?.error) throw new Error(data.error.info || "La búsqueda pública de TibiaWiki falló.");
    return data;
  }

  function plain(value, maxLength = 1200) {
    return String(value ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ")
      .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  async function searchItems(query, options = {}) {
    const term = String(query ?? "").trim();
    if (term.length < 2) throw new Error("Escribe al menos dos letras para buscar un objeto.");
    if (term.length > 100) throw new Error("La búsqueda es demasiado larga.");
    const key = "search:" + term.toLocaleLowerCase("en");
    const cached = readCache(key);
    if (cached && Date.now() - cached.storedAt < CACHE_TTL && !options.refresh) {
      return { results: cached.data, fromCache: true, fetchedAt: new Date(cached.storedAt).toISOString() };
    }
    const json = await request({
      action: "query",
      generator: "search",
      gsrsearch: term,
      gsrnamespace: 0,
      gsrlimit: 8,
      prop: "extracts|info",
      exintro: 1,
      explaintext: 1,
      inprop: "url"
    });
    const pages = Object.values(json?.query?.pages || {});
    const results = pages.map(page => ({
      pageId: page.pageid,
      title: plain(page.title, 250),
      url: typeof page.fullurl === "string" ? page.fullurl : wikiUrl(page.title),
      summary: plain(page.extract || "Abre el artículo para consultar su información pública.", 700),
      sourceUpdated: page.touched || ""
    })).filter(page => page.title && page.url);
    writeCache(key, results);
    return { results, fromCache: false, fetchedAt: new Date().toISOString() };
  }

  function wikiUrl(title) {
    return "https://tibia.fandom.com/wiki/" + encodeURIComponent(String(title || "").trim().replace(/\s+/g, "_"));
  }

  function readInfobox(documentObject) {
    const box = documentObject.querySelector(".portable-infobox, table.infobox, .infobox");
    if (!box) return [];
    const rows = [...box.querySelectorAll(".pi-item.pi-data, tr")];
    const fields = [];
    for (const row of rows) {
      const labelNode = row.querySelector(".pi-data-label, th");
      const valueNode = row.querySelector(".pi-data-value, td");
      if (!labelNode || !valueNode || row.querySelector("tr")) continue;
      const label = plain(labelNode.textContent, 100);
      const value = plain(valueNode.textContent, 300);
      if (!label || !value || label.toLowerCase() === value.toLowerCase()) continue;
      if (!fields.some(item => item.label.toLowerCase() === label.toLowerCase())) fields.push({ label, value });
      if (fields.length >= 24) break;
    }
    return fields;
  }

  async function getItem(title, options = {}) {
    const name = String(title ?? "").trim();
    if (!name || name.length > 250) throw new Error("Nombre de artículo no válido.");
    const key = "page:" + name.toLocaleLowerCase("en");
    const cached = readCache(key);
    if (cached && Date.now() - cached.storedAt < CACHE_TTL && !options.refresh) {
      return { ...cached.data, fromCache: true, fetchedAt: new Date(cached.storedAt).toISOString() };
    }
    const json = await request({
      action: "parse",
      page: name,
      prop: "text|displaytitle|revid",
      disableeditsection: 1
    });
    const parsed = json?.parse;
    if (!parsed) throw new Error("TibiaWiki no devolvió el artículo solicitado.");
    const html = parsed.text?.["*"] || parsed.text || "";
    const documentObject = new DOMParser().parseFromString(String(html), "text/html");
    const root = documentObject.querySelector("#mw-content-text .mw-parser-output, .mw-parser-output, body");
    const paragraphs = root ? [...root.querySelectorAll("p")].map(p => plain(p.textContent, 1800)).filter(s => s.length > 25) : [];
    const details = {
      title: plain(parsed.displaytitle || parsed.title || name, 250),
      url: wikiUrl(name),
      summary: paragraphs.slice(0, 3).join("\n\n").slice(0, 1400) || "El artículo no contiene un resumen legible. Usa el enlace de la fuente para consultar la ficha completa.",
      fields: readInfobox(documentObject),
      revisionId: Number(parsed.revid) || null,
      sourceUpdated: "",
      attribution: "TibiaWiki (contenido comunitario bajo CC BY-SA); imágenes y marcas pertenecen a sus titulares."
    };
    writeCache(key, details);
    return { ...details, fromCache: false, fetchedAt: new Date().toISOString() };
  }

  return Object.freeze({ searchItems, getItem, wikiUrl });
})();

if (typeof module !== "undefined" && module.exports) module.exports = TibainvWiki;
if (typeof window !== "undefined") window.TibainvWiki = TibainvWiki;
