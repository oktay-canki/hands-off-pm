import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { Vault } from '@/modules/vault/Vault';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';

export async function createServices() {
  const sodium = await initSodium();
  const provider = createSodiumProvider(sodium);
  const crypto = new SodiumCryptoEngine(provider);
  const vault = new Vault(crypto);

  return { crypto, vault };
}

export const servicesPromise = createServices();
