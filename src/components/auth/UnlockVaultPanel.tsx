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

  useSyncExternalStore(
    (onStoreChange) => vaultService.subscribe(onStoreChange),
    () => vaultService.getSnapshot(),
    () => SERVER_SNAPSHOT,
  );

  const username = vaultService.getUserId();

  async function loadUser(uname: string) {
    if (!uname) return;

    setIsLoading(true);
    try {
      const normalizedUsername = uname.trim();
      await vaultService.load(normalizedUsername);
    } catch (error) {
      let msg = 'Failed to load vault';

      if (error instanceof Error && error.message) msg = error.message;

      toast.error(msg);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function unlockVault(username: string, masterPassword: string) {
    if (!username || !masterPassword) {
      toast.error("Username or masterpassword can't be empty");
      return;
    }

    setIsLoading(true);
    try {
      await vaultService.unlock(masterPassword);
    } catch (error) {
      let msg = 'Failed to unlock vault';

      if (error instanceof Error && error.message) msg = error.message;

      toast.error(msg);
      console.log(error);
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

  if (!username)
    return (
      <>
        <LoadUserForm onSubmit={loadUser} isLoading={isLoading} />
        <div className="w-8/12 mx-auto flex items-center justify-center gap-4 my-12 px-2">
          <div className="flex-1 bg-surface h-0.5"></div>
          <div className="w-1 h-1 rounded-full bg-surface"></div>
          <div className="flex-1 bg-surface h-0.5"></div>
        </div>
        <Link href="/auth/register">
          <Button className="w-full" variant="accent-outline" size="lg">
            Create Vault
          </Button>
        </Link>
      </>
    );

  return (
    <UnlockVaultForm
      username={username!}
      onSubmit={unlockVault}
      onSwitchUser={switchUser}
      isLoading={isLoading}
    />
  );
};

export default UnlockVaultPanel;
