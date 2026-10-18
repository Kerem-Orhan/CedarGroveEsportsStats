# Cedar Grove Esports Stats

Public match results for the Cedar Grove High School esports team (Smash Bros and Street Fighter).

Anyone can open the site to see results. To log a match, pick **Smash Bros** or **Street Fighter** at the top and press **+ New match** (no sign-in for now).

Each match has up to 3 rounds. In each round you pick the map (Smash) and record, for each of our players, what they took vs. what their opponent took. Everything saves as you go, so you can fill it in during the match. The current round counts once the next round starts or you press **Finish match**. Live matches show a **LIVE** badge and refresh for visitors every 20 seconds.

## Turning the site on

Settings → Pages → Deploy from a branch → `main` / root. The site is then at
https://kerem-orhan.github.io/CedarGroveEsportsStats/

## Where the data lives

Matches are stored in a Cloudflare D1 database (`cedargrove-esports`) behind a small Cloudflare Worker:
https://cedargrove-esports-api.playex.workers.dev/matches

The worker's code is in `api/`. To redeploy it after changes: `cd api` then `npx wrangler deploy`.
