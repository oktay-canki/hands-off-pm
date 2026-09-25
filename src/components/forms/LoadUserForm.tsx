'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import Input from '@/components/common/Input';
import { SubmitEvent, useState } from 'react';

type Props = {
  onSubmit: (username: string) => void;
  isLoading: boolean;
};

export default function LoadUserForm({ onSubmit, isLoading }: Props) {
  const [username, setUsername] = useState('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (isLoading) return;

    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    onSubmit(trimmedUsername);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col">
      <Input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        autoFocus
        disabled={isLoading}
        size="lg"
        variant="outline"
        className="w-full text-center"
        required
      />

      <Button
        type="submit"
        disabled={isLoading || !username.trim()}
        size="lg"
        className="mt-4 w-full"
      >
        {isLoading ? <ButtonLoader /> : 'Continue'}
      </Button>
    </form>
  );
}
