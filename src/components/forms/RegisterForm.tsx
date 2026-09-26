'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import Input from '@/components/common/Input';
import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { useState } from 'react';
import { toast } from 'sonner';

const RegisterForm = () => {
  const vaultService = useVault();

  const [username, setUsername] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (isLoading) return;

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !masterPassword) {
      toast.error('Username and master password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const exists = await vaultService.vaultExists(trimmedUsername);

      if (exists) {
        toast.error('A vault with this username already exists.');
        return;
      }

      await vaultService.register(trimmedUsername, masterPassword);

      setUsername('');
      setMasterPassword('');

      toast.success('Created a new vault');
    } catch (error) {
      console.error('Failed to create vault:', error);

      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to create new vault.';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-username" className="text-sm font-medium">
          Username
        </label>

        <Input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          autoFocus
          disabled={isLoading}
          required
          variant="outline"
          size="lg"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-master-password"
          className="text-sm font-medium"
        >
          Master Password
        </label>

        <PasswordInput
          id="register-master-password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          placeholder="Master Password"
          autoComplete="new-password"
          disabled={isLoading}
          required
          minLength={8}
          variant="outline"
          size="lg"
          className="w-full"
        />

        <p className="small-text mt-1 text-accent">
          <strong>Important:</strong> Your master password cannot be recovered.
          Make sure it is strong and difficult to guess.
        </p>
      </div>

      <Button type="submit" disabled={isLoading} size="lg" className=" w-full">
        {isLoading ? <ButtonLoader /> : 'Create Vault'}
      </Button>
    </form>
  );
};

export default RegisterForm;
