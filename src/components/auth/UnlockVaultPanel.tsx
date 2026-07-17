'use client';
import LoadUserForm from '@/components/forms/LoadUserForm';
import UnlockVaultForm from '@/components/forms/UnlockVaultForm';
import { useVault } from '@/context/VaultContext';
import { SERVER_SNAPSHOT } from '@/hooks/useVaultSnapshot';
import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';

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
      if (error instanceof Error) alert(error.message);
      else {
        alert('Failed to load vault');
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function unlockVault(username: string, masterPassword: string) {
    if (!username || !masterPassword) {
      alert("Username or masterpassword can't be empty");
      return;
    }

    setIsLoading(true);
    try {
      await vaultService.unlock(masterPassword);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      else {
        alert('Failed to unlock vault');
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function switchUser() {
    try {
      vaultService.clearUser();
    } catch {
      alert('Failed to clear current user information');
    }
  }

  if (!username)
    return (
      <>
        <LoadUserForm onSubmit={loadUser} isLoading={isLoading} />
        <Link
          href="/auth/register"
          className="block w-fit mx-auto text-accent underline mt-10 px-4 p-2"
        >
          Create A New Vault
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
