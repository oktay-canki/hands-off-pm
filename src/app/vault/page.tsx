'use client';

import AddEntryLink from '@/components/AddEntryLink';
import EntryList from '@/components/entry/EntryList';
import SessionInfo from '@/components/SessionInfo';

export default function VaultHomePage() {
  return (
    <>
      <SessionInfo />
      <AddEntryLink />
      <EntryList />
    </>
  );
}
