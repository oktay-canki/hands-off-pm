'use client';
import EntryList from '@/components/entry/EntryList';
import SessionInfo from '@/components/auth/SessionInfo';

export default function VaultHomePage() {
  return (
    <div className="w-full h-full py-10">
      <SessionInfo />
      <EntryList />
    </div>
  );
}
