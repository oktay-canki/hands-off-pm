'use client';

import Button, { ButtonProps } from '@/components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton(props: ButtonProps) {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="accent-outline" {...props}>
      <ArrowLeft size={20} />
      Back
    </Button>
  );
}
