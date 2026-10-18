# Cedar Grove Esports Stats

Public match results for the Cedar Grove High School esports team (Smash Bros and Street Fighter).

Anyone can open the site to see recent results. Team members sign in to post, edit or delete matches.

## Turning the site on

Settings → Pages → Deploy from a branch → `main` / root. The site is then at
https://kerem-orhan.github.io/CedarGroveEsportsStats/

## Posting results (team only)

1. Click **Team sign-in** at the bottom of the site.
2. Make a GitHub fine-grained token: https://github.com/settings/personal-access-tokens/new
   - Repository access: only `CedarGroveEsportsStats`
   - Permissions → Contents: **Read and write**
3. Paste it in. **+ Add match** appears, and you can click any card to edit or delete it.

Each team member needs to be a collaborator on the repo (Settings → Collaborators) to make their own token.

Results are saved in `matches.json` in this repo. After a save, GitHub Pages can take a minute or two to show the change to visitors.
