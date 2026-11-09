import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const arcade = readFileSync("arcade.js", "utf8");
const existing = readFileSync("app.js", "utf8");

const games = [
  ["burning_bridges", 5, 15],
  ["guess_the_facts", 3, 10],
  ["collect_fruits", 4, 20],
  ["imposter", 4, 14],
  ["mafia", 5, 20],
];

for (const [id, min, max] of games) {
  assert.ok(arcade.includes("'" + id + "'"), "Missing game: " + id);
  assert.ok(arcade.includes("'" + min + "'") || arcade.includes("," + min + ",") || arcade.includes("," + min + "]"), "Check minimum for " + id);
  assert.ok(arcade.includes("," + max + "]"), "Check maximum for " + id);
}

assert.match(html, /src="arcade\.js"/, "Arcade script must be loaded");
assert.match(arcade, /function startSetup\(id\)[\s\S]*?show\('arcadePlay'\)/, "Offline game setup must open the play screen");
assert.match(arcade, /show\('arcadePlay'\);saveOnlineSession\(\)/, "Online room must open the play screen and persist its session");
assert.match(arcade, /friendArcadeSession/, "Online sessions should recover after refresh");
assert.match(arcade, /function clearOnlineSession/, "Leaving a room should clear its saved session");
assert.match(arcade, /pub\.result\|\|\[\]/, "Mafia round results should be displayed");
assert.match(arcade, /killerCount>=civilianCount/, "Offline Mafia must check the parity win condition after the night phase");
assert.match(arcade, /fire-pop/, "Repeated Burning Bridges picks should animate");
assert.match(arcade, /api\("snapshot"\)/, "Online room snapshots must be polled");
assert.match(existing, /activeFactText/, "The original Guess the Facts game must remain present");
assert.match(existing, /playAgainBtn/, "The original Guess the Facts rematch flow must remain present");
assert.doesNotMatch(arcade, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/i, "No privileged Supabase secret may ship to the browser");

console.log("Arcade source smoke checks passed.");
