import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <>
      <h1>Architecture &amp; Tech Stack</h1>

      <p>
        The application is built with Next.js and TypeScript, with a client-side
        architecture focused on keeping sensitive vault data within the
        user&apos;s device. Cryptographic operations and vault processing are
        isolated from the main UI thread and persisted data remains encrypted at
        rest.
      </p>

      <h2>Stack</h2>

      <p>
        The application uses <strong>Next.js</strong> and{' '}
        <strong>TypeScript</strong> for the frontend. Next.js provides the
        application structure and routing while TypeScript provides static type
        safety across the codebase.
      </p>

      <p>
        Cryptographic operations are implemented using{' '}
        <strong>libsodium</strong> rather than custom cryptographic primitives.
        See <Link href="/docs/cryptography">Cryptographic Design</Link> for the
        algorithms and key hierarchy.
      </p>

      <p>
        Vault operations run inside a dedicated <strong>Web Worker</strong>. The
        main thread communicates with the worker through{' '}
        <strong>Comlink</strong>, which provides an RPC-style interface over the
        browser&apos;s <code>postMessage</code> API.
      </p>

      <p>
        This keeps sensitive operations such as unlocking, encryption,
        decryption, and vault manipulation outside the main UI thread. The
        worker also maintains the in-memory unlocked vault state for the current
        application context.
      </p>

      <h2>Module Structure</h2>

      <p>
        The application is divided into modules according to their
        responsibilities. The main vault-related modules are:
      </p>

      <ul>
        <li>
          <strong>crypto</strong> — provides key derivation, subkey derivation,
          encryption, and decryption using libsodium primitives.
        </li>

        <li>
          <strong>vault</strong> — manages vault data and coordinates
          encryption, decryption, import/export, versioning, and merge
          operations. It does not directly manage persistent storage.
        </li>

        <li>
          <strong>storage</strong> — manages persistence using IndexedDB. It
          stores encrypted vault data and device metadata without requiring
          access to plaintext vault contents or cryptographic keys.
        </li>
      </ul>

      <h2>Vault Synchronization &amp; Merge Model</h2>

      <p>
        Vault items carry a device identifier and version number. These values
        are used when importing encrypted backups to determine whether an
        incoming item can be merged automatically or requires user intervention.
      </p>

      <p>
        Changes originating from the same device can be resolved using the
        item&apos;s version. Items originating from different devices are
        treated as conflicts rather than assuming that one device&apos;s version
        number is globally newer.
      </p>

      <p>
        When conflicts are detected during an import, the application presents a
        dedicated conflict-resolution interface that allows the user to choose
        between the local and imported versions.
      </p>

      <p>
        See <Link href="/docs/export-import">Export &amp; Import</Link> and{' '}
        <Link href="/docs/tradeoffs-limitations">
          Trade-offs &amp; Limitations
        </Link>{' '}
        for the detailed behavior and limitations of this model.
      </p>

      <h2>Web Worker Isolation</h2>

      <p>
        The vault worker provides an architectural boundary between the UI and
        the sensitive in-memory vault state. The main thread communicates with
        the worker through Comlink rather than directly manipulating unlocked
        vault data.
      </p>

      <p>
        This separation reduces the amount of sensitive logic that needs to
        execute as part of the UI layer. It is not, however, a security boundary
        against a fully compromised browser environment. JavaScript running with
        the application can ultimately interact with the application&apos;s
        runtime.
      </p>

      <h2>A Note on Next.js</h2>

      <p>
        Next.js is used primarily as the application framework and routing
        layer. Its server-capable architecture does not mean that vault
        plaintext or derived cryptographic keys are sent to a server.
      </p>

      <p>
        Any future server-side functionality would need to respect the
        application&apos;s existing trust boundaries. Features involving
        server-side storage or processing would therefore require an explicit
        architectural decision and corresponding documentation of their security
        implications.
      </p>
    </>
  );
}
