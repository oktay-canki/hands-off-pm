'use client';

import BackButton from '@/components/common/BackButton';
import EditEntryForm from '@/components/forms/EditEntryForm';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';
import { use } from 'react';

type Params = {
  itemId: string;
};

export default function ItemEditPage({ params }: { params: Promise<Params> }) {
  const { itemId } = use(params);
  const { entries } = useVaultSnapshot();

  const entry = entries.find((entry) => entry.itemId === itemId);

  if (!entry) {
    return (
      <main className="flex min-h-dvh w-full items-center justify-center px-6">
        <p className="body-text text-surface/70">No such entry found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto w-full px-6 pt-8 lg:w-10/12">
        <BackButton />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="mb-10">
          <span className="eyebrow text-accent">Vault</span>

          <h1 className="heading mt-2">Edit Entry</h1>

          <p className="body-text mt-2 max-w-lg text-surface/60">
            Update the credentials and information stored for this entry.
          </p>
        </div>

        <EditEntryForm defaultValues={entry} />
      </div>
    </main>
  );
}
