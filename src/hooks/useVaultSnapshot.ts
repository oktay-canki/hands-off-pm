'use client';
import { useVault } from '@/context/VaultContext';
import type { VaultSnapshot } from '@/modules/vault/VaultService';
import { useCallback, useSyncExternalStore } from 'react';

export const SERVER_SNAPSHOT: VaultSnapshot = {
  status: {
    isLocked: true,
    isLoading: false,
    error: null,
  },
  entries: [],
};

function useVaultSnapshot() {
  const vault = useVault();

  return useSyncExternalStore(
    useCallback((onStoreChange) => vault.subscribe(onStoreChange), [vault]),
    useCallback(() => vault.getSnapshot(), [vault]),
    () => SERVER_SNAPSHOT,
  );
}

export default useVaultSnapshot;
