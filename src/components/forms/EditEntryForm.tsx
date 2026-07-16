'use client';
import PasswordInput from '@/components/common/PasswordInput';
import PasswordInputWithGenerator from '@/components/common/PasswordInputWithGenerator';
import { useVault } from '@/context/VaultContext';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  defaultValues: VaultEntry;
};

export default function EditEntryForm({ defaultValues }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(defaultValues.title);
  const [username, setUsername] = useState<string | undefined>(
    defaultValues.username,
  );
  const [password, setPassword] = useState(defaultValues.password);
  const [url, setUrl] = useState<string | undefined>(defaultValues.url);
  const [notes, setNotes] = useState<string | undefined>(defaultValues.notes);
  const vault = useVault();
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedEntry = {
        ...defaultValues,
        title,
        username,
        password,
        url,
        notes,
      };
      await vault.updateEntry(defaultValues.itemId, updatedEntry);
      router.back();
    } catch (error) {
      if (error instanceof Error)
        alert(error.message || 'Failed to update entry');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <input
        type="text"
        placeholder="username"
        onChange={(e) => {
          const val = e.target.value;
          setUsername(val != '' ? val : undefined);
        }}
        value={username ?? ''}
      />
      <PasswordInputWithGenerator value={password} onChange={setPassword} />
      <input
        type="text"
        placeholder="URL"
        onChange={(e) => {
          const val = e.target.value;
          setUrl(val != '' ? val : undefined);
        }}
        value={url ?? ''}
      />
      <textarea
        placeholder="Notes"
        onChange={(e) => {
          const val = e.target.value;
          setNotes(val != '' ? val : undefined);
        }}
        defaultValue={notes ?? ''}
      ></textarea>
      <button type="submit" disabled={isLoading}>
        Save
      </button>
    </form>
  );
}
