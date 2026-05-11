const CRYPTO_PWHASH_ALG_ARGON2ID13 = 2;
const SIXTY_FOUR_MB = 64 * 1024 * 1024;

export const CRYPTO_CONFIG: {
  current: number;
  versions: Record<number, CryptoConfig>;
} = {
  current: 1,
  versions: {
    1: {
      constants: {
        saltLength: 16, // bytes
        nonceLength: 24, // bytes
      },
      kdf: {
        masterKeyLength: 32,
        subKeyLength: 32,
        opsLimit: 2, // INTERACTIVE default
        memLimit: SIXTY_FOUR_MB, // INTERACTIVE default
        algorithm: CRYPTO_PWHASH_ALG_ARGON2ID13, // argon2id v1.3
      },
    },
  },
} as const;

export type CryptoVersion = keyof typeof CRYPTO_CONFIG.versions;
export type CryptoConfig = {
  readonly constants: {
    saltLength: number;
    nonceLength: number;
  };
  kdf: {
    masterKeyLength: number;
    subKeyLength: number;
    opsLimit: number;
    memLimit: number;
    algorithm: number;
  };
};

export function getCryptoConfig(version: CryptoVersion): CryptoConfig {
  const config = CRYPTO_CONFIG.versions[version];

  if (!config) {
    throw new Error(`Unsupported crypto version: ${version}`); // TODO: standardize with custom errors
  }

  return config;
}

export function getCurrentCryptoConfig(): CryptoConfig {
  return getCryptoConfig(CRYPTO_CONFIG.current);
}
