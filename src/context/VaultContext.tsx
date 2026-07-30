'use client';
import VaultService from '@/modules/vault/VaultService';
import { createContext, ReactNode, useContext, useMemo } from 'react';

const VaultContext = createContext<VaultService | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const vaultService = useMemo(() => new VaultService(), []);

  return (
    <VaultContext.Provider value={vaultService}>
      {children}
    </VaultContext.Provider>
  );
}

export const useVault = () => {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used inside VaultProvider');
  return ctx;
};
