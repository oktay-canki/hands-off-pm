'use client';

import LogoutButton from '@/components/auth/LogoutButton';
import { useVault } from '@/context/VaultContext';
import { CircleUserRound } from 'lucide-react';

function SessionInfo() {
  const vault = useVault();

  return (
    <div className="flex ml-auto mr-10 w-fit gap-2">
      <div className="flex items-center justify-center gap-2 bg-surface text-background pr-4 rounded-lg">
        <LogoutButton />

        <div className="flex items-center justify-center gap-2 large-text">
          <CircleUserRound size={24} strokeWidth={1} className="inline-block" />{' '}
          {vault.getUserId() ?? 'none'}
        </div>
      </div>
    </div>
  );
}

export default SessionInfo;
