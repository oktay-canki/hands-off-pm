'use client';

import { useMemo, useState } from 'react';
import EntryListItem from '@/components/entry/EntryListItem';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';
import { Plus, Search, Trash } from 'lucide-react';
import Input from '@/components/common/Input';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { toast } from 'sonner';
import { useVault } from '@/context/VaultContext';
import ButtonLoader from '@/components/common/ButtonLoader';
import Modal from '@/components/common/Modal';
import { useModal } from '@/hooks/useModal';
import cn from '@/utils/cn';

const EntryList = () => {
  const vault = useVault();
  const snapshot = useVaultSnapshot();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteModal = useModal();

  const filteredEntries = useMemo(() => {
    if (!snapshot) return [];
    const q = query.trim().toLowerCase();
    if (!q) return snapshot.entries;

    return snapshot.entries.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.username?.toLowerCase().includes(q) ||
        entry.url?.toLowerCase().includes(q) ||
        entry.notes?.toLowerCase().includes(q)
      );
    });
  }, [snapshot, query]);

  function handleSelectedChange(itemId: string, val: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (val) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  }

  function handleDelete() {
    if (selected.size === 0) return;
    confirmDeleteModal.open();
  }

  async function deleteEntries() {
    if (isDeleting) return;
    setIsDeleting(true);
    confirmDeleteModal.close();
    let count = 0;
    for (const itemId of selected) {
      try {
        await vault.deleteEntry(itemId);
      } catch (error) {
        count++;
        console.log(error);
      }
    }

    if (count === 0) toast.success(`Deleted ${selected.size} entries`);
    else {
      toast.error(`Failed to delete ${count} of ${selected.size} entries`);
    }
    setSelected(new Set());
    setIsDeleting(false);
  }

  function getEntryTitle(itemId: string) {
    const entry = snapshot.entries.find((e) => e.itemId === itemId);
    return entry ? entry.title : '';
  }

  return (
    <>
      <div className="w-full h-fit lg:w-10/12 mx-auto py-10">
        <div className="w-full mt-10 flex items-center justify-center lg:justify-start flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Search size={22} strokeWidth={3} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries..."
            />
          </div>
          <Link href={`/vault/entry/add`} className="flex gap-2 shrink-0">
            <Button variant="ghost" className="flex gap-2" size="lg">
              <Plus size={22} strokeWidth={3} className="inline-block" /> Add
              Entry
            </Button>
          </Link>
          <div className="lg:ml-auto flex items-stretch">
            <Button
              variant="destructive"
              className={cn(
                'flex gap-2 items-center',
                selected.size !== 0 && 'rounded-r-none',
              )}
              disabled={isDeleting || selected.size === 0}
              onClick={handleDelete}
            >
              {!isDeleting ? (
                <>
                  <Trash size={18} />
                  Delete {selected.size !== 0 && `(${selected.size})`}
                </>
              ) : (
                <ButtonLoader />
              )}
            </Button>
            {selected.size !== 0 && (
              <Button
                className="rounded-l-none"
                variant="secondary"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="flex flex-1 h-20 items-center justify-center">
            {!snapshot || snapshot.entries.length === 0
              ? 'No entries'
              : 'No matching entries'}
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-secondary">
            {filteredEntries.map((entry) => (
              <EntryListItem
                key={entry.itemId}
                entry={entry}
                isChecked={selected.has(entry.itemId)}
                onCheckedChange={(val) => {
                  handleSelectedChange(entry.itemId, val);
                }}
              />
            ))}
          </ul>
        )}
      </div>
      {confirmDeleteModal.isOpen && (
        <Modal
          isOpen={confirmDeleteModal.isOpen}
          onClose={confirmDeleteModal.close}
        >
          <h2 className="card-title">
            Are you sure you want to delete {selected.size} items?
          </h2>
          <p className="body-text text-danger mb-4">
            Deleted entries can not be recovered.
          </p>
          <div className="w-full max-h-40 overflow-y-auto px-8 py-2 mx-auto bg-secondary rounded-md mb-8 flex flex-col gap-4">
            {Array.from(
              selected.keys().map((itemId) => (
                <div className="flex flex-col" key={itemId}>
                  <h2 className="card-title">{getEntryTitle(itemId)}</h2>
                </div>
              )),
            )}
          </div>
          <Button
            variant="destructive"
            size="lg"
            className="block ml-auto"
            onClick={deleteEntries}
          >
            Delete Entries
          </Button>
        </Modal>
      )}
    </>
  );
};

export default EntryList;
