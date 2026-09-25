'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import ConflictResolver from '@/components/import/ConflictResolver';
import Modal from '@/components/common/Modal';
import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { MergeResult } from '@/modules/vault/types/MergeResult';
import VaultItem from '@/modules/vault/types/VaultItem';
import { FileUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ImportVaultForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [pendingResult, setPendingResult] = useState<MergeResult | null>(null);

  const vaultService = useVault();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await importVault();

      if (result.conflicts.length > 0) {
        setPendingResult(result);
      } else {
        toast.success(summarize(result));
        clearFormFields();
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to import vault';

      toast.error(message);
      console.error('Failed to import vault:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function importVault(): Promise<MergeResult> {
    if (!file) {
      throw new Error('Choose a file to import.');
    }

    if (!password) {
      throw new Error('Export password cannot be empty.');
    }

    return vaultService.importVault(file, password);
  }

  function summarize(result: MergeResult): string {
    const { added, updated, skipped } = result.entries;

    return `Imported: ${added} added, ${updated} updated, ${skipped} unchanged`;
  }

  function clearFormFields() {
    setFile(null);
    setPassword('');
  }

  async function handleConflictsResolved(accepted: VaultItem[]) {
    try {
      if (accepted.length > 0) {
        await vaultService.resolveConflicts(accepted);
      }

      if (pendingResult) {
        toast.success(
          `${summarize(pendingResult)}, ${accepted.length} conflicts resolved`,
        );
      } else {
        toast.success('Import complete');
      }

      setPendingResult(null);
      clearFormFields();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to save conflict resolutions';

      toast.error(message);
      console.error('Failed to save conflict resolutions:', error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="import-file" className="text-sm font-medium">
            Export File
          </label>

          <label
            htmlFor="import-file"
            className={[
              'flex min-h-24 w-full cursor-pointer flex-col items-center',
              'justify-center gap-2 rounded-md border border-dashed',
              'border-secondary/60 bg-primary/30 px-4 py-5',
              'text-center transition-colors',
              'hover:border-secondary hover:bg-primary/60',
              'has-[:focus-visible]:border-accent',
              'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/50',
              isLoading ? 'cursor-not-allowed opacity-50' : '',
            ].join(' ')}
          >
            <FileUp className="size-5 text-surface/50" aria-hidden="true" />

            <span className="text-sm font-medium">
              {file ? file.name : 'Choose an encrypted vault file'}
            </span>

            <span className="small-text text-surface/50">JSON files only</span>

            <input
              id="import-file"
              type="file"
              accept="application/json"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={isLoading}
              className="sr-only"
              required
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="import-password" className="text-sm font-medium">
            Export Password
          </label>

          <PasswordInput
            id="import-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Export password"
            autoComplete="current-password"
            disabled={isLoading}
            size="lg"
            required
          />

          <p className="small-text text-surface/50">
            Enter the password used when the backup was exported.
          </p>
        </div>

        <div className="flex justify-end border-t border-secondary/30 pt-5">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? <ButtonLoader /> : 'Import Vault'}
          </Button>
        </div>
      </form>

      {pendingResult && (
        <Modal
          isOpen
          onClose={() => {}}
          showCloseButton={false}
          closeOnOverlayClick={false}
          closeOnEscape={false}
          className="max-w-2xl"
        >
          <ConflictResolver
            conflicts={pendingResult.conflicts}
            onDone={handleConflictsResolved}
          />
        </Modal>
      )}
    </>
  );
};

export default ImportVaultForm;
