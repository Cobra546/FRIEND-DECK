# GUESS THE FACTS ✦

A mobile-friendly friend-group guessing game. Players write five facts each, the game shuffles every fact, and players take random turns guessing who wrote it.

## Included

- Offline / same-device play for 3–10 players.
- Online rooms with a six-character room code.
- Five facts per player.
- Randomized fact order and randomized player turn order.
- Instant answer reveal after every guess.
- +1 point for a correct answer; 0 for an incorrect answer.
- Scoreboard after each guess and final top-three podium.
- Responsive sticky-note interface.

## Run offline

Open `index.html` in a modern browser or publish the repository with GitHub Pages. Offline mode works without a Supabase project.

## Enable online multiplayer

Online mode requires a Supabase project.

1. Create a dedicated Supabase project.
2. Open the Supabase SQL Editor and run all of `supabase.sql`.
3. Open `app.js` and fill in:
   - `SUPABASE_URL`: Project URL from Project Settings → API.
   - `SUPABASE_PUBLISHABLE_KEY`: the project's publishable key (or legacy anon key).
4. Commit the changes and reload the site.
5. Create an online room, then share the six-character code. Friends choose **Join a room** and enter that code.

**Never use a Supabase service-role or secret key in this browser app.**

### Important security note

This is a starter implementation for a private, casual friends game. The included SQL uses permissive anonymous policies so room-code players can sync without accounts. A room code is not strong authentication, and the database policy currently allows anonymous clients to read/update room rows. Do not put private or sensitive information in facts. Before making this a public production service, add server-side room membership checks and stricter RLS/RPC authorization.

## Publish with GitHub Pages

1. Open repository Settings → Pages.
2. Choose **Deploy from a branch**.
3. Select `main` and `/(root)`, then Save.
4. Wait for the Pages deployment. Your site will be available at:

`https://cobra546.github.io/GUESS-THE-FACTS/`

## Notes

- The app is static HTML/CSS/JavaScript and does not require a build step.
- Online mode is not active until Supabase is configured.
- Offline mode is local to one device; it does not sync between phones.
