import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';

export default function Register() {
  return (
    <>
      <RegisterForm />
      <Link href="/auth/login">Login</Link>
    </>
  );
}
