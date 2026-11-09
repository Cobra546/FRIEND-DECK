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

assert.match(html, /src="arcade\.js\?v=/, "Versioned arcade script must be loaded");
assert.match(arcade, /function startSetup\(id\)[\s\S]*?show\('arcadePlay'\)/, "Offline game setup must open the play screen");
assert.match(arcade, /function openGameMode\(id\)/, "Every game should open its mode chooser");
for (const id of ["modeCreate", "modeJoin", "modeOffline"]) assert.ok(arcade.includes(id), "Missing mode option: " + id);
assert.match(arcade, /hub\.addEventListener\('click'/, "Game cards must use delegated click handling");
assert.match(arcade, /Welcome to <em>Friend Deck\.<\/em>/, "Friend Deck landing theme must be present");
assert.match(arcade, /guess_the_facts[\s\S]*?Guess the Facts/, "The game title must remain Guess the Facts");
assert.match(arcade, /Math\.random\(\)<\.5/, "Burning Bridges coin must use fair 50/50 odds");
assert.match(arcade, /coinSpin/, "Burning Bridges must animate the coin toss");
assert.match(arcade, /Heads and Tails both have an equal 50% chance/, "Offline rules must explain fair coin odds");
assert.doesNotMatch(arcade, /Who Said That\?/, "Do not rename the Guess the Facts game");
assert.match(arcade, /deck-chits/, "Landing page should show sample chits");
assert.match(arcade, /show\('arcadePlay'\);saveOnlineSession\(\)/, "Online room must open the play screen and persist its session");
assert.match(arcade, /friendArcadeSession/, "Online sessions should recover after refresh");
assert.match(arcade, /function clearOnlineSession/, "Leaving a room should clear its saved session");
assert.match(arcade, /pub\.result\|\|\[\]/, "Mafia round results should be displayed");
assert.match(arcade, /killerCount>=civilianCount/, "Offline Mafia must check the parity win condition after the night phase");
assert.match(arcade, /fire-pop/, "Repeated Burning Bridges picks should animate");
assert.match(arcade, /api\("snapshot"\)/, "Online room snapshots must be polled");
assert.match(existing, /activeFactText/, "The original Guess the Facts game must remain present");
assert.match(existing, /playAgainBtn/, "The original Guess the Facts rematch flow must remain present");
assert.match(existing, /window\.__friendDeckEntry/, "Legacy Guess Facts should accept the in-app mode selection");
assert.doesNotMatch(arcade, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/i, "No privileged Supabase secret may ship to the browser");

console.log("Friend Deck source smoke checks passed.");
