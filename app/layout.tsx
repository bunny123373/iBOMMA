import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
  title: 'WATCHMIRROR - Premium Movie Streaming',
  description: 'Stream the latest movies and TV shows in stunning quality',
  keywords: ['streaming', 'movies', 'ott', 'premium', 'hd'],
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
