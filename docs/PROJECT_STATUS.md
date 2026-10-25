# Tibainv project status — 60-commit milestone

**Repository:** [JEEM244/Tibainv](https://github.com/JEEM244/Tibainv)  
**Working branch:** `main`  
**Milestone:** 60 total commits

## What exists in the code

- A Spanish-language, responsive dashboard with sections for public character lookup, inventory notes, creature reference, personal notes, hunt journal, and manual kill counter.
- Public character lookup through TibiaData API v4, with response parsing and a browser-side cache/timeout wrapper.
- Public creature list and individual public creature reference data when the service responds.
- Local personal object records, with category filter, sorting, edit/delete, and local persistence.
- Searchable, editable notes; manual hunt sessions; manual per-creature kill totals.
- Local JSON backup import/export for objects, creatures, notes, hunting sessions, and creature kill counts.
- Data reset controls, shared input validation helpers, unit tests, and GitHub Actions checks.
- Privacy and manual-testing notes in `SECURITY.md` and `docs/MANUAL_TESTING.md`.

## What CI proves (and what it does not)

GitHub Actions checks JavaScript syntax, unit tests for core data parsing/storage and public response envelopes, expected files, navigation targets, and core data controls. A green workflow does **not** prove the complete site has been manually accepted in Chrome/Edge, nor guarantee a third-party API will always be available.

Follow the manual browser checklist after downloading or publishing the app. Validate API response shapes and data against the current TibiaData documentation when updating integrations.

## Known limitations

- The initial item list is demonstration data. Personal item records are notes, not a live in-game inventory.
- No live inventory, equipment, bank/depot or container contents are read from the Tibia client.
- Hunt sessions and monster kill counts are manually entered; automatic game-event tracking is not implemented.
- Public API data may be delayed, incomplete, cached, or unavailable.
- Local browser storage is not encrypted and usually belongs only to that browser profile. Backups contain personal notes and should be treated accordingly.
- No Tibia password, session cookie, or account token should ever be requested or stored.

## Next technical steps

1. Perform a full browser QA pass using `docs/MANUAL_TESTING.md`; fix any failures before adding more features.
2. Verify live TibiaData v4 response shapes and external request behavior in the target browsers (including direct-file vs local-server execution).
3. Investigate a reliable, authorized, version-aware item data source. Keep source links, update timestamps, and distinguish reference facts from player-owned items.
4. Design a separate import format for permitted user-provided hunting logs, with validation and a preview before writing data.
5. Consider any automatic client-side tracking only after identifying a documented, permitted source; do not inject code, intercept game traffic, modify client memory, or automate gameplay.
6. Revisit how the app can be published securely as a static site while keeping private local data local.

This is a working prototype milestone, not a claim that live inventory tracking is complete.
