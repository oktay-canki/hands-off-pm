import sodium from 'libsodium-wrappers';

export async function initSodium() {
  await sodium.ready;
  return sodium;
}
