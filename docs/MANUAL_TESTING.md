# Manual QA checklist

This is a manual checklist for checks that require a real browser. Automated CI validates JavaScript syntax, shared helper tests, key files, and navigation controls; it does not replace browser testing.

## Start the app

- [ ] Open `index.html` in a modern browser.
- [ ] Confirm the dashboard loads without a blank page or visible JavaScript error.
- [ ] Open every navigation section: Resumen, Personaje, Inventario, Criaturas, Enciclopedia, Notas, Diario de cacerías, Contador de kills.
- [ ] Check the browser console for errors.

## Screenshot archive

- [ ] Import one PNG, JPEG, and WEBP screenshot below 10 MB; verify unsupported types and files over 10 MB are rejected.
- [ ] Import a folder from a supported browser; verify duplicate and oversized files are skipped and the result count is shown.
- [ ] Reload the page and confirm screenshot previews load from IndexedDB.
- [ ] Search the archive by filename and recognized/reviewed text; clear the search and confirm all captures return.
- [ ] Run OCR on a screenshot, edit the result, save it, and confirm the text persists after reload.
- [ ] Delete one capture and confirm both its metadata and stored image are removed.

## Local data

- [ ] Add a personal object, search for it, filter by category, sort it, edit it, and delete it.
- [ ] Add a note, search its title and body, edit it, clear the edit form, and delete it.
- [ ] Record a hunt session and remove it.
- [ ] Add a creature kill count, adjust it by +1 and -1, search it, and delete it.
- [ ] Reload the page; verify locally stored records remain.
- [ ] Export JSON, then import the file and verify objects, notes, hunts, creatures, and kill counts are restored.
- [ ] Try importing malformed JSON; verify the app reports an error and keeps the previous data.
- [ ] Use the local-data reset control and confirm the confirmation dialog appears before data is cleared.

## Experimental live screen monitor

- [ ] Serve the app from HTTPS or localhost in Edge/Chrome.
- [ ] Open Monitor en vivo and start screen sharing; verify the browser picker requires an explicit user action.
- [ ] Select the Tibia window only and verify a live preview appears. If black, try full-screen capture once; if both are black, verify the fallback notice and use built-in Tibia screenshots instead.
- [ ] Confirm text is recognized locally after the chosen interval and the result can be copied.
- [ ] Stop the monitor and verify the preview stops and browser screen-sharing indicator ends.
- [ ] Navigate away during an active session and verify capture stops.
- [ ] Cancel the browser picker and verify a readable status is displayed.
- [ ] Confirm the module never sends input or reads process memory and does not auto-save OCR results.
- [ ] Test with visible game chat and a hovered item tooltip; record that backpack icon recognition is not implemented.

## Screenshot import and OCR

- [ ] Open the built-in screenshot folder in Tibia via Options → Misc → Screenshots → Open Screenshot Folder.
- [ ] Run Tibainv from HTTPS/localhost in Edge or Chrome, then select the screenshot folder with the folder-import button.
- [ ] Check that supported image files appear once, while duplicates and files larger than 10 MB are skipped.
- [ ] Import one screenshot manually as a fallback.
- [ ] Run OCR, wait for progress to finish, correct the recognized text, and save it.
- [ ] Promote selected lines into the personal object list; confirm they are clearly marked unverified and verify/delete any HUD noise.
- [ ] Delete a capture and confirm the browser-local image blob is removed.
- [ ] Export JSON and confirm it includes capture metadata but not embedded image blobs. Keep original screenshot files separately.

## External data

- [ ] Search a known public character and verify the returned name and world against TibiaData.
- [ ] Search an unknown character and verify a readable error is shown.
- [ ] Load the public creature list and open a creature detail.
- [ ] Repeat requests and confirm the UI identifies cached responses.
- [ ] Disable network access after a result is cached; verify the app can use a cached response where available.
- [ ] Open the app from a local server if direct-file browsing blocks API requests.

## Privacy and scope

- [ ] Confirm no Tibia password or account token is requested.
- [ ] Confirm the UI clearly distinguishes public API data, local personal records, and demo data.
- [ ] Confirm nobody represents manual hunt/kill records as automatically detected game events.
- [ ] Confirm the app does not claim to show real character inventory or depot contents.

## Known gap

The inventory and depot are not connected to the game client. Automatic kill tracking is not implemented. A full browser acceptance run still needs to be done against the current branch.
