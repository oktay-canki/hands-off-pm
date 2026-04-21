import sodium from 'libsodium-wrappers-sumo';

export async function initSodium(): Promise<typeof sodium> {
  await sodium.ready;

  return sodium;
}
