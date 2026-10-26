# Tibainv

A Spanish-language, local-first companion for Tibia. It separates **what the game screenshot shows** from **public reference information** about objects and creatures.

## Run

Open `index.html` in a modern browser. No build step or installation is required. If the browser blocks external requests when opened as a file, run it from a simple local web server or a static host such as GitHub Pages.

## Features implemented

- **Public character profile:** query by public character name through TibiaData API v5. No Tibia password, session cookie, or account token is requested.
- **Public item reference:** search TibiaWiki articles; inspect the article summary and infobox fields when available; open the community source; save a reference into your own local list.
- **Public creature reference:** load public creatures and view their published facts through TibiaData.
- **Game screenshots:** import screenshots created with Tibia's own screenshot function. Images are stored as blobs in browser IndexedDB.
- **Experimental live screen reader:** the user explicitly shares a Tibia window with the browser, and local OCR periodically reads visible text such as messages and item tooltips. It does not read client memory, inject code, send input, or automatically save the recognized output.
- **Optional OCR:** the page can download Tesseract.js and its English recognition data, then process the selected screenshot in the browser. Screenshot images are not uploaded to a Tibainv server. OCR may misread text and must be reviewed.
- **Local lists:** create/edit/delete object notes; filter and sort your own entries.
- **Hunt notes:** manually record hunt sessions and per-creature kill counts.
- **Local notebook:** create, search, edit and delete notes.
- **JSON backups:** export/import personal list data and screenshot metadata with validation. Screenshot image blobs themselves are not embedded in a JSON backup; the original files must be kept separately.
- **Privacy controls:** clear local browser data and cached public responses.
- **Checks:** GitHub Actions validates JavaScript syntax, runs core unit tests and checks that key files and app sections are present.

## What is real and what is not

- The app no longer seeds the main item/creature lists with fake default records.
- Public character and creature information comes from an external community API. It can be unavailable, delayed, or different from the live game state.
- TibiaWiki is a community reference, not an authoritative snapshot of your character. Item fields differ by article and game version.
- Screenshot OCR reads visible text from an image. It cannot guarantee the exact item, quantity, weight, or container contents; review the result before saving it as a note.
- A screenshot is not automatically read from the Tibia screenshot folder. You select and import it in the app.
- **Live inventory/depot reading is not implemented.** The live monitor only reads visible text; it does not identify backpack icons or guarantee item/quantity detection. The app does not read client memory or intercept game traffic.
- **Automatic kill detection is not implemented.** Hunt sessions and kill counts are records you enter yourself or derive from OCR text after reviewing it.

## Experimental live screen reading

1. Serve the app from HTTPS or localhost and open it in Edge/Chrome.
2. Go to **Monitor en vivo** and click **Elegir ventana y empezar**.
3. In the browser picker, select only the Tibia window. The browser will display a sharing indicator; press **Detener lectura** or stop sharing to end it.
4. Review the recognized text. Readings are not saved automatically and OCR can be wrong.

The monitor uses the browser Screen Capture API and Tesseract.js in the browser. It does not send game inputs, manipulate the client, inspect process memory, or intercept network traffic. Some Windows/Tibia client capture combinations return black frames to third-party capture APIs; if both window capture and full-screen capture are black, the browser has no image pixels to OCR. Stop the monitor and use Tibia’s built-in screenshot feature, then import the image below. Do not try to bypass client protections. Only visible text is supported; graphical item icons still require a separate, unverified image-recognition step. Tibia’s rule 3b warns against unofficial tools that manipulate the client or play automatically, and no guarantee is made that all forms of live screen analysis are approved by CipSoft: https://www.tibia.com/support/?rule=3b&subtopic=tibiarules

## Screenshot workflow

1. In Tibia, use its built-in screenshot hotkey or screenshot settings to capture the whole client interface when the relevant panel is visible.
2. Open Tibainv → **Capturas del juego** and select the original PNG/JPEG/WEBP image.
3. Choose **Leer texto (OCR)**, review the result and correct errors.
4. Save the reviewed text. If you use “Pasar líneas a mi lista”, each line is explicitly marked as unverified and should be checked manually.

Tibia's official help describes its screenshot hotkey, automatic screenshots and screenshot settings: https://www.tibia.com/support/?entryid=168&subtopic=gethelp

## Data storage and safety

- Notes, personal lists, capture metadata and public-response caches are saved in the current browser profile.
- Screenshot image blobs are stored in IndexedDB in that browser.
- Local storage is not encrypted. Do not store passwords, tokens, or private account credentials.
- The OCR engine and English language data are fetched from external CDNs on first use; the screenshot pixels are processed in the browser and are not intentionally uploaded.
- JSON import replaces local lists only after confirmation. Export files include notes and personal records, so treat them as private.
- See [SECURITY.md](SECURITY.md) and [docs/MANUAL_TESTING.md](docs/MANUAL_TESTING.md).

## Next

1. Complete a real browser QA pass in Chrome/Edge and verify the public API response shapes.
2. Improve OCR for the specific layouts you want to capture (backpack, stash, battle log/loot messages).
3. Add a reviewed workflow for turning captured text into item notes and kill records, avoiding guesses.
4. Investigate permitted, documented local data sources before considering any live client tracking.

Tibainv is an independent fan project and is not affiliated with or endorsed by CipSoft or Tibia. Data sources are community-maintained where indicated.
