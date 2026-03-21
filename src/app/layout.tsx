import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
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
      <body className="parchment-bg">
        <ThemeProvider>
          <div className="sacred-background">
            <div className="temple-motif" />
          </div>
          <div className="cosmic-layer">
            <div className="cosmic-nebula" />
          </div>
          <AuthProvider>
            {children}
            <Chatbot />
            <ThemeToggle />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
