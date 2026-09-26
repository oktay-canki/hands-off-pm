'use client';

import { useVault } from '@/context/VaultContext';
import { CircleUserRound } from 'lucide-react';

export default function SessionInfo() {
  const vault = useVault();
  const userId = vault.getUserId();

  return (
    <div className="flex items-center gap-2">
      <CircleUserRound
        className="size-5 shrink-0 text-surface"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <span className="body-text max-w-40 truncate text-surface/80">
        {userId ?? 'No user'}
      </span>
    </div>
  );
}
