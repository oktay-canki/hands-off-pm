'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import DeleteEntriesModal from '@/components/entry/DeleteEntriesModal';
import Input from '@/components/common/Input';
import EntryListItem from '@/components/entry/EntryListItem';
import { useVault } from '@/context/VaultContext';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';
import { useModal } from '@/hooks/useModal';
import { Plus, Search, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import VaultEntry from '@/modules/vault/types/VaultEntry';

type PendingDeletion = Pick<VaultEntry, 'itemId' | 'title'>;

const EntryList = () => {
  const vault = useVault();
  const snapshot = useVaultSnapshot();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteModal = useModal();

  const filteredEntries = useMemo(() => {
    if (!snapshot) return [];

    const searchQuery = query.trim().toLowerCase();

    if (!searchQuery) {
      return snapshot.entries;
    }

    return snapshot.entries.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(searchQuery) ||
        entry.username?.toLowerCase().includes(searchQuery) ||
        entry.url?.toLowerCase().includes(searchQuery) ||
        entry.notes?.toLowerCase().includes(searchQuery)
      );
    });
  }, [snapshot, query]);

  function handleSelectedChange(itemId: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }

      return next;
    });
  }

  function handleDelete() {
    if (!snapshot || selected.size === 0 || isDeleting) return;

    const entries = snapshot.entries
      .filter((entry) => selected.has(entry.itemId))
      .map((entry) => ({
        itemId: entry.itemId,
        title: entry.title,
      }));

    if (entries.length === 0) return;

    setPendingDeletion(entries);
    confirmDeleteModal.open();
  }

  async function deleteEntries() {
    if (pendingDeletion.length === 0 || isDeleting) return;

    const itemIds = pendingDeletion.map((entry) => entry.itemId);

    setIsDeleting(true);

    try {
      await vault.deleteEntries(itemIds);

      toast.success(
        `Deleted ${itemIds.length} ${
          itemIds.length === 1 ? 'entry' : 'entries'
        }.`,
      );

      setSelected((prev) => {
        const next = new Set(prev);

        for (const itemId of itemIds) {
          next.delete(itemId);
        }

        return next;
      });

      setPendingDeletion([]);
      confirmDeleteModal.close();
    } catch (error) {
      console.error('Failed to delete entries:', error);

      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to delete entries.';

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="mx-auto h-fit w-full py-10 lg:w-10/12">
        <div className="mb-8 mt-10 flex w-full flex-wrap items-center justify-center gap-4 lg:justify-start px-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:max-w-md">
            <Search
              className="size-5 shrink-0"
              strokeWidth={2.5}
              aria-hidden="true"
            />

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries..."
              aria-label="Search entries"
            />
          </div>

          <Link href="/vault/entry/add" className="shrink-0">
            <Button variant="ghost" size="lg" className="gap-2">
              <Plus className="size-5" strokeWidth={2.5} />
              Add Entry
            </Button>
          </Link>

          <div className="flex shrink-0 items-center gap-3 lg:ml-auto">
            {selected.size > 0 && (
              <>
                <span className="small-text text-surface/60">
                  {selected.size} selected
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => setSelected(new Set())}
                >
                  Clear
                </Button>
              </>
            )}

            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-2"
              disabled={isDeleting || selected.size === 0}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <ButtonLoader />
              ) : (
                <>
                  <Trash className="size-4" aria-hidden="true" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-surface/60">
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
                onCheckedChange={(checked) =>
                  handleSelectedChange(entry.itemId, checked)
                }
              />
            ))}
          </ul>
        )}
      </div>

      {confirmDeleteModal.isOpen && (
        <DeleteEntriesModal
          entryTitles={pendingDeletion.map((entry) => entry.title)}
          isDeleting={isDeleting}
          onConfirm={deleteEntries}
          onCancel={confirmDeleteModal.close}
        />
      )}
    </>
  );
};

export default EntryList;
