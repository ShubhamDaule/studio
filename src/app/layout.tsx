import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google';
import { AppBody } from '@/components/layout/app-body';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MySpendWise Analyzer',
  description: 'AI-powered spending analysis and insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
       <body>
          <AppBody>
            {children}
          </AppBody>
          <Toaster />
      </body>
    </html>
  );
}
