
"use client";

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';
import { TiersProvider } from '@/hooks/use-tiers';
import { DashboardProvider } from '@/context/dashboard-context';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

/**
 * AppBody is the main layout component that wraps the entire application.
 * It sets up all the necessary context providers (Auth, Tiers, Dashboard)
 * and conditionally renders the Header and Footer based on the current route.
 */
export function AppBody({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Determine if the current page should have a header and footer.
    // Auth and pricing pages have their own minimal layout.
    const noHeaderFooter = ['/auth', '/pricing'].includes(pathname) || !pathname;

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
