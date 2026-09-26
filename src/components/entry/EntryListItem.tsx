'use client';

import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import SiteFavicon from '@/components/entry/SiteFavicon';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import cn from '@/utils/cn';
import { Copy, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  entry: VaultEntry;
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export default function EntryListItem({
  entry,
  isChecked = false,
  onCheckedChange,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  async function handleCopy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Copied ${label}`);
      setShowMenu(false);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  }

  return (
    <li
      className={cn(
        'group border-b border-secondary/50',
        'transition-colors hover:bg-primary',
      )}
    >
      <div className="mx-auto flex min-h-16 w-10/12 items-center gap-4 py-3 sm:gap-6">
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isChecked} onChange={onCheckedChange} size="lg" />
        </div>

        <Link
          href={`/vault/entry/${entry.itemId}/edit`}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-3',
            'rounded-md outline-none',
            'focus-visible:ring-2 focus-visible:ring-accent',
          )}
        >
          <SiteFavicon url={entry.url} size={20} />

          <div className="min-w-0">
            <h3 className="subtitle truncate">{entry.title}</h3>

            {entry.username && (
              <p className="body-text truncate text-secondary">
                {entry.username}
              </p>
            )}
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <div className="relative" ref={menuRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Copy ${entry.title} credentials`}
              aria-expanded={showMenu}
              aria-haspopup="menu"
              onClick={() => setShowMenu((prev) => !prev)}
              className="hover:bg-secondary"
            >
              <MoreHorizontal size={20} aria-hidden="true" />
            </Button>

            {showMenu && (
              <div
                role="menu"
                className={cn(
                  'absolute right-0 top-full z-20 mt-1 w-48',
                  'overflow-hidden rounded-md',
                  'border border-primary bg-secondary shadow-lg',
                )}
              >
                {entry.username && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    role="menuitem"
                    className="w-full justify-start gap-2 rounded-none hover:bg-primary"
                    onClick={() => void handleCopy(entry.username!, 'username')}
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copy username
                  </Button>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  role="menuitem"
                  className="w-full justify-start gap-2 rounded-none hover:bg-primary"
                  onClick={() => void handleCopy(entry.password, 'password')}
                >
                  <Copy size={16} aria-hidden="true" />
                  Copy password
                </Button>
              </div>
            )}
          </div>

          <Link
            href={`/vault/entry/${entry.itemId}/edit`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${entry.title}`}
              className="hover:bg-secondary"
            >
              <Pencil size={18} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </li>
  );
}
