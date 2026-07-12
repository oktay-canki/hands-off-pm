'use client';
import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { useState } from 'react';

const RegisterForm = () => {
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
      await register();
    } finally {
      setIsLoading(false);
    }
  }

  async function register() {
    if (await vaultService.vaultExists(username)) {
      alert('A vault with this username already exists');
      return;
    }

    if (!username || !masterPassword) return;

    try {
      await vaultService.register(username.trim(), masterPassword);
      clearFormFields();
      alert('Successfully created a new vault registry');
    } catch (error) {
      if (error instanceof Error)
        alert(error.message || 'Failed to create new vault registry');
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Create a new account</label>
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
        {!isLoading ? 'Register' : 'Loading...'}
      </button>
    </form>
  );
};

export default RegisterForm;
