

"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardProvider } from '@/context/dashboard-context';
import { AuthProvider } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { TiersProvider } from '@/hooks/use-tiers';

const metadata: Metadata = {
  title: 'SpendWise Analyzer',
  description: 'AI-powered spending analysis and insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noHeaderFooter = ['/login', '/signup', '/pricing'].includes(pathname);
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <TiersProvider>
            <DashboardProvider>
                <div className="flex flex-col min-h-screen">
                  {!noHeaderFooter && <Header />}
                  <main className="flex-grow">{children}</main>
                  {!noHeaderFooter && <Footer />}
                </div>
            </DashboardProvider>
          </TiersProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
