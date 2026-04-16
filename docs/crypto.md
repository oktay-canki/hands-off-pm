# Library: Libsodium

- strong encryption primitives
- built-in authentication (AEAD)
- safe nonce/IV requirements
- secure key derivation (Argon2)

# Key Derivation

## Master Key Derivation

Function: Argon2id

- Memory-hard password-based KDF
- Protects against offline brute-force attacks
- Recommended modern standard

### Parameters

Time cost: 3
Memory cost: 64 MB
Parallelism: 1
Output: 32 bytes

## Sub Key Derivation

Function: crypto_kdf_derive_from_key (libsodium)

- Used for domain-separated key derivation from master key

Inputs:

- Master Key (32 bytes)
- Context (8-byte string, unique per purpose)
- Subkey ID (uint32)

Output:

- 32-byte derived key

## Key Hierarchy

1. MASTER KEY
   a. ENTRY KEY (masterKey + 'entry' + entryId -> entryKey)
   b. VAULT KEY (masterKey -> vaultKey)
   c. EXPORT KEY (masterKey -> exportKey)
   d. SYNC KEY (masterKey -> syncKey)

# Encryption

## Algorithm: XChaCha20-Poly1305

- AEAD encryption (confidentiality + integrity)
- Safe nonce handling
- Used in modern secure systems

Nonce:

- 24 bytes (192-bit)
- Must be unique per encryption operation
- Randomly generated per message

### Salt Handling

- Salts will be randomly generated Uint8Array's
- Common salt length will be 16 bytes
