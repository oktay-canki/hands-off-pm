export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  salt?: string;
  tag?: string;
  algorithm: 'XChaCha20-Poly1305';
  encryptionVersion: number;
};
