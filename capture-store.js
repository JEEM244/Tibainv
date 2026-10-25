"use strict";

/**
 * Stores Tibainv screenshot image blobs in IndexedDB.
 * Images stay in this browser; they are not uploaded to a Tibainv server.
 */
const TibainvCaptureStore = (() => {
  const DB_NAME = "tibainv-captures";
  const STORE_NAME = "images";
  const DB_VERSION = 1;
  let dbPromise;

  function open() {
    if (typeof indexedDB === "undefined") return Promise.reject(new Error("Este navegador no permite almacenamiento de capturas."));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("No se pudo abrir el almacenamiento local."));
      request.onblocked = () => reject(new Error("Cierra otras pestañas de Tibainv y vuelve a intentarlo."));
    });
    dbPromise.catch(() => { dbPromise = null; });
    return dbPromise;
  }

  async function save(id, file) {
    if (!(file instanceof Blob)) throw new Error("El archivo de captura no es válido.");
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put({ id: String(id), fileName: String(file.name || "captura"), blob: file, mimeType: file.type || "image/png", storedAt: new Date().toISOString() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("No se pudo guardar la imagen."));
      tx.onabort = () => reject(tx.error || new Error("Se canceló el guardado de la imagen."));
    });
  }

  async function get(id) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(String(id));
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("No se pudo leer la captura."));
    });
  }

  async function remove(id) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(String(id));
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("No se pudo eliminar la captura."));
    });
  }

  async function clear() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("No se pudieron borrar las capturas."));
    });
  }

  return Object.freeze({ save, get, remove, clear });
})();

if (typeof window !== "undefined") window.TibainvCaptureStore = TibainvCaptureStore;
if (typeof module !== "undefined" && module.exports) module.exports = TibainvCaptureStore;
