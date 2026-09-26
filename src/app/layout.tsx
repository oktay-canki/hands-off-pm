import type { Metadata } from 'next';
import { VaultProvider } from '@/context/VaultContext';
import './globals.css';
import { Toaster } from 'sonner';
import AppConfig from '@/app.config';

export const metadata: Metadata = {
  title: AppConfig.APP_NAME,
  description: 'A browser-based client-side password manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <VaultProvider>
          {children}
          <Toaster position="bottom-right" />
        </VaultProvider>
      </body>
    </html>
  );
}
