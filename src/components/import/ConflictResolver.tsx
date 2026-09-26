'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import { ItemConflict } from '@/modules/vault/types/ItemConflict';
import VaultItem from '@/modules/vault/types/VaultItem';
import { FileInput, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

type Decision = 'local' | 'incoming';

type Props = {
  conflicts: ItemConflict[];
  onDone: (accepted: VaultItem[]) => Promise<void>;
};

function describeItem(item: VaultItem): {
  title: string;
  detail: string;
  device: string;
} {
  if (item.type === 'tombstone') {
    return {
      title: 'Deleted item',
      detail: `Deleted ${new Date(item.deletedAt).toLocaleString()}`,
      device: item.deviceId,
    };
  }

  return {
    title: item.title,
    detail: `Updated ${new Date(item.updatedAt).toLocaleString()}`,
    device: item.deviceId,
  };
}

export default function ConflictResolver({ conflicts, onDone }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [isSaving, setIsSaving] = useState(false);

  const currentConflict = conflicts[currentIndex];

  if (!currentConflict) {
    return null;
  }

  const itemId = currentConflict.local.itemId;
  const local = describeItem(currentConflict.local);
  const incoming = describeItem(currentConflict.incoming);

  const reviewedCount = Object.keys(decisions).length;

  async function handleDecision(decision: Decision) {
    if (isSaving) return;

    const nextDecisions = {
      ...decisions,
      [itemId]: decision,
    };

    setDecisions(nextDecisions);

    const isLastConflict = currentIndex === conflicts.length - 1;

    if (!isLastConflict) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setIsSaving(true);

    try {
      const accepted = conflicts
        .filter(
          (conflict) => nextDecisions[conflict.local.itemId] === 'incoming',
        )
        .map((conflict) => conflict.incoming);

      await onDone(accepted);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleKeepAllCurrent() {
    if (isSaving) return;

    setIsSaving(true);

    try {
      await onDone([]);
    } finally {
      setIsSaving(false);
    }
  }

  function handlePrevious() {
    if (isSaving || currentIndex === 0) return;

    setCurrentIndex((index) => index - 1);
  }

  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="card-title">Review conflicts</h2>

            <p className="small-text mt-1 text-surface/50">
              Choose which version to keep.
            </p>
          </div>

          <span className="small-text shrink-0 font-medium text-surface/50">
            {currentIndex + 1} / {conflicts.length}
          </span>
        </div>
      </div>

      {/* Current conflict */}
      <div className="overflow-hidden rounded-lg border border-secondary/50">
        <div className="border-b border-secondary/30 bg-primary/30 px-4 py-3">
          <span className="small-text text-surface/50">Conflicting item</span>

          <h3 className="mt-1 truncate font-medium text-surface">
            {local.title}
          </h3>
        </div>

        <div className="grid gap-px bg-secondary/30 sm:grid-cols-2">
          {/* Local version */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleDecision('local')}
            className="
              group flex min-w-0 flex-col bg-background p-4 text-left
              transition-colors
              hover:bg-primary/50
              focus-visible:z-10
              focus-visible:ring-2
              focus-visible:ring-inset
              focus-visible:ring-accent
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <LockKeyhole
                  className="size-4 shrink-0 text-surface/50"
                  aria-hidden="true"
                />

                <span className="micro-text truncate text-surface/60">
                  Your vault
                </span>
              </div>

              <span className="small-text shrink-0 text-surface/40">
                Current
              </span>
            </div>

            <div className="mt-5 min-h-16">
              <p className="truncate font-medium text-surface">{local.title}</p>

              <p className="small-text mt-1 text-surface/50">{local.detail}</p>
            </div>

            <div className="mt-5 border-t border-secondary/30 pt-3">
              <p className="small-text truncate text-surface/40">This Device</p>

              <p className="mt-2 text-sm font-medium text-surface/70 transition-colors group-hover:text-surface">
                Keep this version
              </p>
            </div>
          </button>

          {/* Incoming version */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleDecision('incoming')}
            className="
              group flex min-w-0 flex-col bg-background p-4 text-left
              transition-colors
              hover:bg-primary/50
              focus-visible:z-10
              focus-visible:ring-2
              focus-visible:ring-inset
              focus-visible:ring-accent
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileInput
                  className="size-4 shrink-0 text-surface/50"
                  aria-hidden="true"
                />

                <span className="micro-text truncate text-surface/60">
                  Imported
                </span>
              </div>

              <span className="small-text shrink-0 text-surface/40">
                Backup
              </span>
            </div>

            <div className="mt-5 min-h-16">
              <p className="truncate font-medium text-surface">
                {incoming.title}
              </p>

              <p className="small-text mt-1 text-surface/50">
                {incoming.detail}
              </p>
            </div>

            <div className="mt-5 border-t border-secondary/30 pt-3">
              <p className="small-text truncate text-surface/40">Imported</p>

              <p className="mt-2 text-sm font-medium text-surface/70 transition-colors group-hover:text-surface">
                Use imported version
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {conflicts.map((conflict, index) => {
          const decision = decisions[conflict.local.itemId];
          const isCurrent = index === currentIndex;

          return (
            <span
              key={conflict.local.itemId}
              className={[
                'h-1.5 rounded-full transition-all',
                isCurrent ? 'w-6 bg-accent' : 'w-1.5',
                !isCurrent && decision
                  ? 'bg-secondary'
                  : !isCurrent
                    ? 'bg-secondary/40'
                    : '',
              ].join(' ')}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-secondary/30 pt-5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isSaving}
          onClick={handleKeepAllCurrent}
        >
          Keep all current
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSaving || currentIndex === 0}
            onClick={handlePrevious}
          >
            Back
          </Button>

          {isSaving ? (
            <ButtonLoader />
          ) : (
            <span className="small-text text-surface/40">
              {reviewedCount} of {conflicts.length} reviewed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
