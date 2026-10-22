# Cedar Grove Esports Stats

Public match results for the Cedar Grove High School esports team (Smash Bros and Street Fighter).

Anyone can open the site to see results, click a match for the full breakdown, and open **Players** for individual stats (leaderboard, highlights, map record, and a page per player).

Only the owner can add, edit or delete matches. Click **Owner sign-in** at the bottom of the page and enter the owner key. Then pick **Smash Bros** or **Street Fighter** at the top and press **+ New match**; to change a match, open it and press **Edit**.

Each match has up to 3 rounds. In each round you pick the map (Smash) and record, for each of our players, how many stocks they took vs. how many their opponent took. A Smash round is won by the first side to take 9 stocks. Press **Save** to exit, and click the match card to come back to it later. A match shows WIN or LOSS once one side has won 2 rounds. The page refreshes unfinished matches for visitors every 20 seconds.

## Turning the site on

Settings → Pages → Deploy from a branch → `main` / root. The site is then at
https://kerem-orhan.github.io/CedarGroveEsportsStats/

## Where the data lives

Matches are stored in a Cloudflare D1 database (`cedargrove-esports`) behind a small Cloudflare Worker:
https://cedargrove-esports-api.playex.workers.dev/matches

The worker's code is in `api/`. The owner key is stored as the Worker secret `ADMIN_KEY` (change it in the Cloudflare dashboard under the worker's Settings → Variables and Secrets). To redeploy it after changes: `cd api` then `npx wrangler deploy`.
