# wildcard-play

The Wildcard Group edition of the online Backdoors & Breaches game, live at https://play.wildcardgroup.be.
A GPLv3 fork of BHIS's play.backdoorsandbreaches.com; the repository root is the website.

## Rules
- Never deploy to production, and never push to `origin`, without Tom's explicit go-ahead. A Netlify draft deploy is fine for testing.
- Deploys are manual. Netlify is not linked to git. Build a clean folder with `tools/publish_dir.sh`, then
  `netlify deploy --no-build --dir <folder> --site wildcardgroup-play` (draft). Production only on Tom's word, with `--prod`.
  The site has a `hugo` build command in its settings, so always pass `--no-build`.
- The public repo must stay clean: no internal paths, no notes in Dutch about the company, no secrets.
- Keep the GPL intact: LICENSE, the "Modified by Wildcard Group" comments and `MODIFICATIONS.md` (add an item for every change).
- Brand: navy #0B2641, teal #005670, orange #E7853C. Never black (#000).

## Working
- Preview: `python3 tools/serve.py`, then http://127.0.0.1:8791/ (no browser cache). In the Claude app: preview `play-local`.
- Our deck is `App/decks/WildcardGroup/` (cards 1449 x 2000, except where noted in `MODIFICATIONS.md`). `App/decks/WildCard/` is BHIS's own copy
  of the expansion and must stay identical to their branch `ICS-OT-V1.1`.
- Raise `DECK_DATA_VERSION` in `App/deck-script.js` whenever a `carddb.json` changes, and add `?v=` to a changed card image in `carddb.json`.
- Card text comes from the shared card sheet; compare a card image with it before it goes live.
