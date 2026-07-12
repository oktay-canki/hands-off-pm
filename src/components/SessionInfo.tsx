'use client';

import LogoutButton from '@/components/LogoutButton';
import { useVault } from '@/context/VaultContext';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';

function SessionInfo() {
  const vault = useVault();
  const snapshot = useVaultSnapshot();
  const { status } = snapshot;

  return (
    <div>
      <div>🔒 Locked: {String(status.isLocked)}</div>
      <div>⏳ Loading: {String(status.isLoading)}</div>
      <div>👤 UserId: {vault.getUserId() ?? 'none'}</div>
      <div>📦 Entries: {snapshot ? snapshot.entries.length : NaN}</div>
      {status.error && <div>❌ Error: {status.error.message}</div>}
      <LogoutButton />
    </div>
  );
}

export default SessionInfo;
