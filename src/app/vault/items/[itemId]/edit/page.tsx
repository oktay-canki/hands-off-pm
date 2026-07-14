'use client';

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
    <>
      <h4>Here to edit: {itemId}</h4>
      <EditEntryForm defaultValues={entry} />
    </>
  );
}
