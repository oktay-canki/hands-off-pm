'use client';

import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AddEntryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const vaultService = useVault();
  const router = useRouter();

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await addEntry();
      router.back();
    } catch (error) {
      if (error instanceof Error)
        alert(error.message || 'Failed to add new entry');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addEntry() {
    if (!title || !password) return;

    await vaultService.addEntry({
      title: title.trim(),
      username: username?.trim(),
      password: password.trim(),
      url: url?.trim(),
      notes: notes?.trim(),
    });
    clearFormFields();
    alert('Successfully added new entry to your vault');
  }

  function clearFormFields() {
    setTitle('');
    setUsername(undefined);
    setPassword('');
    setUrl(undefined);
    setNotes(undefined);
  }

  return (
    <div>
      <label>Add New Entry</label>
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
      <PasswordInput
        value={password}
        placeholder="Password"
        onChange={(value) => setPassword(value)}
      />
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
        value={notes ?? ''}
      ></textarea>
      <button onClick={handleSubmit} disabled={isLoading}>
        Save
      </button>
    </div>
  );
};

export default AddEntryForm;
