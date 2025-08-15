
"use client";

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';
import { TiersProvider } from '@/hooks/use-tiers';
import { DashboardProvider } from '@/context/dashboard-context';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

export function AppBody({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noHeaderFooter = ['/auth', '/pricing'].includes(pathname);

    return (
        <AuthProvider>
            <TiersProvider>
                <DashboardProvider>
                    <div className="flex flex-col min-h-screen">
                        {!noHeaderFooter && <Header />}
                        <main className="flex-grow fade-in">{children}</main>
                        {!noHeaderFooter && <Footer />}
                    </div>
                </DashboardProvider>
            </TiersProvider>
        </AuthProvider>
    )
}
