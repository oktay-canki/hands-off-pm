'use client';

import BackButton from '@/components/common/BackButton';
import EditEntryForm from '@/components/forms/EditEntryForm';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';
import { use, useMemo } from 'react';

type Params = {
  itemId: string;
};

export default function ItemEditPage({ params }: { params: Promise<Params> }) {
  const { itemId } = use(params);
  const { entries } = useVaultSnapshot();

  const entry = useMemo(
    () => entries.find((e) => e.itemId === itemId),
    [entries, itemId],
  );

  if (!entry) return <>No such entry found</>;

  return (
    <div className="w-full h-full">
      <div className="pl-8 pt-8">
        <BackButton />
      </div>
      <div className="w-10/12 max-w-md mx-auto py-20">
        <EditEntryForm defaultValues={entry} />
      </div>
    </div>
  );
}
