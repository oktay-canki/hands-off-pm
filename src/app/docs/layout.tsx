import DocsNavMenu from '@/components/docs/docs-nav-menu';
import '../docs.css';

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="docs-layout">
      <DocsNavMenu />
      <main className="docs">{children}</main>
    </div>
  );
}
