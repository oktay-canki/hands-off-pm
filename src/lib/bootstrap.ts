import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';
import CryptoService from '@/modules/crypto/CryptoService';

export async function createCryptoService() {
  const sodium = await initSodium();
  const provider = createSodiumProvider(sodium);
  const cryptoEngine = new SodiumCryptoEngine(provider);
  const cryptoService = new CryptoService(cryptoEngine);

  return { cryptoService };
}
