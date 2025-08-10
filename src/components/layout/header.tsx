
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
import type { RawTransaction } from "@/ai/flows/categorize-transactions";
import { RawJsonDialog } from "../dialogs/raw-json-dialog";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// This function attempts to extract transactions from raw text using regex.
// It's a best-effort approach and may need refinement based on statement formats.
function extractRawTransactions(text: string): RawTransaction[] {
  const lines = text.split('\n');
  const transactions: RawTransaction[] = [];
  const transactionRegexes = [
      // Regex for "MM/DD/YY MM/DD/YY MERCHANT NAME $100.00 Category"
      /(?<trans_date>\d{1,2}\/\d{1,2}\/\d{2,4})\s+(?<post_date>\d{1,2}\/\d{1,2}\/\d{2,4})\s+(?<merchant>.+?)\s+\$?\s?(?<amount>-?[\d,]+\.\d{2})/,
      // Regex for "MM/DD MERCHANT NAME $100.00"
      /(?<date>\d{1,2}\/\d{1,2})\s+(?<merchant>.+?)\s+\$?\s?(?<amount>-?[\d,]+\.\d{2})/,
      // Regex for "MM-DD-YY MERCHANT NAME 100.00"
      /(?<date>\d{1,2}-\d{1,2}-\d{2,4})\s+(?<merchant>.+?)\s+(?<amount>-?[\d,]+\.\d{2})/
  ];

  function normalizeDate(dateStr: string, yearFrom?: string): string {
      let [month, day, year] = dateStr.replace(/-/g, '/').split('/');
      if (!year) {
          year = yearFrom || new Date().getFullYear().toString();
      }
      if (year.length === 2) {
          year = '20' + year;
      }
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const statementYearMatch = text.match(/Statement Period:.*?(\d{4})/);
  const statementYear = statementYearMatch ? statementYearMatch[1] : undefined;

  for (const line of lines) {
      for (const regex of transactionRegexes) {
          const match = regex.exec(line);
          if (match?.groups) {
              const { groups } = match;
              const date = normalizeDate(groups.date || groups.trans_date, statementYear);
              let merchant = groups.merchant.trim();
              
              // Basic cleanup
              merchant = merchant.replace(/\s\s+/g, ' ').replace(/ID\s\d+/,'').trim();

              const amount = parseFloat(groups.amount.replace(/,/g, ''));

              if (date && merchant && !isNaN(amount)) {
                  transactions.push({ date, merchant, amount });
                  break; 
              }
          }
      }
  }
  return transactions;
}

function detectBankAndStatementType(text: string, fileName?: string) {
  const bankKeywords = ["chase", "discover", "american express", "wells fargo", "bank of america", "citi", "amex"];
  const lowerText = text.toLowerCase();

  let bankFound = bankKeywords.find(bank => lowerText.includes(bank));
  if (!bankFound && fileName) {
    bankFound = fileName.toLowerCase().match(new RegExp(bankKeywords.join("|")))?.[0];
  }
  
  if (!bankFound) bankFound = "Unknown";

  return { bankName: bankFound.charAt(0).toUpperCase() + bankFound.slice(1) };
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
    const [bankName, setBankName] = React.useState<string | null>(null);


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
            const { bankName: detectedBank } = detectBankAndStatementType(fullText, file.name);
            
            setRawText(fullText);
            setFileName(file.name);
            setRawJsonData(rawTransactions);
            setBankName(detectedBank);

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

        const currentBank = bankName;

        setRawJsonData(null);
        setRawText(null);
        setBankName(null);

        toast({
            title: "Categorizing with AI...",
            description: `Please wait while we categorize your transactions. Detected bank: ${currentBank}`,
        });
        
        try {
            const result = await categorizeTransactionsAction(rawJsonData, currentBank || undefined);
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
        setBankName(null);
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
