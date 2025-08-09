
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardContext } from "@/context/dashboard-context";
import { Download, LogOut, FileText, FileSpreadsheet, FileJson, PanelLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "./dashboard/date-range-picker";
import { SourceFilter } from "./dashboard/source-filter";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";

const Logo = () => (
    <div className="flex items-center gap-2 flex-shrink-0">
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <path 
                d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" 
                stroke="url(#logoGradient)" 
                strokeWidth="3"
            />
            <path 
                d="M20.5 22C19.8333 22.8333 17.6 24.5 15.5 22C12.5 18.5 10.5 15.5 11.5 12C12.5 8.5 15.5 6.5 17 7.5C18.5 8.5 18 11.5 16 14C14.5 16 12.5 18 11.5 19" 
                stroke="url(#logoGradient)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>

        <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
            SpendWise
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

  if (!user) {
    return null;
  }
  
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

const LandingNavLinks = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8", className)}>
        <Link href="/landing#features" className="text-foreground hover:text-primary transition-smooth font-semibold">Features</Link>
        <Link href="/landing#benefits" className="text-foreground hover:text-primary transition-smooth font-semibold">Benefits</Link>
        <Link href="/pricing" className="text-foreground hover:text-primary transition-smooth font-semibold">Pricing</Link>
    </div>
);

const LandingNav = () => {
    const { user } = useAuth();

    return (
        <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-8">
                <div className="flex items-center gap-8">
                    <LandingNavLinks />
                </div>
                {user ? (
                    <UserNav />
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                        <Button asChild><Link href="/signup">Get Started</Link></Button>
                    </div>
                )}
            </div>
            <div className="md:hidden flex items-center">
                {user ? <UserNav /> : (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <PanelLeft />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <div className="flex flex-col gap-8 pt-8">
                                <LandingNavLinks />
                                <div className="flex flex-col gap-4">
                                    <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                                    <Button asChild><Link href="/signup">Get Started</Link></Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>
        </div>
    )
};

const DashboardNav = () => {
    const { 
        dateRange,
        setDateRange,
        minDate,
        maxDate,
        transactionFiles,
        selectedSourceFilter,
        setSelectedSourceFilter,
        hasTransactions,
        triggerExport,
    } = useDashboardContext();

    return (
        <div className="flex w-full items-center justify-end gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <DateRangePicker
                    date={dateRange}
                    setDate={setDateRange}
                    minDate={minDate}
                    maxDate={maxDate}
                />
                <SourceFilter
                    files={transactionFiles}
                    selectedSource={selectedSourceFilter}
                    onSelectSource={setSelectedSourceFilter}
                />
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" disabled={!hasTransactions}>
                      <Download className="mr-2 h-4 w-4 hidden sm:inline-block" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Export As</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => triggerExport('csv')}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => triggerExport('xlsx')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span>XLSX</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => triggerExport('pdf')}>
                      <FileJson className="mr-2 h-4 w-4" />
                      <span>PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 gap-4">
            <Link href="/landing">
              <Logo />
            </Link>
            <NavContent />
          </div>
        </header>
    );
}
