import { SodiumCryptoEngine } from '@/modules/crypto/engines/SodiumCryptoEngine';
import { Vault } from '@/modules/vault/Vault';

export function createServices() {
  const crypto = new SodiumCryptoEngine();
  const vault = new Vault(crypto);

  return { vault };
}

export const services = createServices();
