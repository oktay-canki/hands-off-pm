'use client';

import LogoutButton from '@/components/auth/LogoutButton';
import SessionInfo from '@/components/auth/SessionInfo';
import EntryList from '@/components/entry/EntryList';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function VaultHomePage() {
  return (
    <div className="flex h-full w-full flex-col py-10">
      <header className="mx-auto flex w-full items-center justify-end gap-2 lg:w-10/12">
        <SessionInfo />

        <div className="flex items-center gap-2 px-2">
          <LogoutButton />

          <Link
            href="/vault/settings"
            aria-label="Vault settings"
            className="flex size-10 items-center justify-center rounded-md text-surface transition-colors hover:bg-primary hover:text-surface focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Settings className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <EntryList />
    </div>
  );
}
