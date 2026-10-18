// Match results API for the Cedar Grove Esports site.
// GET /matches lists every match; POST adds one; PUT /matches/:id edits; DELETE /matches/:id removes.
// A match has up to 3 rounds; each round has a map and a few player lines (what our player took vs. theirs).
// Matches are saved while in progress ("live") and marked "final" when done. Open to anyone for now.

const MAX_MATCHES = 2000;
const MAX_BODY = 8192;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...CORS } });

const str = (v, n) => String(v ?? "").trim().slice(0, n);
const num = (v) => { const n = parseInt(v, 10); return Number.isInteger(n) ? Math.min(99, Math.max(0, n)) : 0; };
const safeUrl = (u) => (/^https:\/\/[^\s"'<>()]+$/i.test(u || "") ? u : "");
const GAMES = ["Smash Bros", "Street Fighter"];

function roundWinner(r) {
  const us = r.players.reduce((s, p) => s + p.us, 0), them = r.players.reduce((s, p) => s + p.them, 0);
  return us > them ? "W" : them > us ? "L" : "";
}

function clean(m) {
  const date = str(m.date, 10);
  const rounds = (Array.isArray(m.rounds) ? m.rounds : []).slice(0, 3).map((r) => ({
    map: str(r && r.map, 40),
    players: (Array.isArray(r && r.players) ? r.players : []).slice(0, 6).map((p) => ({
      name: str(p && p.name, 40), us: num(p && p.us), them: num(p && p.them),
    })),
  }));
  const out = {
    game: GAMES.includes(m.game) ? m.game : "",
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
    opponent: str(m.opponent, 60),
    event: str(m.event, 60),
    status: m.status === "final" ? "final" : "live",
    rounds,
    us: rounds.filter((r) => roundWinner(r) === "W").length,
    them: rounds.filter((r) => roundWinner(r) === "L").length,
    image: safeUrl(str(m.image, 500)),
  };
  if (!out.game) return { error: "Pick Smash Bros or Street Fighter." };
  if (!out.date) return { error: "Add a valid date." };
  if (!out.opponent) return { error: "Add the opponent's name." };
  return { match: out };
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return null;
  try { return JSON.parse(text); } catch { return null; }
}

const rowToMatch = (r) => ({ ...JSON.parse(r.data), id: r.id, createdAt: r.created_at });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] !== "matches" || parts.length > 2) return json({ error: "Not found" }, 404);
    const id = parts[1];

    try {
      if (request.method === "GET" && !id) {
        const { results } = await env.DB.prepare(
          "SELECT id, data, created_at FROM matches ORDER BY date DESC, created_at DESC"
        ).all();
        return json(results.map(rowToMatch));
      }

      if (request.method === "POST" && !id) {
        const body = await readBody(request);
        if (!body) return json({ error: "Invalid request." }, 400);
        const { match, error } = clean(body);
        if (error) return json({ error }, 400);
        const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM matches").first();
        if (n >= MAX_MATCHES) return json({ error: "The match log is full." }, 507);
        const newId = crypto.randomUUID();
        const now = Date.now();
        await env.DB.prepare("INSERT INTO matches (id, data, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
          .bind(newId, JSON.stringify(match), match.date, now, now).run();
        return json({ ...match, id: newId, createdAt: now }, 201);
      }

      if (request.method === "PUT" && id) {
        const body = await readBody(request);
        if (!body) return json({ error: "Invalid request." }, 400);
        const { match, error } = clean(body);
        if (error) return json({ error }, 400);
        const res = await env.DB.prepare("UPDATE matches SET data = ?, date = ?, updated_at = ? WHERE id = ?")
          .bind(JSON.stringify(match), match.date, Date.now(), id).run();
        if (!res.meta.changes) return json({ error: "That match no longer exists." }, 404);
        const row = await env.DB.prepare("SELECT id, data, created_at FROM matches WHERE id = ?").bind(id).first();
        return json(rowToMatch(row));
      }

      if (request.method === "DELETE" && id) {
        await env.DB.prepare("DELETE FROM matches WHERE id = ?").bind(id).run();
        return json({ ok: true });
      }

      return json({ error: "Method not allowed" }, 405);
    } catch (e) {
      return json({ error: "Server error. Try again." }, 500);
    }
  },
};
