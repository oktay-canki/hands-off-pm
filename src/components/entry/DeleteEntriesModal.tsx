'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import Checkbox from '@/components/common/Checkbox';
import Modal from '@/components/common/Modal';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

type Props = {
  entryTitles: string[];
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function DeleteEntriesModal({
  entryTitles,
  isDeleting = false,
  onConfirm,
  onCancel,
}: Props) {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const count = entryTitles.length;

  async function handleConfirm() {
    if (!hasConfirmed || isDeleting) return;

    await onConfirm();
  }

  return (
    <Modal
      isOpen
      onClose={isDeleting ? () => {} : onCancel}
      closeOnOverlayClick={!isDeleting}
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-danger/10 text-danger">
              <Trash2 className="size-5" aria-hidden="true" />
            </div>

            <h2 className="heading">
              Delete {count} {count === 1 ? 'entry' : 'entries'}?
            </h2>
          </div>

          <p className="body-text text-surface/60">
            This action permanently removes{' '}
            {count === 1 ? 'this entry' : 'these entries'} from your vault.
          </p>
        </div>

        <div>
          <p className="small-text mb-2 font-medium text-surface/70">
            {count === 1 ? 'Entry to delete' : 'Entries to delete'}
          </p>

          <div className="flex max-h-40 w-full flex-col overflow-y-auto rounded-md border border-secondary/50 bg-primary/40">
            {entryTitles.map((title, index) => (
              <div
                key={`${title}-${index}`}
                className="truncate border-b border-secondary/30 px-3 py-2.5 text-sm font-medium last:border-b-0"
              >
                {title}
              </div>
            ))}
          </div>
        </div>

        <Checkbox
          checked={hasConfirmed}
          onChange={setHasConfirmed}
          disabled={isDeleting}
          label="I understand that these entries will be permanently deleted."
        />

        <div className="flex justify-end gap-2 border-t border-secondary/30 pt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!hasConfirmed || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <ButtonLoader />
            ) : (
              <>
                <Trash2 className="size-4" aria-hidden="true" />
                Delete {count === 1 ? 'Entry' : 'Entries'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
