import { useState } from 'react';
import { Globe } from 'lucide-react';

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function SiteFavicon({
  url,
  size = 20,
}: {
  url: string | undefined;
  size?: number;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !url) {
    return <Globe size={size} className="text-secondary size-8" />;
  }

  let domain: string;
  try {
    domain = new URL(normalizeUrl(url)).hostname;
  } catch {
    return <Globe size={size} className="text-secondary size-8" />;
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      className="rounded-full shrink-0 object-cover object-center size-8"
    />
  );
}
