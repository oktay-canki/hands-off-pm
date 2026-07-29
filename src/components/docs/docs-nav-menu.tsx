'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/docs/overview', label: 'Overview' },
  { href: '/docs/architecture', label: 'Architecture & Stack' },
  { href: '/docs/cryptography', label: 'Cryptography' },
  { href: '/docs/threat-model', label: 'Threat Model' },
  { href: '/docs/storage', label: 'Storage' },
  { href: '/docs/tradeoffs-limitations', label: 'Trade-offs & limitations' },
];

export default function DocsNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-between w-full p-4 border-b-2 border-surface"
        aria-expanded={isOpen}
        aria-controls="docs-nav"
      >
        <span className="font-semibold">Docs Menu</span>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Nav links */}
      <div
        id="docs-nav"
        className={`
          flex-col p-8 md:border-r-2 border-surface md:sticky md:top-0 md:max-h-dvh md:flex md:w-3/12
          ${isOpen ? 'flex w-full' : 'hidden'}
        `}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
