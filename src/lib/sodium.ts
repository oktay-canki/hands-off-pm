import sodium from 'libsodium-wrappers';

export async function initSodium(): Promise<typeof sodium> {
  await sodium.ready;

  return sodium;
}
