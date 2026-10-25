# Security and privacy notes

Tibainv is a fan-made companion project. It does not authenticate Tibia accounts and must never ask users for their Tibia password, session cookie, or account token.

## Data boundaries

- Personal object entries, notes, hunt sessions, manual kill counts, and API cache are stored in the current browser's local storage.
- Local storage is not encrypted. Anyone with access to the same browser profile may be able to inspect it. Do not store passwords, access tokens, or other secrets in the app.
- Public character and creature requests go to the TibiaData API. Requests contain the public name/race used in the lookup, not the user's Tibia login credentials.
- JSON export files contain locally stored information. Treat those files as personal data when sharing them.
- Browser caches can be stale. The UI should identify cached information and not present it as guaranteed real-time game state.

## Importing data safely

- Import accepts JSON files only and limits the chosen file to 5 MB in the browser UI.
- The parser checks the expected app identifier, supported version, list shapes, record limits, and allowed fields.
- Import replaces local lists only after a confirmation prompt.
- Never import backups from an untrusted source without reviewing their contents.

## Out of scope

Tibainv must not inject code into the Tibia client, modify client memory, intercept game traffic, or automate gameplay. Automatic inventory/depot extraction and automatic kill tracking are not implemented. Any future client integration requires a documented, authorized source and separate review for game rules and account safety.

## Reporting a problem

For a security issue, contact the repository maintainer privately rather than publishing exploit details in a public issue. Do not include passwords, tokens, or private account information in a report.
