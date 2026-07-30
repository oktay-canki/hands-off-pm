'use client';

import { useState, useRef, useEffect } from 'react';
import cn from '@/utils/cn';

type Props = {
  label: React.ReactNode;
  content: React.ReactNode;
};

export default function Tooltip({ label, content }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className="relative inline-flex group/tooltip"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {label}
      <span
        role="tooltip"
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
          'px-4 py-2 rounded-md bg-primary text-surface text-xs whitespace-nowrap border-2 border-secondary',
          'opacity-0 pointer-events-none group-hover/tooltip:opacity-100',
          'transition-opacity duration-150',
        )}
      >
        {content}
      </span>
    </div>
  );
}
