'use client';

import Button from '@/components/common/Button';
import LoadUserForm from '@/components/forms/LoadUserForm';
import UnlockVaultForm from '@/components/forms/UnlockVaultForm';
import { useVault } from '@/context/VaultContext';
import { SERVER_SNAPSHOT } from '@/hooks/useVaultSnapshot';
import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

const UnlockVaultPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const vaultService = useVault();

  const snapshot = useSyncExternalStore(
    vaultService.subscribe,
    vaultService.getSnapshot,
    () => SERVER_SNAPSHOT,
  );

  const username = snapshot.userId;

  async function loadUser(uname: string) {
    const normalizedUsername = uname.trim();

    if (!normalizedUsername) return;

    setIsLoading(true);

    try {
      await vaultService.load(normalizedUsername);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to load vault';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function unlockVault(_username: string, masterPassword: string) {
    if (!masterPassword) {
      toast.error("Master password can't be empty");
      return;
    }

    setIsLoading(true);

    try {
      await vaultService.unlock(masterPassword);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to unlock vault';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  function switchUser() {
    try {
      vaultService.clearUser();
    } catch {
      toast.error('Failed to clear current user information');
    }
  }

  if (!username) {
    return (
      <div className="flex w-full flex-col">
        <LoadUserForm onSubmit={loadUser} isLoading={isLoading} />

        <Link href="/auth/register" className="mt-6 self-center">
          <Button variant="accent-outline" size="md">
            Create a new vault
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <UnlockVaultForm
        username={username}
        onSubmit={unlockVault}
        isLoading={isLoading}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={switchUser}
        disabled={isLoading}
        className="mt-4 self-center text-surface/60 hover:text-surface"
      >
        Switch user
      </Button>
    </div>
  );
};

export default UnlockVaultPanel;
