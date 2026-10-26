/* Tibainv live screen reader: user-selected screen share + local OCR only. */
"use strict";
(function () {
  const state = {
    token: 0,
    stream: null,
    video: null,
    canvas: null,
    worker: null,
    timer: null,
    scan: null,
    busy: false
  };

  function byId(id) { return document.getElementById(id); }
  function status(message) {
    const node = byId("live-status");
    if (node) node.textContent = message;
  }
  function loadTesseract() {
    if (window.Tesseract && window.Tesseract.createWorker) return Promise.resolve(window.Tesseract);
    if (window.tibainvLiveTesseractPromise) return window.tibainvLiveTesseractPromise;
    window.tibainvLiveTesseractPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      script.async = true;
      script.onload = () => window.Tesseract && window.Tesseract.createWorker
        ? resolve(window.Tesseract)
        : reject(new Error("El motor OCR no se pudo iniciar."));
      script.onerror = () => {
        window.tibainvLiveTesseractPromise = null;
        reject(new Error("No se pudo cargar el motor OCR. Revisa tu conexión."));
      };
      document.head.appendChild(script);
    });
    return window.tibainvLiveTesseractPromise;
  }

  function scheduleScan() {
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
    if (!state.stream || !state.scan) return;
    const token = state.token;
    const interval = Math.max(4000, Number(byId("live-interval")?.value) || 8000);
    state.timer = window.setInterval(() => {
      if (token === state.token && state.scan) void state.scan();
    }, interval);
  }

  function stop(message) {
    state.token += 1;
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
    const stream = state.stream;
    state.stream = null;
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (state.video) {
      try { state.video.pause(); } catch (_) {}
      state.video.srcObject = null;
    }
    state.video = null;
    state.canvas = null;
    state.scan = null;
    state.busy = false;
    if (state.worker) {
      const worker = state.worker;
      state.worker = null;
      Promise.resolve(worker.terminate()).catch(() => {});
    }
    const preview = byId("live-preview");
    if (preview) {
      preview.srcObject = null;
      preview.hidden = true;
    }
    const start = byId("live-start");
    const end = byId("live-stop");
    if (start) start.disabled = false;
    if (end) end.disabled = true;
    if (message) status(message);
  }

  async function start(toast) {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== "function") {
      status("Este navegador no permite compartir pantalla aquí. Abre Tibainv desde HTTPS o localhost en Edge/Chrome.");
      return;
    }
    if (!window.isSecureContext) {
      status("Por seguridad del navegador, abre Tibainv desde HTTPS o localhost y vuelve a intentarlo.");
      return;
    }
    stop("Abriendo el selector de pantalla…");
    const token = state.token;
    const startButton = byId("live-start");
    const stopButton = byId("live-stop");
    if (startButton) startButton.disabled = true;
    if (stopButton) stopButton.disabled = false;
    status("Elige la ventana de Tibia en el selector del navegador. No selecciones toda la pantalla si no hace falta.");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 1, max: 2 } },
        audio: false
      });
      if (token !== state.token) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      state.stream = stream;
      const preview = byId("live-preview");
      state.video = preview;
      preview.srcObject = stream;
      preview.hidden = false;
      await preview.play();
      if (token !== state.token) return;

      status("Cargando OCR local en el navegador…");
      const tesseract = await loadTesseract();
      const worker = await tesseract.createWorker("eng", 1);
      if (token !== state.token) {
        await worker.terminate();
        return;
      }
      state.worker = worker;
      state.canvas = document.createElement("canvas");
      const context = state.canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("No se pudo crear el lector de imagen.");

      const scan = async () => {
        if (token !== state.token || state.busy || !state.worker || !state.video || state.video.readyState < 2) return;
        state.busy = true;
        try {
          const sourceWidth = state.video.videoWidth;
          const sourceHeight = state.video.videoHeight;
          if (!sourceWidth || !sourceHeight) return;
          const width = Math.min(1280, sourceWidth);
          const height = Math.max(1, Math.round(sourceHeight * width / sourceWidth));
          state.canvas.width = width;
          state.canvas.height = height;
          context.drawImage(state.video, 0, 0, width, height);
          status("Leyendo el texto visible…");
          const result = await state.worker.recognize(state.canvas);
          if (token !== state.token) return;
          const text = String(result?.data?.text || "").trim().slice(0, 16000);
          const output = byId("live-text");
          if (output && text) output.value = text;
          const clock = new Date().toLocaleTimeString("es-MX");
          const size = text ? text.split(/\r?\n/).filter(line => line.trim()).length : 0;
          status("Última lectura: " + clock + " · " + size + " línea(s) detectada(s)." + (text ? "" : " No se encontró texto claro."));
          const copy = byId("live-copy");
          if (copy) copy.disabled = !text;
        } catch (error) {
          if (token === state.token) status("Error leyendo la imagen: " + (error?.message || "OCR no disponible."));
        } finally {
          state.busy = false;
        }
      };

      state.scan = scan;
      scheduleScan();
      const track = stream.getVideoTracks()[0];
      if (track) track.addEventListener("ended", () => {
        if (token === state.token) stop("Compartir pantalla terminó. La lectura está detenida.");
      }, { once: true });
      status("Pantalla compartida. La primera lectura comenzará ahora.");
      await scan();
    } catch (error) {
      if (token !== state.token) return;
      stop();
      const message = error?.name === "AbortError"
        ? "Cancelaste el selector de pantalla."
        : (error?.message || "No se pudo iniciar la lectura en vivo.");
      status(message);
      if (toast) toast(message);
    }
  }

  function render(root, toast) {
    stop();
    root.innerHTML =
      '<div class="eyebrow">LECTURA VISUAL · EXPERIMENTAL</div>' +
      '<h2 class="workspace-title">Monitor en vivo</h2>' +
      '<p class="muted">Comparte la ventana de Tibia y Tibainv intentará reconocer el texto que aparece en pantalla cada pocos segundos. No controla el juego, no lee su memoria y no envía teclas ni clics.</p>' +
      '<div class="detail-card">' +
        '<h4>Antes de empezar</h4>' +
        '<p>Elige solo la ventana de Tibia en el selector del navegador. El texto se procesa localmente en tu navegador; el motor OCR y el idioma inglés se descargan de un CDN la primera vez. No se guarda automáticamente.</p>' +
        '<p style="margin-top:8px">Limitación: los objetos de la mochila suelen ser iconos, no texto. Esta prueba reconoce mensajes y tooltips visibles; no puede prometer identificar automáticamente cada icono, objeto o cantidad.</p>' +
        '<p style="margin-top:8px">El reglamento de Tibia restringe ciertos programas no oficiales. Esta herramienta no automatiza acciones, pero eso no garantiza que toda forma de análisis de pantalla esté aprobada por CipSoft.</p>' +
      '</div>' +
      '<div class="toolbar">' +
        '<button class="button button-primary" id="live-start" type="button">Elegir ventana y empezar</button>' +
        '<button class="button button-quiet" id="live-stop" type="button" disabled>Detener lectura</button>' +
        '<label class="muted" for="live-interval" style="align-self:center">Revisar cada</label>' +
        '<select class="field" id="live-interval" aria-label="Intervalo de lectura" style="max-width:160px;flex:0 0 160px">' +
          '<option value="5000">5 segundos</option><option value="8000" selected>8 segundos</option><option value="12000">12 segundos</option>' +
        '</select>' +
      '</div>' +
      '<p class="muted" id="live-status" role="status" aria-live="polite">Lectura apagada. No se comparte nada hasta que pulses el botón.</p>' +
      '<div class="detail-card"><h4>Vista compartida</h4><video id="live-preview" autoplay muted playsinline hidden style="display:block;max-width:100%;max-height:340px;border-radius:7px;background:#0b0d0a"></video></div>' +
      '<div class="detail-card"><div class="section-heading"><div><h4>Texto reconocido</h4><div class="item-desc">Último resultado OCR; verifica cualquier dato importante.</div></div><button class="button button-quiet" id="live-copy" type="button" disabled>Copiar texto</button></div>' +
        '<textarea class="field" id="live-text" rows="11" readonly placeholder="Aquí aparecerá el texto que el lector logre reconocer."></textarea>' +
      '</div>';
    const startButton = byId("live-start");
    const stopButton = byId("live-stop");
    startButton.addEventListener("click", () => { void start(toast); });
    stopButton.addEventListener("click", () => stop("Lectura detenida por ti."));
    byId("live-interval").addEventListener("change", scheduleScan);
    window.addEventListener("beforeunload", () => stop());
    byId("live-copy").addEventListener("click", async () => {
      const output = byId("live-text");
      if (!output || !output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        if (toast) toast("Texto copiado.");
      } catch (_) {
        output.focus();
        output.select();
        if (toast) toast("Seleccioné el texto; cópialo con Ctrl+C.");
      }
    });
  }

  window.TibainvLiveMonitor = Object.freeze({ render, stop });
})();