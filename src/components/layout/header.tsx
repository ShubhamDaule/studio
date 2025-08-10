
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/context/dashboard-context";
import { LogOut, PanelLeft, BarChart3, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { SourceFilter } from "@/components/dashboard/source-filter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { extractAndCategorizeTransactions } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import type { ExtractedTransaction, BankName, StatementType } from "@/lib/types";


pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const Logo = () => (
    <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
        </div>
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
            <div className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer" />
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
    <div className={cn("flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-1", className)}>
        <Button variant="subtle" asChild><Link href="/landing#features">Features</Link></Button>
        <Button variant="subtle" asChild><Link href="/landing#benefits">Benefits</Link></Button>
        <Button variant="subtle" asChild><Link href="/pricing">Pricing</Link></Button>
    </div>
);

const LandingNav = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const isLandingPage = pathname === '/landing' || pathname === '/';

    return (
        <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-x-4">
                <LandingNavLinks />
                {user ? (
                    <UserNav />
                ) : isLandingPage ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                        <Button asChild><Link href="/signup">Get Started</Link></Button>
                    </div>
                ): null}
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
                                    <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
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
        financialSources,
        selectedSourceFilter,
        setSelectedSourceFilter,
        onNewTransactions,
    } = useDashboardContext();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);
        const allNewTransactions: { data: ExtractedTransaction[], fileName: string, bankName: BankName, statementType: StatementType }[] = [];

        await Promise.all(Array.from(files).map(async (file) => {
            toast({
                title: `Processing ${file.name}...`,
                description: "Reading your file and processing with AI. This may take a moment.",
            });

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const pageText = content.items.map(item => (item as any).str).join(" ");
                    fullText += "\\n" + pageText;
                }
                
                const result = await extractAndCategorizeTransactions(fullText);

                if (result.error || !result.data || !result.bankName || !result.statementType) {
                    throw new Error(result.error || `Failed to extract transactions from ${file.name}.`);
                }
                
                allNewTransactions.push({
                    data: result.data,
                    fileName: file.name,
                    bankName: result.bankName,
                    statementType: result.statementType,
                });

            } catch (error: any) {
                console.error(`Upload error for ${file.name}:`, error);
                toast({
                    variant: "destructive",
                    title: `Upload Failed: ${file.name}`,
                    description: error.message || "Could not process this PDF file.",
                });
            }
        }));

        if (allNewTransactions.length > 0 && onNewTransactions) {
            onNewTransactions(allNewTransactions);
        }

        setIsLoading(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
       <>
        <div className="flex w-full items-center justify-end gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <DateRangePicker
                    date={dateRange}
                    setDate={setDateRange}
                    minDate={minDate}
                    maxDate={maxDate}
                />
                <SourceFilter
                    sources={financialSources.map(s => s.name)}
                    selectedSource={selectedSourceFilter}
                    onSelectSource={setSelectedSourceFilter}
                />
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf"
                    multiple
                />
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    Upload
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <UserNav />
            </div>
        </div>
       </>
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
            <div className="flex-1 flex justify-end">
              <NavContent />
            </div>
          </div>
        </header>
    );
}
