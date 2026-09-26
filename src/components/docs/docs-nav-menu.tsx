'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/docs/overview', label: 'Overview' },
  { href: '/docs/architecture', label: 'Architecture & Stack' },
  { href: '/docs/cryptography', label: 'Cryptography' },
  { href: '/docs/storage', label: 'Storage' },
  { href: '/docs/export-import', label: 'Export & Import' },
  { href: '/docs/threat-model', label: 'Threat Model' },
  {
    href: '/docs/tradeoffs-limitations',
    label: 'Trade-offs & Limitations',
  },
];

export default function DocsNavMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="docs-nav-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="docs-nav"
      >
        <span>Documentation</span>
        {isOpen ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </button>

      <nav
        id="docs-nav"
        aria-label="Documentation"
        className={`docs-nav${isOpen ? ' is-open' : ''}`}
      >
        <div className="docs-nav-inner">
          <div className="docs-nav-label">Documentation</div>

          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="docs-nav-link"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
