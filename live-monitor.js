/* Retired live capture entry point.
 * Tibainv now uses user-selected screenshot files and local OCR only.
 * This stub intentionally does not call getDisplayMedia or request screen sharing.
 */
"use strict";
(function () {
  function render(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="eyebrow">CAPTURA LOCAL</div>' +
      '<h2 class="workspace-title">Usa capturas del juego</h2>' +
      '<p class="muted">La lectura en vivo se retiró porque el navegador recibía fotogramas negros en este entorno. Importa una captura guardada por Tibia para reconocer el texto localmente.</p>' +
      '<div class="toolbar"><button class="button button-primary" id="retired-open-captures" type="button">Abrir capturas del juego →</button></div>';
    const button = root.querySelector("#retired-open-captures");
    button?.addEventListener("click", () => window.TibainvShowView?.("captures"));
  }
  function stop() {}
  window.TibainvLiveMonitor = Object.freeze({ render, stop });
})();
