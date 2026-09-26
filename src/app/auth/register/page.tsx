import Link from 'next/link';
import Button from '@/components/common/Button';
import RegisterForm from '@/components/forms/RegisterForm';

export default function Register() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center">
      <div className="w-full max-w-md px-6">
        <RegisterForm />

        <Link href="/auth/login" className="mt-8 block w-full">
          <Button
            type="button"
            variant="accent-outline"
            size="lg"
            className="w-full"
          >
            Unlock Vault
          </Button>
        </Link>
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
