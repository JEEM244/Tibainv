# Tibainv — Tibia Field Companion

Tibainv is an independent, Spanish-language companion web app concept for organizing Tibia character information, inventory notes, creature records, and item explanations.

> **Current status:** front-end prototype. The initial item and creature entries are demonstration data, not a live character feed or an authoritative game database.

## Run it

Open `index.html` in a modern browser. No build step or package installation is required. The interface uses plain HTML, CSS, and JavaScript. Google Fonts are optional visual enhancements; the browser falls back to local fonts if unavailable.

## Current features

- Responsive dark interface with navigation for overview, character, inventory, creatures, and encyclopedia.
- Search across local demonstration item entries and the public creature bestiary.\n- Load the public creature list from TibiaData API v4 and request public creature details such as hitpoints, experience, behavior, elemental strengths/weaknesses, and listed loot when available.
- Item details explaining purpose, category, weight, and example source.\n- User-created object entries with name, category, weight, source, and custom description; data persists locally.\n- Category filtering and accent-insensitive search for objects and creatures.\n- Import/export backups for personal data, plus a local-data reset control.
- Personal notes saved in the current browser's local storage, with search and edit actions.
- Manual hunt journal with location/world, duration, kill total, loot notes, and search.
- Manual per-creature kill counter with adjustments, search, and delete controls.
- Dashboard totals for locally recorded objects, creatures, notes, kill counts, and hunt sessions.
- User-created object entries with category, weight, source, and description; filter, sort, edit, and delete controls.
- Local-data reset control and validated JSON import/export that include personal records.
- Export of local entries and notes to a JSON file.
- No Tibia password, account token, or session cookie is requested.

## Important limitations

- Public character lookup is connected to TibiaData API v4 by character name; it displays public profile fields and recent public deaths when available. External API availability and browser/network restrictions may affect requests.
- Inventory and depot contents are not read from the Tibia client.
- Creature kills and battle log are not tracked automatically. Creature pages can show public reference data, but that is not a record of the player’s own kills or actual loot received.\n- Item encyclopedia entries remain demonstration/personal entries; a verified public item database has not yet been integrated.
- Demonstration game values are illustrative and must be checked against a current, reliable source before being presented as verified facts.
- The web app must not request or store Tibia credentials.

## Planned roadmap

1. **Reliable public data:** public character lookup now uses TibiaData API v4 and identifies the source. Next: show timestamps and validate more response shapes.
2. **Item encyclopedia:** replace illustrative item entries with sourced, version-aware item data and useful filters.
3. **Hunt journal:** add manual session records first, with optional import of user-provided logs where permitted.
4. **Automatic tracking research:** investigate only documented, authorized data sources and safe client-accessible logs. Do not modify the game client, inject code, intercept game traffic, or automate gameplay.
5. **Inventory integration:** proceed only if a reliable and permitted source for actual inventory changes is established.
6. **Quality:** add tests, error states, accessibility checks, and data import/export validation.

## Design principles

- Local-first by default; explain clearly what is stored and where.
- Never ask for a Tibia password or authentication token.
- Distinguish live, imported, manual, and demonstration data.
- Cite data sources and disclose uncertainty.
- Keep the app useful even when external APIs are unavailable.

## Technology

- HTML5
- CSS3 (responsive layout and reduced-motion support)
- Vanilla JavaScript
- Browser localStorage for personal notes
- JSON for data export

Tibainv is a fan-made, independent project and is not affiliated with or endorsed by CipSoft or Tibia. Tibia and related names are trademarks of their respective owners.

## Security and privacy

See [SECURITY.md](SECURITY.md) for the local-storage model, export-file cautions, import validation, and permitted integration boundaries. A browser-based manual acceptance checklist is in [docs/MANUAL_TESTING.md](docs/MANUAL_TESTING.md).

## Testing

GitHub Actions checks JavaScript syntax, shared data-helper unit tests, required app assets, and the expected navigation/data controls. These automated checks do not prove every interactive flow works in a real browser; use the manual QA checklist before treating the app as release-ready.

## Current implementation status

- **Working conceptually in the code:** public character lookup, public creature reference list/details, local personal notes/objects, hunt sessions, manual per-creature kill counts, and JSON backups.
- **Requires live-browser confirmation:** complete UI navigation, end-to-end JSON round-trip, external API/CORS availability, offline cache fallback, and responsive behavior across browsers.
- **Not implemented:** reading real inventory/depot contents from the player's client or automatically detecting creature kills. Do not treat demo objects or manually entered counts as confirmed game data.
