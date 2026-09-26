'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import PasswordInput from '@/components/common/PasswordInput';
import { useEffect, useRef, useState } from 'react';

type Props = {
  username: string;
  onSubmit: (username: string, password: string) => void;
  isLoading: boolean;
};

export default function UnlockVaultForm({
  username,
  onSubmit,
  isLoading,
}: Props) {
  const [masterPassword, setMasterPassword] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      passwordInputRef.current?.focus();
    }
  }, [isLoading]);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (isLoading || !masterPassword) return;

    onSubmit(username, masterPassword);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center">
      <div className="mb-6 flex max-w-full items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-surface"
          aria-hidden="true"
        >
          {username.charAt(0).toUpperCase()}
        </div>

        <span className="truncate text-base font-medium text-surface">
          {username}
        </span>
      </div>

      <PasswordInput
        ref={passwordInputRef}
        id="unlock-master-password"
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        autoComplete="current-password"
        disabled={isLoading}
        placeholder="Master Password"
        variant="outline"
        size="lg"
        className="text-center"
      />

      <Button
        type="submit"
        disabled={isLoading || !masterPassword}
        size="lg"
        className="mt-5 w-full"
      >
        {isLoading ? <ButtonLoader /> : 'Unlock Vault'}
      </Button>
    </form>
  );
}
