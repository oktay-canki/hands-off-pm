'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

type Props = {
  url?: string;
  size?: number;
};

function normalizeUrl(input: string): string {
  const trimmed = input.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export default function SiteFavicon({ url, size = 20 }: Props) {
  const [hasError, setHasError] = useState(false);

  if (!url || hasError) {
    return (
      <Globe
        size={size}
        className="shrink-0 text-secondary"
        aria-hidden="true"
      />
    );
  }

  let domain: string;

  try {
    domain = new URL(normalizeUrl(url)).hostname;
  } catch {
    return (
      <Globe
        size={size}
        className="shrink-0 text-secondary"
        aria-hidden="true"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        domain,
      )}&sz=${size * 2}`}
      alt=""
      width={size}
      height={size}
      onError={() => setHasError(true)}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
