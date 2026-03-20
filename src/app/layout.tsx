import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Vamsha - The Indian Genealogy Portal',
  description: 'Trace your heritage, deities, saints, and ancestors across generations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-pattern" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
