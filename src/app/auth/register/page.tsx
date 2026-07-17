import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10/12 max-w-md mx-auto">
        <RegisterForm />
        <Link
          href="/auth/login"
          className="block w-fit mx-auto text-accent underline mt-10 px-4 p-2"
        >
          Unlock Your Vault
        </Link>
      </div>
    </div>
  );
}
