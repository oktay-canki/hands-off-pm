# HandsoffPM

A self-hosted, browser-based password manager built with Next.js that runs entirely on your device — no server, no third party, no trust required beyond your own browser.

**🔗 [Live Preview](https://handsoffpm.vercel.app)** · **📖 [Docs](https://handsoffpm.vercel.app/docs)**

> **⚠️ Important**
> This is an actively developed personal project, not a real-life product. It has not undergone a formal security review. Please don't use it to store real high-stakes credentials. Feedback and issue reports are welcome see the Feedback section.

---

## What it is

Most password managers ask you to trust a server, a third-party audit, or a network connection — even "zero-knowledge" providers still route your data through infrastructure you don't own. HandsoffPM takes a different approach: it's designed to be **self-hosted**, running entirely client-side, so your vault never leaves your device.

You run it, you control it, you can audit it yourself.

## Tech stack

- **Next.js** + **TypeScript** — chosen for flexibility, even though the app currently runs entirely client-side
- **libsodium** — all cryptography (Argon2id key derivation, ChaCha20-Poly1305 encryption); no custom crypto
- **Web Worker + Comlink** — vault operations (unlock, encrypt, decrypt) run isolated from the main thread
- **IndexedDB** — local, encrypted-at-rest storage; only ciphertext ever touches disk

## Highlights

- 🔐 **Zero-knowledge by architecture** — there's no server to leak your data to in the first place
- 🔑 **Argon2id + ChaCha20-Poly1305** — modern, memory-hard key derivation and authenticated encryption
- 🧩 **Layered encryption** — entries are encrypted individually, then the vault as a whole is encrypted again at rest
- 🧠 **Keys live only in memory** — cleared on lock, never persisted
- 📦 **Self-hosted** — no cloud dependency, no account, no telemetry

## Documentation

The `/docs` route on the live preview covers the full design in depth:

- [Architecture & Tech Stack](https://handsoffpm.vercel.app/docs/architecture)
- [Cryptographic Design](https://handsoffpm.vercel.app/docs/cryptography)
- [Threat Model](https://handsoffpm.vercel.app/docs/threat-model)
- [Storage, Persistence & Data Loss](https://handsoffpm.vercel.app/docs/storage)
- [Trade-offs & Limitations](https://handsoffpm.vercel.app/docs/tradeoffs-limitations)

## Status

HandsoffPM is under active development. Currently implemented: local vault creation, unlock, and entry encryption/decryption. Planned: export/import

There's no Docker image or packaged app yet — running it means building it yourself. A turnkey setup (Docker, desktop app) is a natural next step.

## Getting started (local development)

```bash
git clone git@github.com:oktay-canki/hands-off-pm.git
cd hands-off-pm
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run lint` – run ESLint
- `npm run typecheck` – check TypeScript types
- `npm test` – run tests
- `npm run check` – run all checks (lint + typecheck + tests)

## License

This project is licensed under a custom Personal Use License.
See the LICENSE file for details.

## Feedback

Bug reports, observations, and design critiques are genuinely welcome — please open an issue.

# Security

If you discover a security vulnerability, please do not open a public issue.
Instead, follow the instructions in the [Security Policy](./SECURITY.md#-reporting-a-vulnerability).
