import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AppToaster } from '@/components/AppToaster';

export const metadata: Metadata = {
  title: 'Academia LMS',
  description: 'Plataforma de cursos online - Next.js + Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface">
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
        <AppToaster />
      </body>
    </html>
  );
}

