'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import Input from '@/components/common/Input';
import PasswordInputWithGenerator from '@/components/common/PasswordInputWithGenerator';
import Textarea from '@/components/common/Textarea';
import { useVault } from '@/context/VaultContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const AddEntryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);

  const vaultService = useVault();
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addEntry();
      toast.success('Added entry');
      router.back();
    } catch (error) {
      let msg = 'Failed to add new entry';
      if (error instanceof Error && error.message) msg = error.message;

      toast.error(msg);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addEntry() {
    if (!title || !password) {
      throw Error('Required fields can not be empty.');
    }

    await vaultService.addEntry({
      title: title.trim(),
      username: username?.trim(),
      password: password.trim(),
      url: url?.trim(),
      notes: notes?.trim(),
    });
    clearFormFields();
  }

  function clearFormFields() {
    setTitle('');
    setUsername(undefined);
    setPassword('');
    setUrl(undefined);
    setNotes(undefined);
  }

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
          strengthMeter={true}
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
        {!isLoading ? 'Add' : <ButtonLoader />}
      </Button>
    </form>
  );
};

export default AddEntryForm;
