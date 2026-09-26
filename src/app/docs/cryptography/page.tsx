export default function CryptographyPage() {
  return (
    <>
      <h1>Cryptographic Design</h1>

      <p>
        Cryptography is handled through <strong>libsodium</strong> rather than
        custom cryptographic implementations. The design separates key
        derivation, vault encryption, and individual entry encryption so that
        cryptographic keys have distinct purposes.
      </p>

      <h2>Key Derivation</h2>

      <p>
        The master password is never persisted. When the vault is unlocked, the
        password is processed using <strong>Argon2id </strong> together with the
        vault&apos;s unique salt.
      </p>

      <p>
        The vault salt is 16 bytes and is stored alongside the encrypted vault
        data. Argon2id is configured with a 64 MB memory limit and 2 iterations.
        These parameters are intended to provide a practical balance between
        password-guessing resistance and unlock performance on typical consumer
        hardware.
      </p>

      <p>
        Argon2id produces a 32-byte master key. The master key exists only in
        memory and is used as the root key from which purpose-specific subkeys
        are derived.
      </p>

      <h2>Session Key Handling</h2>

      <p>
        Derived cryptographic keys exist only in memory while the vault is
        unlocked. They are not persisted to IndexedDB or included in exported
        vault data.
      </p>

      <p>
        When the vault is locked or the active vault session is terminated, the
        in-memory cryptographic state is discarded. Unlocking the vault again
        therefore requires the master password and a new Argon2id derivation.
      </p>

      <h2>Key Separation</h2>

      <p>
        The master key is not used directly for every encryption operation.
        Instead, purpose-specific subkeys are derived using libsodium&apos;s{' '}
        <code>crypto_kdf_derive_from_key</code>, a BLAKE2b-based key derivation
        function.
      </p>

      <p>
        Separating keys by purpose prevents the same derived key from being
        reused across unrelated cryptographic operations.
      </p>

      <ul>
        <li>
          <strong>VaultKey</strong> — used for encrypting the vault structure
          when it is persisted.
        </li>
        <li>
          <strong>EntryKey</strong> — used for encrypting individual vault
          items.
        </li>
      </ul>

      <h2>Entry Encryption</h2>

      <p>
        Vault items are encrypted individually using{' '}
        <strong>ChaCha20-Poly1305</strong>. Each encryption operation receives a
        newly generated 24-byte nonce.
      </p>

      <p>
        Encrypting items independently means that the encrypted representation
        of one item does not require re-encrypting every other item. It also
        allows each encryption operation to use its own nonce rather than
        reusing a nonce across multiple ciphertexts.
      </p>

      <h2>Vault Persistence</h2>

      <p>
        In addition to encrypting individual vault items, the vault structure is
        encrypted before it is persisted to IndexedDB.
      </p>

      <p>
        As a result, the persistent representation does not contain the
        plaintext vault or plaintext entry contents. IndexedDB acts as a storage
        layer for encrypted data rather than as a location where decrypted vault
        contents or cryptographic keys are stored.
      </p>

      <h2>Exported Backups</h2>

      <p>
        Exported vault backups are protected separately from the active vault
        session. An export password is required to create a backup and is
        required again to read that backup during import.
      </p>

      <p>
        The export password is independent from the vault&apos;s master
        password. For the complete export, import, merge, and conflict
        resolution workflow, see{' '}
        <a href="/docs/export-import">Export &amp; Import</a>.
      </p>
    </>
  );
}
