'use client';

import { useId, useState } from 'react';
import cn from '@/utils/cn';

type Props = {
  label: React.ReactNode;
  content: React.ReactNode;
};

export default function Tooltip({ label, content }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center justify-center rounded-sm',
          'text-surface/60 transition-colors hover:text-surface',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-accent',
        )}
      >
        {label}
      </button>

      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2',
          'w-max max-w-xs -translate-x-1/2',
          'rounded-md border border-secondary/50 bg-primary',
          'px-3 py-2 text-xs leading-relaxed text-surface',
          'shadow-lg',
          'opacity-0 transition-opacity duration-150',
          'group-hover:opacity-100',
          isOpen && 'opacity-100',
        )}
      >
        {content}
      </span>
    </span>
  );
}
