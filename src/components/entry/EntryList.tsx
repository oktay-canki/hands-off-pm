'use client';

import EntryListItem from '@/components/entry/EntryListItem';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';

const EntryList = () => {
  const snapshot = useVaultSnapshot();

  if (!snapshot) return null;
  if (snapshot.entries.length === 0) return <>No entries to display</>;

  return (
    <ul>
      {snapshot.entries.map((entry) => (
        <EntryListItem key={entry.itemId} entry={entry} />
      ))}
    </ul>
  );
};

export default EntryList;
