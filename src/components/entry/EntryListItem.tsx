'use client';

import PasswordInput from '@/components/common/PasswordInput';
import EditEntryLink from '@/components/entry/EditEntryLink';
import DeleteEntryModal from '@/components/entry/DeleteEntryModal';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import { useVault } from '@/context/VaultContext';
import { useState } from 'react';

type Props = {
  entry: VaultEntry;
};

export default function EntryListItem({ entry }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const vault = useVault();

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await vault.deleteEntry(entry.itemId);
      alert('Deleted entry');
    } catch (error) {
      if (error instanceof Error)
        alert(error.message ?? 'Failed to delete entry');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <li className="flex flex-col border-2 border-black my-4 w-10/12 mx-auto">
      <h4>{`${entry.title}`}</h4>
      {entry.username && <div>{entry.username}</div>}
      <PasswordInput value={entry.password} disabled={true} />
      <EditEntryLink itemId={entry.itemId} />
      <button disabled={isDeleting} onClick={() => setShowDeleteModal(true)}>
        Delete
      </button>
      {showDeleteModal && (
        <DeleteEntryModal
          entryTitle={entry.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </li>
  );
}
