'use client';

import BackButton from '@/components/common/BackButton';
import AddEntryForm from '@/components/forms/AddEntryForm';

export default function AddEntryPage() {
  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto w-full px-6 pt-8 lg:w-10/12">
        <BackButton />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="mb-10">
          <span className="eyebrow text-accent">Vault</span>

          <h1 className="heading mt-2">Add Entry</h1>

          <p className="body-text mt-2 max-w-lg text-surface/60">
            Save a new login and keep your credentials securely organized.
          </p>
        </div>

        <AddEntryForm />
      </div>
    </main>
  );
}
