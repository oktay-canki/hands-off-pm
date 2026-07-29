import DocsNavMenu from '@/components/docs/docs-nav-menu';
import '../docs.css';

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row relative">
      <DocsNavMenu />
      <div className="w-full mx-auto max-w-3xl pt-20 pb-40 px-4">
        {children}
      </div>
    </div>
  );
}
