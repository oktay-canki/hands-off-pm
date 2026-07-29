'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DocsHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/docs/overview');
  }, [router]);

  return null;
}
