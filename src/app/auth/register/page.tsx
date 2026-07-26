import Button from '@/components/common/Button';
import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10/12 max-w-md mx-auto">
        <RegisterForm />
        <div className="w-full flex items-center justify-center gap-4 my-12 px-2">
          <div className="flex-1 bg-surface h-0.5"></div>
          <div className="w-1 h-1 rounded-full bg-surface"></div>
          <div className="flex-1 bg-surface h-0.5"></div>
        </div>
        <Link href="/auth/login">
          <Button className="w-full" variant="accent-outline" size="lg">
            Unlock Vault
          </Button>
        </Link>
      </div>
    </div>
  );
}
