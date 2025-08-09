
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardContext } from "@/context/dashboard-context";
import { Download, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Logo = () => (
    <div className="flex items-center gap-2">
        <svg
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
            >
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path
                d="M9 22V17"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 22V10"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23 22V14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        <span className="text-2xl font-semibold text-primary">
            SpendWise Analyzer
        </span>
    </div>
);

const UserNav = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  }

  if (!user) return null;
  
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL ?? "https://placehold.co/40x40.png"} alt={user.displayName ?? "User"} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

const LandingNav = () => {
    const { user } = useAuth();

    return (
        <div className="hidden md:flex items-center space-x-8">
            <Link href="/landing#features" className="text-foreground hover:text-primary transition-smooth font-semibold">Features</Link>
            <Link href="/landing#benefits" className="text-foreground hover:text-primary transition-smooth font-semibold">Benefits</Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-smooth font-semibold">Pricing</Link>
            { user ? (
                <UserNav />
            ) : (
                <>
                <Link href="/login">
                    <Button variant="outline" size="sm">
                        Login
                    </Button>
                </Link>
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90">
                    <Link href="/dashboard">Get Started</Link>
                </Button>
                </>
            )}
        </div>
    )
};

const DashboardNav = () => {
    const dashboardContext = useDashboardContext();

    if (!dashboardContext) return null;

    return (
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
                {dashboardContext.isPro && (
                    <Button size="sm" onClick={dashboardContext.triggerExport} disabled={!dashboardContext.hasTransactions}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    </Button>
                )}
            <UserNav />
            </div>
        </div>
    )
}

const NavContent = () => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    if (isDashboard) {
        return <DashboardNav />;
    }
    return <LandingNav />;
}


export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <Link href="/landing">
              <Logo />
            </Link>
            <NavContent />
          </div>
        </header>
    );
}
