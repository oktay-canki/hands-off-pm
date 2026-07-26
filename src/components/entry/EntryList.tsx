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

const EntryList = () => {
  const vault = useVault();
  const snapshot = useVaultSnapshot();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function deleteEntries() {
    if (isDeleting) return;
    setIsDeleting(true);
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
    setIsDeleting(false);
  }

  return (
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
        <Button
          variant="destructive"
          className="flex gap-2 items-center lg:ml-auto"
          disabled={isDeleting || selected.size === 0}
          onClick={deleteEntries}
        >
          {!isDeleting ? (
            <>
              <Trash size={18} />
              Delete
            </>
          ) : (
            <ButtonLoader />
          )}
        </Button>
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
  );
};

export default EntryList;
