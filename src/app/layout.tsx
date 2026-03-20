import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Chatbot from '@/components/Chatbot';

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
        <div className="cosmic-layer">
          <div className="cosmic-nebula" />
          <div className="bg-pattern" />
        </div>
        <AuthProvider>
          {children}
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
