import UnlockVaultForm from '@/components/forms/UnlockVaultForm';
import Link from 'next/link';

export default function Login() {
  return (
    <>
      <UnlockVaultForm />
      <Link href="/auth/register">Register</Link>
    </>
  );
}
