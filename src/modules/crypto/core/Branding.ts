type Branded<T, B extends string> = T & {
  readonly __brand: B;
};

export type Plaintext = Branded<Uint8Array, 'plaintext'>;
export type Ciphertext = Branded<Uint8Array, 'ciphertext'>;
