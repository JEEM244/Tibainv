# Security and privacy notes

Tibainv is a fan-made companion project. It does not authenticate Tibia accounts and must never ask users for their Tibia password, session cookie, or account token.

## Data boundaries

- Personal object entries, notes, hunt sessions, manual kill counts, and API cache are stored in the current browser's local storage.
- Local storage is not encrypted. Anyone with access to the same browser profile may be able to inspect it. Do not store passwords, access tokens, or other secrets in the app.
- Public character and creature requests go to the TibiaData API. Requests contain the public name/race used in the lookup, not the user's Tibia login credentials.
- JSON export files contain locally stored information. Treat those files as personal data when sharing them.
- Browser caches can be stale. The UI should identify cached information and not present it as guaranteed real-time game state.

## Screenshots and OCR

- Screenshot images selected by the user are stored in browser IndexedDB. Directory import uses a browser folder picker and reads only the folder the user explicitly selects.
- The optional OCR engine and language data are downloaded from third-party CDNs. OCR runs in the user's browser; screenshot pixels are not intentionally uploaded to Tibainv or sent to an OCR API.
- OCR may misread names, stack amounts, interface labels, and numbers. OCR results and any items created from them are unverified notes until the user reviews them.
- A JSON backup contains capture metadata and recognized text, not the binary image itself. Keep original images separately if they matter.
- Clearing local data should remove capture metadata, cached responses, and IndexedDB image blobs.

## Importing data safely

- Import accepts JSON files only and limits the chosen file to 5 MB in the browser UI.
- The parser checks the expected app identifier, supported version, list shapes, record limits, and allowed fields.
- Import replaces local lists only after a confirmation prompt.
- Never import backups from an untrusted source without reviewing their contents.

## Out of scope

Tibainv must not inject code into the Tibia client, modify client memory, intercept game traffic, or automate gameplay. Automatic inventory/depot extraction and automatic kill tracking are not implemented. Any future client integration requires a documented, authorized source and separate review for game rules and account safety.

## Reporting a problem

For a security issue, contact the repository maintainer privately rather than publishing exploit details in a public issue. Do not include passwords, tokens, or private account information in a report.
