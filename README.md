# HandsoffPM

A self-hosted, browser-based password manager built with Next.js and TypeScript. HandsoffPM is designed around local-first storage, client-side cryptography, and user-controlled encrypted backups.

[Live Preview](https://handsoffpm.vercel.app) · [Documentation](https://handsoffpm.vercel.app/docs)

> **Project status**
>
> HandsoffPM is an actively developed personal project and has not undergone a formal security audit. It should not be used to store high-value or production credentials. The project is primarily intended to demonstrate application architecture, client-side cryptography, local persistence, and secure data-handling practices.

## Overview

HandsoffPM takes a local-first approach to password management. Vault data is encrypted in the browser and persisted locally using IndexedDB rather than being stored in a centralized password-management service.

The application does not require a user account or a backend service for normal vault operations. The project is designed to be self-hosted, giving users control over the application and its deployment environment.

The goal is not to eliminate trust entirely, but to reduce the amount of infrastructure that must be trusted with sensitive vault data.

## Key Features

- Client-side vault encryption using established cryptographic primitives
- Argon2id password-based key derivation
- ChaCha20-Poly1305 authenticated encryption
- Individual entry encryption with an additional encrypted vault layer
- Cryptographic operations isolated in a Web Worker
- Encrypted IndexedDB persistence
- In-memory key management with keys cleared when the vault is locked
- Encrypted export and import using a separate export password
- Device identifiers and per-item versioning for multi-device synchronization
- Conflict detection and manual conflict resolution
- Soft deletion and tombstones to prevent deleted entries from being unintentionally restored
- Documented threat model, trade-offs, and security limitations

## Architecture

The application is structured around several distinct responsibilities:

- **Application layer** — UI, user interactions, forms, and application state
- **Vault layer** — vault lifecycle, entries, versioning, merging, and conflict handling
- **Cryptography layer** — key derivation, encryption, decryption, and key management
- **Storage layer** — encrypted IndexedDB persistence
- **Worker layer** — isolates cryptographic and vault operations from the main UI thread
- **Export/import layer** — encrypted backups and cross-device merge handling

The application is built with Next.js and TypeScript, while cryptographic primitives are provided by libsodium rather than implemented manually.

For a detailed explanation of the architecture and data flow, see the [Architecture & Stack documentation](https://handsoffpm.vercel.app/docs/architecture).

## Cryptography

HandsoffPM uses libsodium for its cryptographic operations.

The current design includes:

- Argon2id for deriving the vault's master key from the master password
- Per-vault salts for password-based key derivation
- ChaCha20-Poly1305 for authenticated encryption
- Separate derived keys for different encryption purposes
- Random nonces for encryption operations
- In-memory handling of encryption keys

The project does not implement its own cryptographic primitives.

See the [Cryptography documentation](https://handsoffpm.vercel.app/docs/cryptography) for the complete design and parameters.

## Storage and Backups

Vault data is persisted locally using IndexedDB. Persistent storage is requested where supported, but browser storage is not treated as a backup mechanism.

Users can export an encrypted backup and later import it into another instance. Exported vaults contain encrypted data and are protected by a separate export password.

Importing a vault does not simply overwrite the existing vault. Items are merged using item identifiers, device identifiers, version information, and tombstones. Conflicting changes are presented for manual resolution.

See the [Storage documentation](https://handsoffpm.vercel.app/docs/storage) and [Export & Import documentation](https://handsoffpm.vercel.app/docs/export-import).

## Threat Model

The security model focuses on keeping plaintext vault data and encryption keys out of centralized infrastructure and persistent storage.

The design considers threats including:

- Server-side compromise
- Network exposure of vault data
- Unauthorized access to stored ciphertext
- Unauthorized access to exported encrypted backups
- Loss or clearing of browser storage

The application does not attempt to protect against a compromised device, malicious browser extensions, keyloggers, compromised application code, or a compromised self-hosting environment.

See the [Threat Model](https://handsoffpm.vercel.app/docs/threat-model) for the complete scope and assumptions.

## Trade-offs and Limitations

The local-first design introduces several limitations.

There is currently no master-password recovery mechanism. Losing the master password means losing access to the encrypted vault.

Browser storage can be cleared or lost, so independent encrypted backups are necessary for data recovery.

The Web Worker provides separation from the main UI thread, but it is not treated as a complete security boundary. JavaScript memory and message passing also impose practical limitations on how strongly sensitive data can be isolated.

Multi-device synchronization is handled through encrypted export/import rather than a centralized synchronization service.

These and other design decisions are documented in [Trade-offs & Limitations](https://handsoffpm.vercel.app/docs/tradeoffs-limitations).

## Technology Stack

| Technology   | Purpose                                       |
| ------------ | --------------------------------------------- |
| Next.js      | Application framework                         |
| TypeScript   | Application language and type safety          |
| Tailwind CSS | UI styling                                    |
| libsodium    | Cryptographic primitives                      |
| Web Workers  | Background vault and cryptographic operations |
| Comlink      | Worker communication                          |
| IndexedDB    | Local encrypted persistence                   |
| Zod          | Runtime input validation                      |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone git@github.com:oktay-canki/hands-off-pm.git
cd hands-off-pm
npm install
```

### Development

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test
npm run check
```

`npm run check` runs the project's automated validation checks.

## Project Documentation

The full technical documentation is available under [`/docs`](https://handsoffpm.vercel.app/docs):

- [Overview](https://handsoffpm.vercel.app/docs/overview)
- [Architecture & Stack](https://handsoffpm.vercel.app/docs/architecture)
- [Cryptography](https://handsoffpm.vercel.app/docs/cryptography)
- [Storage](https://handsoffpm.vercel.app/docs/storage)
- [Export & Import](https://handsoffpm.vercel.app/docs/export-import)
- [Threat Model](https://handsoffpm.vercel.app/docs/threat-model)
- [Trade-offs & Limitations](https://handsoffpm.vercel.app/docs/tradeoffs-limitations)

## License

This project is licensed under a custom Personal Use and Educational License.

See [LICENSE](./LICENSE) for details.

## Feedback

Bug reports, observations, and design critiques are welcome. Please open an issue for general feedback or non-sensitive problems.

## Security

If you discover a security vulnerability, please do not open a public issue.

Follow the instructions in the [Security Policy](./SECURITY.md) for reporting security vulnerabilities.
