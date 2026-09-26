'use client';

import Button from '@/components/common/Button';
import ButtonLoader from '@/components/common/ButtonLoader';
import PasswordInput from '@/components/common/PasswordInput';
import Modal from '@/components/common/Modal';
import { useVault } from '@/context/VaultContext';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
import { toast } from 'sonner';

const ExportVaultForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const vaultService = useVault();
  const exportModal = useModal();

  function handleOpen() {
    setPassword('');
    setConfirmPassword('');
    exportModal.open();
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      await exportVault();

      toast.success('Vault exported');
      exportModal.close();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to export vault';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function exportVault() {
    if (!password) {
      throw new Error('Export password cannot be empty.');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    await vaultService.exportVault(password);
  }

  return (
    <>
      <Button variant="outline" size="lg" onClick={handleOpen}>
        Export Vault
      </Button>

      {exportModal.isOpen && (
        <Modal
          isOpen={exportModal.isOpen}
          onClose={isLoading ? () => {} : exportModal.close}
          closeOnOverlayClick={!isLoading}
        >
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="heading">Export Vault</h2>

              <p className="body-text mt-2 text-surface/60">
                Create an encrypted backup of your vault. Choose a separate
                password for the exported file.
              </p>
            </div>

            <div className="rounded-md border border-secondary/40 bg-primary/40 p-3">
              <p className="small-text text-surface/70">
                This password is only for the exported file. It does not need to
                match your master password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="export-password"
                  className="text-sm font-medium"
                >
                  Export Password
                </label>

                <PasswordInput
                  id="export-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Export password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  size="lg"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm-export-password"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>

                <PasswordInput
                  id="confirm-export-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm export password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  size="lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-secondary/30 pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={exportModal.close}
                  disabled={isLoading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="accent"
                  disabled={isLoading}
                  className="min-w-32"
                >
                  {isLoading ? <ButtonLoader /> : 'Export Vault'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ExportVaultForm;
