'use client';
import PasswordInput from '@/components/common/PasswordInput';
import { CircleUserRound, RotateCw } from 'lucide-react';
import { SubmitEvent, useState } from 'react';
import ButtonLoader from '@/components/common/ButtonLoader';
import Button from '@/components/common/Button';

type Props = {
  username: string;
  onSubmit: (username: string, password: string) => void;
  onSwitchUser: () => void;
  isLoading: boolean;
};

export default function UnlockVaultForm({
  username,
  onSubmit,
  onSwitchUser,
  isLoading,
}: Props) {
  const [masterPassword, setMasterPassword] = useState('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    onSubmit(username, masterPassword);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full flex items-center justify-center shrink-0 gap-1 mb-4">
        <h3 className="heading w-fit">{username}</h3>
        <Button
          onClick={onSwitchUser}
          className="rounded-full p-0 h-8 w-8 self-end mb-1.5"
          variant="accent"
        >
          <RotateCw size={18} />
        </Button>
      </div>

      <PasswordInput
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        autoFocus={true}
        containerClassName="w-full mb-4"
        className="text-center"
        variant="outline"
        size="lg"
      />

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? <ButtonLoader /> : 'Unlock Vault'}
      </Button>
    </form>
  );
}
