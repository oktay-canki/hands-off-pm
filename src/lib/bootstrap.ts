import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';
import CryptoService from '@/modules/crypto/CryptoService';

export async function createServices() {
  // CRYPTO
  const sodium = await initSodium();
  const provider = createSodiumProvider(sodium);
  const crypto = new SodiumCryptoEngine(provider);
  const cryptoService = new CryptoService(crypto);

  return { cryptoService };
}

export const servicesPromise = createServices();
