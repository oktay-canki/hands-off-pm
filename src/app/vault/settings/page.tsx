'use client';

import ExportVaultForm from '@/components/forms/ExportVaultForm';
import ImportVaultForm from '@/components/forms/ImportVaultForm';
import BackButton from '@/components/common/BackButton';

export default function VaultSettingsPage() {
  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto w-full px-6 pt-8 lg:w-10/12">
        <BackButton />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="mb-10">
          <span className="eyebrow text-accent">Vault</span>

          <h1 className="heading mt-2">Vault Data</h1>

          <p className="body-text mt-2 max-w-lg text-surface/60">
            Export your vault for backup or import data from a previous
            encrypted backup.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          <section>
            <h2 className="card-title">Export</h2>

            <p className="body-text mt-2 mb-4 text-surface/60">
              Download an encrypted backup of your vault, protected by a
              password you choose.
            </p>

            <ExportVaultForm />
          </section>

          <section className="border-t border-secondary/30 pt-10">
            <h2 className="card-title">Import</h2>

            <p className="body-text mt-2 mb-4 text-surface/60">
              Restore or merge items from a previously exported file.
            </p>

            <ImportVaultForm />
          </section>
        </div>
      </div>
    </main>
  );
}
