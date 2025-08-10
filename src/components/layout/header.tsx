
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
import { categorizeTransactions as categorizeTransactionsAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import type { ExtractedTransaction } from "@/lib/types";
import type { RawTransaction } from "@/ai/flows/categorize-transactions";
import { RawJsonDialog } from "../dialogs/raw-json-dialog";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// This function attempts to extract transactions from raw text using regex.
// It's a best-effort approach and may need refinement based on statement formats.
function extractRawTransactions(text: string): Omit<ExtractedTransaction, 'category'>[] {
  const lines = text.split("\n");
  const txnRegex = /^(?:(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\s+)?(\d{1,2}[\/-]\d{1,2}(?:\s\d{2,4})?)\s+(.+?)\s+([-\$]?\d{1,3}(?:,?\d{3})*\.\d{2}(\s?cr)?)\s*$/gmi;
  
  function normalizeDate(d: string): string | null {
    if (!d) return null;
    const cleanDate = d.replace(/\s+/g, '/').replace(/-/g, '/');
    const parts = cleanDate.split("/");
    if (parts.length < 2) return null;
    let [m, day, y] = parts;
    
    if (!y) {
        y = new Date().getFullYear().toString();
    }
    if (y.length === 2) y = "20" + y;

    if (parseInt(m) > 12 || parseInt(day) > 31) return null;

    return `${y.padStart(4, "20")}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  
  const transactions: Omit<ExtractedTransaction, 'category'>[] = [];
  for (const line of lines) {
    const match = txnRegex.exec(line.trim());
    if (match) {
        // Use the second date group if the first is missing
        const dateStr = match[1] || match[2];
        const date = normalizeDate(dateStr);

        if (!date) continue;

        let merchant = match[3].trim();
        // Remove common prefixes/suffixes
        merchant = merchant.replace(/^(CHECKCARD|PURCHASE|DEBIT)\s+/i, '')
                           .replace(/\s+\d+$/,'') // remove trailing numbers
                           .replace(/\s{2,}/g, ' '); // remove extra spaces

        let amountStr = match[4].replace(/[\$,]/g, '').trim();
        const isCredit = /cr/i.test(amountStr) || amountStr.startsWith('-');
        amountStr = amountStr.replace(/cr/i, '').trim();
        
        let amount = parseFloat(amountStr);
        if (isNaN(amount)) continue;
        
        if (isCredit) {
            amount = -amount;
        }

        transactions.push({ date, merchant, amount });
    }
  }
  return transactions;
}


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
        transactionFiles,
        selectedSourceFilter,
        setSelectedSourceFilter,
        onNewTransactions
    } = useDashboardContext();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [rawJsonData, setRawJsonData] = React.useState<RawTransaction[] | null>(null);
    const [rawText, setRawText] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);


    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        toast({
            title: "Processing Statement...",
            description: "Reading your file and extracting transactions.",
        });

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => (item as any).str).join(" ");
                fullText += pageText + "\n";
            }
            
            const rawTransactions = extractRawTransactions(fullText);
            
            setRawText(fullText);
            setFileName(file.name);
            setRawJsonData(rawTransactions);

        } catch (error: any) {
            console.error("Upload error:", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "Could not read the PDF file.",
            });
            setIsLoading(false);
        }
    };
    
    const handleConfirmCategorization = async () => {
        if (!rawJsonData || !fileName) return;

        setRawJsonData(null);
        setRawText(null);

        toast({
            title: "Categorizing with AI...",
            description: "Please wait while we categorize your transactions.",
        });
        
        try {
            const result = await categorizeTransactionsAction(rawJsonData);
            if (result.error || !result.data) {
                throw new Error(result.error || "Failed to categorize transactions.");
            }

            if (onNewTransactions) {
                onNewTransactions(result.data, fileName);
            }
        } catch (error: any) {
             console.error("Categorization error:", error);
            toast({
                variant: "destructive",
                title: "Categorization Failed",
                description: error.message || "An unknown error occurred.",
            });
        } finally {
            setIsLoading(false);
            setFileName(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    }
    
    const handleCancel = () => {
        setRawJsonData(null);
        setRawText(null);
        setIsLoading(false);
        setFileName(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }

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
                    files={transactionFiles}
                    selectedSource={selectedSourceFilter}
                    onSelectSource={setSelectedSourceFilter}
                />
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf"
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
        <RawJsonDialog
            isOpen={!!rawJsonData}
            onClose={handleCancel}
            onConfirm={handleConfirmCategorization}
            jsonData={rawJsonData}
            rawText={rawText}
        />
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
