const CRYPTO_PWHASH_ALG_ARGON2ID13 = 2;
const SIXTY_FOUR_MB = 64 * 1024 * 1024;

export const CRYPTO_CONFIG = {
  constants: {
    saltLength: 16, // bytes
    nonceLength: 24, // bytes
  },
  kdf: {
    masterKeyLength: 32,
    opsLimit: 2, // INTERACTIVE default
    memLimit: SIXTY_FOUR_MB, // INTERACTIVE default
    algorithm: CRYPTO_PWHASH_ALG_ARGON2ID13, // argon2id v1.3
  },
} as const;
