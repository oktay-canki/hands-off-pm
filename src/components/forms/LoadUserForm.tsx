'use client';

import { SubmitEvent, useState } from 'react';
import ButtonLoader from '@/components/common/ButtonLoader';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

type Props = {
  onSubmit: (username: string) => void;
  isLoading: boolean;
};

export default function LoadUserForm({ onSubmit, isLoading }: Props) {
  const [username, setUsername] = useState('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    onSubmit(username);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoFocus={true}
        className="w-full text-center"
        size="lg"
        variant="outline"
      />

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? <ButtonLoader /> : 'Continue'}
      </Button>
    </form>
  );
}
