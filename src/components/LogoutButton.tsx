'use client';
import { useVault } from '@/context/VaultContext';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const vault = useVault();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch {
      alert('Failed to safely logout');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await vault.lock();
  };

  return (
    <button onClick={handleLogout}>
      {!isLoading ? 'Logout' : 'Locking Vault...'}
    </button>
  );
}
