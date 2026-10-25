# Tibainv — Tibia Field Companion

Tibainv is an independent, Spanish-language companion web app concept for organizing Tibia character information, inventory notes, creature records, and item explanations.

> **Current status:** front-end prototype. The initial item and creature entries are demonstration data, not a live character feed or an authoritative game database.

## Run it

Open `index.html` in a modern browser. No build step or package installation is required. The interface uses plain HTML, CSS, and JavaScript. Google Fonts are optional visual enhancements; the browser falls back to local fonts if unavailable.

## Current features

- Responsive dark interface with navigation for overview, character, inventory, creatures, and encyclopedia.
- Search across local demonstration item and creature entries.
- Item details explaining purpose, category, weight, and example source.
- Personal notes saved in the current browser's local storage.
- Export of local entries and notes to a JSON file.
- No Tibia password, account token, or session cookie is requested.

## Important limitations

- Character lookup is not yet connected to a public data API.
- Inventory and depot contents are not read from the Tibia client.
- Creature kills, battle log, and loot are not tracked automatically.
- Demonstration game values are illustrative and must be checked against a current, reliable source before being presented as verified facts.
- The web app must not request or store Tibia credentials.

## Planned roadmap

1. **Reliable public data:** research current public character and game-data APIs; show data source and last-updated time.
2. **Item encyclopedia:** replace illustrative entries with sourced, version-aware item data and useful filters.
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