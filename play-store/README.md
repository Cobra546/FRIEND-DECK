# Friend Deck — Google Play Android wrapper

This folder contains the publishing setup notes for packaging the existing PWA as a Trusted Web Activity (TWA). The game itself remains hosted at GitHub Pages; this wrapper does not replace or modify the game.

## App identity

- Store name: Friend Deck
- Android application ID (package name): `com.cobra546.frienddeck`
- Website: `https://cobra546.github.io/GUESS-THE-FACTS/`
- Web manifest: `https://cobra546.github.io/GUESS-THE-FACTS/manifest.webmanifest`
- Launch mode: Trusted Web Activity (TWA)
- Initial version: `1.0.0` (version code `1`)

## Build the Android project

Use a computer with Node.js 18+ and the Android build tools. From a new folder for the Android wrapper:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest="https://cobra546.github.io/GUESS-THE-FACTS/manifest.webmanifest"
```

During setup, confirm:
- Application ID: `com.cobra546.frienddeck`
- App name: `Friend Deck`
- Host: `cobra546.github.io`
- Start URL: `/GUESS-THE-FACTS/`
- Display mode: `standalone`

Create and securely back up the signing key when Bubblewrap asks. Never commit the keystore or its passwords to this repository.

Then build:

```bash
bubblewrap validate --url="https://cobra546.github.io/GUESS-THE-FACTS/"
bubblewrap build
```

Bubblewrap produces an Android App Bundle (`.aab`) for Play Console upload and an APK for device testing.

## Required domain verification

A TWA needs a Digital Asset Links file at:

`https://cobra546.github.io/GUESS-THE-FACTS/.well-known/assetlinks.json`

The file must contain the final package name and the SHA-256 fingerprint of the **Play App Signing certificate** shown in Play Console after app setup. Do not publish a placeholder fingerprint. Once that real fingerprint is available, create the JSON file and ensure GitHub Pages serves the `.well-known` directory (for a Jekyll site, include it in `_config.yml`).

## Before submitting to Google Play

- Test the signed app on a real Android device.
- Verify the TWA opens fullscreen (not in a browser Custom Tab).
- Complete the Play Console app listing, screenshots, content rating, privacy policy, data safety, and testing requirements.
- Upload the signed `.aab` and complete Google's review process.

A Play Console developer account and publishing actions must be handled by an adult account holder/parent or guardian. Do not share passwords, signing keys, or identity documents in this repository or chat.

## Important

This is a setup guide, not a built or signed Android package. The actual `.aab`, signing certificate fingerprint, and Play Console submission depend on the build environment and the adult account holder's Play App Signing setup.
