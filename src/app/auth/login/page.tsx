import UnlockVaultPanel from '@/components/auth/UnlockVaultPanel';

export default function Login() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h1 className="heading mt-2">Unlock your vault</h1>

          <p className="body-text mt-2 max-w-sm text-surface/60">
            Enter your credentials to continue.
          </p>
        </div>

        <UnlockVaultPanel />
      </div>
    </main>
  );
}
