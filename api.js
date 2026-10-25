"use strict";

/**
 * Thin, credential-free TibiaData API v5 client.
 * Character cache: 5 minutes; creature reference cache: 15 minutes.
 */
const TibainvApi = (() => {
  const BASE_URL = "https://api.tibiadata.com/v5/";
  const CACHE_PREFIX = "tibainv-api-cache-v1:";
  const DEFAULT_TTL = 300000;
  const MAX_STALE = 7 * 24 * 60 * 60 * 1000;

  function readCache(key) {
    try {
      if (typeof localStorage === "undefined") return null;
      const value = localStorage.getItem(CACHE_PREFIX + key);
      if (!value) return null;
      const parsed = JSON.parse(value);
      return parsed && Number.isFinite(parsed.storedAt) && Object.hasOwn(parsed, "data") ? parsed : null;
    } catch { return null; }
  }

  function writeCache(key, data) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ storedAt: Date.now(), data }));
    } catch { /* Cache failure must not break an otherwise successful lookup. */ }
  }

  async function get(path, options = {}) {
    const safePath = String(path || "").replace(/^\/+/, "");
    if (!safePath || !/^[a-z0-9/_%.-]+$/i.test(safePath) || safePath.includes("..")) {
      throw new Error("Ruta de consulta no válida.");
    }
    const ttlMs = Number.isFinite(options.ttlMs) && options.ttlMs >= 0 ? options.ttlMs : DEFAULT_TTL;
    const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs >= 1000 ? options.timeoutMs : 10000;
    const cache = readCache(safePath);
    const age = cache ? Math.max(0, Date.now() - cache.storedAt) : Infinity;
    if (cache && age < ttlMs) {
      return { data: cache.data, fromCache: true, stale: false, fetchedAt: new Date(cache.storedAt).toISOString() };
    }

    const controller = typeof AbortController === "undefined" ? null : new AbortController();
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      if (typeof fetch !== "function") throw new Error("Este navegador no permite consultas de red.");
      const response = await fetch(BASE_URL + safePath, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined,
        credentials: "omit"
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error("No se encontró el dato solicitado.");
        throw new Error("TibiaData respondió con un error HTTP " + response.status + ".");
      }
      const data = await response.json();
      writeCache(safePath, data);
      return { data, fromCache: false, stale: false, fetchedAt: new Date().toISOString() };
    } catch (error) {
      if (cache && Date.now() - cache.storedAt <= MAX_STALE) {
        return { data: cache.data, fromCache: true, stale: true, fetchedAt: new Date(cache.storedAt).toISOString() };
      }
      if (error?.name === "AbortError") throw new Error("La consulta tardó demasiado. Inténtalo de nuevo.");
      throw error;
    } finally {
      if (timer !== null) clearTimeout(timer);
    }
  }

  return Object.freeze({ get });
})();

if (typeof module !== "undefined" && module.exports) module.exports = TibainvApi;
if (typeof window !== "undefined") window.TibainvApi = TibainvApi;
