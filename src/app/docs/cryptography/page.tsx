export default function CryptographyPage() {
  return (
    <>
      <h1 className="mb-12">Cryptographic Design</h1>

      <div className="mb-18">
        <h2 className="mb-4">Key derivation</h2>
        <p>
          Your master password never touches storage. On unlock, it&apos;s run
          through Argon2id with a per-vault salt (16 bytes, stored alongside the
          vault) to derive a master key. Argon2id parameters are tuned for a
          balance of security and usability on typical consumer hardware: 64MB
          memory limit, 2 iterations (opsLimit). The derived master key (32
          bytes) is never persisted, it is used to derive sub keys and
          discarded.
        </p>
      </div>

      <div className="mb-18">
        <h3 className="mb-2">Session key handling</h3>
        <p>
          Derived keys exist only in memory for the lifetime of the session.
          Closing the app, locking the vault, or ending the session clears all
          keys — master key and subkeys alike — from memory, requiring the
          master password (and a fresh Argon2id derivation) to unlock again.
        </p>
      </div>

      <div className="mb-18">
        <h3 className="mb-2">Key separation</h3>
        <p className="mb-4">
          Rather than using the master key directly for every operation, subkeys
          are derived from it using libsodium&apos;s{' '}
          <code className="mx-1">crypto_kdf_derive_from_key</code> (a
          BLAKE2b-based KDF), with each subkey scoped to a distinct context and
          purpose:
        </p>
        <ul>
          <li>
            <strong>VaultKey </strong> — encrypts the vault as a whole when
            persisting to storage
          </li>
          <li>
            <strong>EntryKey </strong> — encrypts individual password entries
          </li>
          <li>
            <strong>ExportKey </strong> (planned) — will encrypt data for the
            upcoming export feature
          </li>
        </ul>
      </div>

      <div className="mb-18">
        <h2 className="mb-4">Entry encryption</h2>
        <p>
          Each password entry is encrypted individually using ChaCha20-Poly1305,
          with a unique 24-byte nonce generated per encryption operation.
          Encrypting entries independently — rather than only as part of one
          large blob — limits the blast radius of any single decryption and
          avoids reusing nonces across entries, which is critical for
          ChaCha20-Poly1305&apos;s security guarantees.
        </p>
      </div>

      <div>
        <h2 className="mb-4">Vault persistence</h2>
        <p>
          On top of per-entry encryption, the vault as a whole is encrypted
          again when persisted to storage. This means data at rest is protected
          at two layers: individual entries are independently encrypted, and the
          aggregate vault structure is encrypted before being written to
          IndexedDB.
        </p>
      </div>
    </>
  );
}
