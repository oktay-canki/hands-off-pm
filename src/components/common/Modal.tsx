'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import cn from '@/utils/cn';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative max-h-[90dvh] w-full max-w-xl overflow-y-auto',
          'rounded-lg border border-secondary/50 bg-background',
          'p-6 shadow-2xl',
          className,
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              'absolute right-3 top-3 flex size-9 items-center justify-center',
              'rounded-md text-surface/60 transition-colors',
              'hover:bg-primary hover:text-surface',
              'focus-visible:ring-2 focus-visible:ring-accent',
            )}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
