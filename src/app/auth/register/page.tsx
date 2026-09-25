import Button from '@/components/common/Button';
import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';

export default function Register() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center">
      <div className="w-full max-w-md px-6">
        <RegisterForm />

        <Link href="/auth/login" className="block w-full mt-8">
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
    </main>
  );
}
