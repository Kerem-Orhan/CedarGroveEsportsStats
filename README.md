# Cedar Grove Esports Stats

Public match results for the Cedar Grove High School esports team (Smash Bros and Street Fighter).

Anyone can open the site to see results, and anyone can add, edit or delete a match with **+ Add match** (no sign-in for now).

## Turning the site on

Settings → Pages → Deploy from a branch → `main` / root. The site is then at
https://kerem-orhan.github.io/CedarGroveEsportsStats/

## Where the data lives

Matches are stored in a Cloudflare D1 database (`cedargrove-esports`) behind a small Cloudflare Worker:
https://cedargrove-esports-api.playex.workers.dev/matches

The worker's code is in `api/`. To redeploy it after changes: `cd api` then `npx wrangler deploy`.
