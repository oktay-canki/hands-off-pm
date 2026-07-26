'use client';
import ButtonLoader from '@/components/common/ButtonLoader';
import { useVault } from '@/context/VaultContext';
import cn from '@/utils/cn';
import { LogOut } from 'lucide-react';
import { ButtonHTMLAttributes, useState } from 'react';
import { toast } from 'sonner';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function LogoutButton({ className }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const vault = useVault();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch {
      toast.error('Failed to safely logout!');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await vault.lock();
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        'bg-red-800 text-white text-lg px-4 py-2 rounded-l-md min-w-16 flex items-center justify-center w-fit',
        className,
      )}
    >
      {!isLoading ? <LogOut size={24} /> : <ButtonLoader />}
    </button>
  );
}
