'use client';
import useVaultSnapshot from '@/hooks/useVaultSnapshot';
import { useRouter } from 'next/navigation';

import { ReactNode, useEffect } from 'react';

export default function VaultLayout({ children }: { children: ReactNode }) {
  const { status } = useVaultSnapshot();
  const router = useRouter();

  useEffect(() => {
    if (!status.isLoading && status.isLocked) {
      router.replace('/auth/login');
    }
  }, [status.isLoading, status.isLocked, router]);

  if (status.isLoading) return <>Loading...</>;

  if (status.isLocked) return null;

  return <>{children}</>;
}
