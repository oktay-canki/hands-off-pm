'use client';
import Button from '@/components/common/Button';
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
      let msg = 'Failed to update entry';
      if (error instanceof Error && error.message) msg = error.message;

      toast.error(msg);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block px-2 mb-1">Title</label>
        <Input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block px-2 mb-1">Username</label>
        <Input
          placeholder="Username"
          onChange={(e) => {
            const val = e.target.value;
            setUsername(val != '' ? val : undefined);
          }}
          value={username ?? ''}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block px-2 mb-1">Password</label>
        <PasswordInputWithGenerator
          value={password}
          onChange={setPassword}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block px-2 mb-1">URL</label>
        <Input
          placeholder="URL e.g. https://example.com"
          onChange={(e) => {
            const val = e.target.value;
            setUrl(val != '' ? val : undefined);
          }}
          value={url ?? ''}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block px-2 mb-1">Notes</label>
        <Textarea
          placeholder="Notes"
          onChange={(e) => {
            const val = e.target.value;
            setNotes(val != '' ? val : undefined);
          }}
          defaultValue={notes ?? ''}
        ></Textarea>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        Save
      </Button>
    </form>
  );
}
