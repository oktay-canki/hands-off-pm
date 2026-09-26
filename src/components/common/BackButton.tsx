'use client';

import Button, { ButtonProps } from '@/components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton({
  onClick,
  children = 'Back',
  ...props
}: ButtonProps) {
  const router = useRouter();

  return (
    <Button
      {...props}
      variant="accent-outline"
      onClick={(e) => {
        onClick?.(e);
        router.back();
      }}
    >
      <ArrowLeft className="size-4" />
      {children}
    </Button>
  );
}
