import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <>
      <h1 className="mb-12">Architecture & tech stack</h1>

      <div className="mb-18">
        <h2 className="mb-4">Stack</h2>
        <p className="mb-4">
          The app is built with Next.js and TypeScript. Next.js was chosen
          primarily for its flexibility — even though the app currently runs
          entirely client-side, it leaves room to add server-side functionality
          later (e.g., local hosting backup operations) without a framework
          rewrite, should that ever become a deliberate, opt-in feature.
        </p>
        <p className="mb-4">
          All cryptographic operations are handled via libsodium rather than
          custom implementations — see{' '}
          <Link href="/docs/cryptography" className="underline">
            Cryptographic Design
          </Link>{' '}
          for specifics. Vault operations run inside a dedicated Web Worker,
          communicated with via Comlink
        </p>
        <p>
          Comlink wraps<code className="mx-1">postMessage</code> message-passing
          in a simpler RPC-style API. This keeps unlock, encryption, and
          decryption logic isolated from the main thread — see{' '}
          <Link
            href="/docs/tradeoffs-limitations/#tab-scoped-unlocked-state"
            className="underline"
          >
            Tab-Scoped Unlocked State
          </Link>{' '}
          and{' '}
          <Link href="/docs/tradeoffs-limitations" className="underline">
            Trade-offs & Limitations
          </Link>{' '}
          for what that isolation does and doesn&apos;t guarantee.
        </p>
      </div>

      <div className="mb-18">
        <h2 className="mb-4">Module structure</h2>
        <p className="mb-4">
          The core logic is split into three modules, each with a single
          responsibility:
        </p>
        <ul>
          <li>
            <strong>crypto </strong> — handles key derivation (Argon2id), subkey
            derivation (<code className="mx-1">crypto_kdf_derive_from_key</code>
            ), and all encryption/decryption operations (ChaCha20-Poly1305).
          </li>
          <li>
            <strong>vault </strong> — manages vault and entry structure,
            orchestrating calls to <code className="mx-1">crypto</code> for
            encrypting/decrypting entries and the vault as a whole. Contains no
            direct storage logic.
          </li>
          <li>
            <strong>storage </strong> — handles persistence to IndexedDB. Only
            ever reads/writes already-encrypted data; has no access to keys or
            plaintext.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2">A note on using a server-capable framework</h3>
        <p>
          Choosing Next.js is a pragmatic decision, not a hint that plaintext or
          keys will ever touch a server. If server-side functionality is added
          in the future, it will be scoped explicitly to never receive plaintext
          vault data or derived keys — consistent with the trust boundaries
          described earlier. Any such feature will be opt-in and documented as
          its own addition to the threat model, not a silent expansion of it.
        </p>
      </div>
    </>
  );
}
