import Link from 'next/link';
import UnlockVaultPanel from '@/components/auth/UnlockVaultPanel';

export default function Login() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="eyebrow text-accent">HandsoffPM</p>

          <h1 className="heading mt-2">Unlock your vault</h1>

          <p className="body-text mt-2 max-w-sm text-surface/60">
            A local-first, self-hosted password manager.
          </p>
        </div>

        <UnlockVaultPanel />
      </div>

      <nav
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 justify-center gap-2"
        aria-label="Project resources"
      >
        <Link href="/docs/overview" className="link-text text-surface/60">
          Documentation
        </Link>

        <span className="text-surface/40">·</span>

        <a
          href="https://github.com/oktay-canki/hands-off-pm"
          target="_blank"
          rel="noopener noreferrer"
          className="link-text text-surface/60"
        >
          Repository
        </a>
      </nav>
    </main>
  );
}
