import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
  title: 'iBOMMA - Download Movies in HD',
  description: 'Download latest movies in HD quality for free',
  keywords: ['download movies', 'free movies', 'hd movies', 'ibomma'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-mirror-darker text-white">
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}
