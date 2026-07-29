'use client';
import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { useState } from 'react';
import ButtonLoader from '@/components/common/ButtonLoader';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { toast } from 'sonner';

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
      toast.error('A vault with this username already exists');
      return;
    }

    if (!username || !masterPassword) return;

    try {
      await vaultService.register(username.trim(), masterPassword);
      clearFormFields();
      toast.success('Created a new vault');
    } catch (error) {
      let msg = 'Failed to create new vault registry';
      if (error instanceof Error && error.message) msg = error.message;

      toast.error(msg);
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        autoFocus={true}
        variant="outline"
        size="lg"
        className="w-full text-center mb-4"
        required
      />

      <PasswordInput
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        variant="outline"
        size="lg"
        className="text-center"
        containerClassName="mb-1"
        placeholder="Master Password"
        required
        minLength={8}
      />
      <p className="text-accent small-text mb-8">
        <strong>Important</strong>: Masterpassword is un-recoverable. Make sure
        your masterpassword is a strong and hard to guess password.
      </p>

      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
        {isLoading ? <ButtonLoader /> : 'Create Vault'}
      </Button>
    </form>
  );
};

export default RegisterForm;
