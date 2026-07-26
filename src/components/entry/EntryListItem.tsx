'use client';

import VaultEntry from '@/modules/vault/types/VaultEntry';
import { useVault } from '@/context/VaultContext';
import { useEffect, useRef, useState } from 'react';
import SiteFavicon from '@/components/entry/SiteFavicon';
import cn from '@/utils/cn';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import Checkbox from '@/components/common/Checkbox';

type Props = {
  entry: VaultEntry;
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const CLICK_DELAY = 150; // ms — tune to taste, ~200-250ms feels natural

export default function EntryListItem({
  entry,
  isChecked,
  onCheckedChange,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const vault = useVault();

  const menuRef = useRef<HTMLLIElement>(null);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // Clean up any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
    };
  }, []);

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${label}`);
    setShowPopup(false);
  };

  const handleSingleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    clickTimeout.current = setTimeout(() => {
      setShowPopup((prev) => !prev);
      clickTimeout.current = null;
    }, CLICK_DELAY);
  };

  const handleDoubleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    handleCopy(entry.password, 'password');
  };

  return (
    <li
      className="py-8 hover:bg-primary hover:cursor-pointer relative group"
      ref={menuRef}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="w-10/12 mx-auto flex items-center justify-between min-h-14">
        <div className="flex gap-16 items-center">
          <Checkbox
            checked={isChecked}
            onChange={(val) => {
              onCheckedChange?.(val);
            }}
            size="lg"
          />
          <div className="flex items-center justify-center w-fit select-none">
            <SiteFavicon url={entry.url} size={20} />
            <div className="ml-4 mr-4">
              <h3 className="subtitle">{entry.title}</h3>
              {entry.username && (
                <h4 className="body-text text-secondary">{entry.username}</h4>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/vault/entry/${entry.itemId}/edit`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" className="hover:bg-secondary">
            <Pencil size={18} />
          </Button>
        </Link>
      </div>

      {showPopup && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'absolute right-0 top-0 -translate-x-full -translate-y-1/2 mt-1 w-48 z-10 bg-secondary',
            'rounded-md border-2 border-secondary shadow-lg',
            'overflow-hidden',
          )}
        >
          {entry.username && (
            <Button
              onClick={() => handleCopy(entry.username!, 'username')}
              variant="secondary"
              size="md"
              className="w-full hover:bg-primary"
            >
              Copy username
            </Button>
          )}

          <Button
            onClick={() => handleCopy(entry.password, 'password')}
            variant="secondary"
            size="md"
            className="w-full hover:bg-primary"
          >
            Copy password
          </Button>
        </div>
      )}
    </li>
  );
}
