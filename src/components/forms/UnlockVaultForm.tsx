'use client';
import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { useState } from 'react';

const UnlockVaultForm = () => {
  const vaultService = useVault();
  const [username, setUsername] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function clearFormFields() {
    setUsername('');
    setMasterPassword('');
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await unlock();
    } finally {
      setIsLoading(false);
    }
  }

  async function unlock() {
    if (!username || !masterPassword) return;

    try {
      await vaultService.load(username.trim());
      await vaultService.unlock(masterPassword);
      clearFormFields();
      alert('Successfully unlocked vault');
    } catch (error) {
      if (error instanceof Error)
        alert(error.message ?? 'Failed to unlock vault');
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Unlock vault</label>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <PasswordInput
        placeholder="Password"
        value={masterPassword}
        onChange={(value) => setMasterPassword(value)}
      />
      <button type="submit" disabled={isLoading}>
        Unlock
      </button>
    </form>
  );
};

export default UnlockVaultForm;
