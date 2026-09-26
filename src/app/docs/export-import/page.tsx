import Link from 'next/link';

export default function ExportImportPage() {
  return (
    <>
      <h1>Export &amp; Import</h1>

      <p>
        The application supports encrypted vault backups through export and
        import. Exported vaults contain encrypted data and can be restored later
        using the password chosen when the backup was created.
      </p>

      <p>
        Importing a backup does not simply replace the current vault. The
        imported items are merged with the existing vault, allowing new items to
        be added while detecting changes that require user review.
      </p>

      <h2>Export</h2>

      <p>
        Export creates an encrypted backup of the current vault. A separate
        export password is required when creating the backup.
      </p>

      <p>
        The export password is independent from the vault&apos;s master
        password. It is used to protect the exported backup and must be provided
        again when importing it.
      </p>

      <p>
        The exported file uses the <code>.json</code> extension. Although the
        file uses JSON as its container format, the vault contents inside it
        remain encrypted.
      </p>

      <h3>Export process</h3>

      <ol>
        <li>Open the vault data settings.</li>
        <li>
          Choose <strong>Export Vault</strong>.
        </li>
        <li>Enter an export password and confirm it.</li>
        <li>The application creates an encrypted backup.</li>
        <li>The backup is downloaded to the device.</li>
      </ol>

      <h2>Import</h2>

      <p>
        Import restores data from a previously exported vault backup. The backup
        password is required to decrypt and read the exported data before it can
        be merged with the current vault.
      </p>

      <p>
        Importing a backup does not automatically discard the current vault.
        Instead, each imported item is compared with the corresponding local
        item.
      </p>

      <h3>Import process</h3>

      <ol>
        <li>Select a previously exported vault file.</li>
        <li>Enter the password used to create that backup.</li>
        <li>The application decrypts the backup.</li>
        <li>Imported items are compared with the current vault.</li>
        <li>Items that can be merged automatically are processed.</li>
        <li>Conflicting items are presented for manual resolution.</li>
      </ol>

      <h2>Merge Behavior</h2>

      <p>
        Import uses the item&apos;s <code>itemId</code> to determine whether an
        incoming item already exists in the current vault.
      </p>

      <ul>
        <li>
          <strong>New item</strong> — if no local item has the same{' '}
          <code>itemId</code>, the imported item is added.
        </li>
        <li>
          <strong>Same device, newer version</strong> — if the item originated
          from the same device and the imported version is newer, the local item
          is updated.
        </li>
        <li>
          <strong>Same device, same or older version</strong> — the imported
          item is skipped because the local version is already at least as
          recent.
        </li>
        <li>
          <strong>Different device</strong> — the item is treated as a conflict
          and requires a user decision.
        </li>
      </ul>

      <p>
        Version numbers are therefore used to resolve changes from the same
        device, but they are not treated as a global ordering between different
        devices.
      </p>

      <h2>Conflict Resolution</h2>

      <p>
        When an imported item has the same <code>itemId</code> as a local item
        but originated from a different device, the application does not
        automatically decide which version should win.
      </p>

      <p>
        Instead, the conflicting versions are presented side by side. The
        interface shows the local version and the imported version and allows
        the user to choose which one to keep.
      </p>

      <p>
        The conflict resolver processes conflicts one at a time. The selected
        imported versions are applied after the conflict-resolution process is
        completed.
      </p>

      <h2>Device IDs &amp; Versioning</h2>

      <p>
        Each installation has a persistent device identifier. Vault items record
        the device from which their changes originated along with a version
        number.
      </p>

      <p>
        This distinction is important when working with backups from multiple
        devices. A version number such as <code>3</code> does not inherently
        mean that it is newer than version <code>2</code> from another device.
      </p>

      <p>
        Changes from the same device can be compared using their version
        numbers. Changes from different devices are instead treated as
        potentially conflicting changes and require explicit user selection.
      </p>

      <h2>What Import Does Not Do</h2>

      <ul>
        <li>It does not replace the current vault with the imported vault.</li>
        <li>
          It does not automatically choose between changes from different
          devices.
        </li>
        <li>
          It does not treat version numbers from different devices as a single
          global sequence.
        </li>
        <li>
          It does not require the export password to be the same as the master
          password.
        </li>
      </ul>

      <h2>Backup Considerations</h2>

      <p>
        An exported backup should be treated as sensitive data. Although the
        vault contents are encrypted, anyone who obtains the file can attempt to
        decrypt it using the export password.
      </p>

      <p>
        Store backups somewhere appropriate and use a strong, unique export
        password. The application does not recover a forgotten export password.
      </p>

      <p>
        For information about the cryptographic mechanisms protecting exported
        data, see <Link href="/docs/cryptography">Cryptographic Design</Link>.
      </p>
    </>
  );
}
