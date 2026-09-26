import Link from 'next/link';

export default function StoragePage() {
  return (
    <>
      <h1>Storage</h1>

      <p>
        The vault is persisted locally using <strong>IndexedDB</strong>.
        Persistent storage is requested when the application starts to reduce
        the risk of the browser automatically evicting stored data under storage
        pressure.
      </p>

      <h2>Storage Persistence &amp; Data Loss</h2>

      <p>
        The application requests persistent storage through{' '}
        <code>navigator.storage.persist()</code>. When the browser grants
        persistent storage, the application&apos;s data is protected from the
        browser&apos;s normal best-effort storage eviction mechanisms.
      </p>

      <p>
        Persistent storage does not make the vault indestructible. It protects
        against automatic eviction, but it cannot prevent deliberate clearing of
        browser or site data.
      </p>

      <h3>Data can be permanently lost if:</h3>

      <ul>
        <li>
          You manually clear browsing data or site data for the application.
        </li>
        <li>
          You use the application in a private or incognito browsing session and
          the browser discards that session&apos;s storage.
        </li>
        <li>
          Browser-specific storage policies remove data for an inactive site.
          Storage behavior can vary between browsers and versions.
        </li>
        <li>
          You switch browsers, browser profiles, devices, or operating system
          user profiles. Browser storage is scoped to its respective storage
          environment and is not automatically shared between them.
        </li>
        <li>
          You uninstall, reset, or otherwise remove the browser&apos;s stored
          application data.
        </li>
      </ul>

      <h2>Why Persistent Storage Is Not a Backup</h2>

      <p>
        Persistent storage reduces the likelihood of losing the vault through
        automatic browser eviction, but it is still local browser storage. It
        does not provide an independent copy of the vault.
      </p>

      <p>
        If the browser storage is deliberately cleared, corrupted, or becomes
        inaccessible, persistent storage cannot restore the lost data. This is
        why local persistence and backups solve different problems.
      </p>

      <h2>Encrypted Backups</h2>

      <p>
        The application provides manual encrypted vault export and import. An
        exported backup provides a copy of the vault outside the browser&apos;s
        local storage environment.
      </p>

      <p>
        Exported backups are protected with a separate export password and can
        later be imported and merged with the current vault. Import does not
        simply replace the existing vault; items are compared and conflicts
        between different devices can be presented for manual resolution.
      </p>

      <p>
        See <Link href="/docs/export-import">Export &amp; Import</Link> for the
        complete backup and merge workflow.
      </p>

      <h2>Storage Boundaries</h2>

      <p>
        IndexedDB stores the vault in encrypted form. The storage layer does not
        need access to the master password, derived cryptographic keys, or
        plaintext vault contents.
      </p>

      <p>
        The browser therefore acts as the persistence layer rather than as a
        trusted location for plaintext secrets. Cryptographic operations and
        unlocked vault state are handled separately from persistent storage.
      </p>

      <h2>Practical Backup Guidance</h2>

      <p>
        Persistent storage should be treated as the application&apos;s normal
        local persistence mechanism, not as a substitute for backups.
      </p>

      <p>
        Create an encrypted export when you need an independent copy of your
        vault, particularly before clearing browser data, moving to another
        device or browser environment, or performing other operations that could
        remove local storage.
      </p>

      <p>
        Keep exported backups somewhere appropriate and protect their export
        passwords. Anyone who obtains a backup file can attempt to decrypt it if
        they also obtain its password.
      </p>
    </>
  );
}
