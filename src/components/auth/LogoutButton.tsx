'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import { useVault } from '@/context/VaultContext';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const vault = useVault();

  async function handleLogout() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await vault.lock();
    } catch {
      toast.error('Failed to safely log out.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={isLoading}
      aria-label="Log out"
      className="text-surface hover:bg-primary hover:text-danger"
    >
      {isLoading ? (
        <ButtonLoader />
      ) : (
        <LogOut className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}
