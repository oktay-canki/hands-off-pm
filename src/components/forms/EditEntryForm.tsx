'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import Input from '@/components/common/Input';
import PasswordInputWithGenerator from '@/components/common/PasswordInputWithGenerator';
import Textarea from '@/components/common/Textarea';
import { useVault } from '@/context/VaultContext';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  defaultValues: VaultEntry;
};

export default function EditEntryForm({ defaultValues }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState(defaultValues.title);
  const [username, setUsername] = useState(defaultValues.username ?? '');
  const [password, setPassword] = useState(defaultValues.password);
  const [url, setUrl] = useState(defaultValues.url ?? '');
  const [notes, setNotes] = useState(defaultValues.notes ?? '');

  const vault = useVault();
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (isLoading) return;

    const trimmedTitle = title.trim();
    const trimmedUsername = username.trim();
    const trimmedUrl = url.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedTitle || !password) {
      toast.error('Title and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      await vault.updateEntry(defaultValues.itemId, {
        title: trimmedTitle,
        username: trimmedUsername || undefined,
        password,
        url: trimmedUrl || undefined,
        notes: trimmedNotes || undefined,
      });

      toast.success('Updated entry');
      router.back();
    } catch (error) {
      console.error('Failed to update entry:', error);

      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to update entry.';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="entry-title" className="text-sm font-medium">
          Title
        </label>

        <Input
          id="entry-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Google"
          disabled={isLoading}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="entry-username" className="text-sm font-medium">
          Username
        </label>

        <Input
          id="entry-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username or email"
          autoComplete="username"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="entry-password" className="text-sm font-medium">
          Password
        </label>

        <PasswordInputWithGenerator
          id="entry-password"
          value={password}
          onChange={setPassword}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="entry-url" className="text-sm font-medium">
          URL
        </label>

        <Input
          id="entry-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          autoComplete="url"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="entry-notes" className="text-sm font-medium">
          Notes
        </label>

        <Textarea
          id="entry-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="mt-2 w-full"
      >
        {isLoading ? <ButtonLoader /> : 'Save'}
      </Button>
    </form>
  );
}
