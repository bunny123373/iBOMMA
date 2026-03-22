import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
  title: 'Prime Video - Movies & TV Shows',
  description: 'Watch movies and TV shows online',
  keywords: ['streaming', 'movies', 'tv shows', 'prime video'],
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
