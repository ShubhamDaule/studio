
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/context/dashboard-context";
import { LogOut, PanelLeft, Upload, Loader2, Settings, Coins } from "lucide-react";
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
import { preAnalyzeTransactions } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import type { ExtractedTransaction, BankName, StatementType, StatementPeriod, TokenUsage, UploadFile } from "@/lib/types";
import { Logo } from "./logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useTiers, calculateAppTokens } from "@/hooks/use-tiers";
import { Progress } from "@/components/ui/progress";
import { UploadConfirmationDialog } from "../dialogs/upload-confirmation-dialog";
import { RawJsonDialog } from "../dialogs/raw-json-dialog";

// Set the workerSrc for pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
}

type PendingUpload = {
  data: ExtractedTransaction[];
  fileName: string;
  bankName: BankName;
  statementType: StatementType;
  statementPeriod: StatementPeriod | null;
};

type DebugInfo = {
    processedText: string;
    jsonOutput: string;
    finalUploads: PendingUpload[];
}

const UserNav = () => {
  const { user, signOut } = useAuth();
  const { tokenBalance, maxTokens } = useTiers();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  }

  if (!user) {
    return null;
  }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'S';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  const tokenPercentage = maxTokens > 0 ? (tokenBalance / maxTokens) * 100 : 0;
  
  const formatTokenDisplay = (num: number) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName ?? ""} />}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.displayName)}
                    </AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.displayName}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <div className="px-2 py-1.5 text-sm">
                <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-medium flex items-center gap-2">
                        <Coins className="h-4 w-4 text-muted-foreground" /> Tokens
                    </span>
                    <span className="font-bold text-primary">{formatTokenDisplay(tokenBalance)} / {maxTokens}</span>
                </div>
                <Progress value={tokenPercentage} className="h-2" />
            </div>
           <DropdownMenuItem onSelect={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
           <DropdownMenuItem onSelect={() => router.push('/pricing')}>
            <Coins className="mr-2 h-4 w-4" />
            <span>Manage Plan</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

const LandingNavLinks = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-1", className)}>
        <Button variant="link" asChild><Link href="/landing#why-MySpendWise">Why MySpendWise</Link></Button>
        <Button variant="link" asChild><Link href="/pricing">Pricing</Link></Button>
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
                        <Button variant="ghost" asChild><Link href="/auth">Login</Link></Button>
                        <Button className="btn-gradient-base btn-hover-fade" asChild>
                            <Link href="/auth?mode=signup">Get Started</Link>
                        </Button>
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
                                    <Button variant="outline" asChild><Link href="/auth">Login</Link></Button>
                                    <Button className="btn-gradient-base btn-hover-fade" asChild>
                                      <Link href="/auth?mode=signup">Get Started</Link>
                                    </Button>
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
        addUploadedTransactions,
        isUploading,
        setIsUploading
    } = useDashboardContext();
    const { toast } = useToast();
    const { consumeTokens } = useTiers();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = React.useState(false);

    const [filesToConfirm, setFilesToConfirm] = React.useState<UploadFile[]>([]);
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [debugInfo, setDebugInfo] = React.useState<DebugInfo | null>(null);


    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        toast({ title: "Processing files...", description: "Reading and pre-analyzing your statements." });
        const preppedFiles: UploadFile[] = [];

        for (const file of Array.from(files)) {
            try {
                const originalBuffer = await file.arrayBuffer();
                
                // Use a copy for analysis, and another for storage/editing
                const analysisBuffer = originalBuffer.slice(0); 
                const storageBuffer = originalBuffer.slice(0);

                const pdf = await pdfjsLib.getDocument({ data: analysisBuffer }).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const pageText = content.items.map(item => (item as any).str).join(" ");
                    fullText += "\\n" + pageText;
                }
                
                const preAnalysisResult = await preAnalyzeTransactions(fullText, file.name, true);

                if (preAnalysisResult.error || !preAnalysisResult.usage || !preAnalysisResult.bankName || !preAnalysisResult.statementType) {
                     toast({ variant: "destructive", title: `Analysis Failed: ${file.name}`, description: preAnalysisResult.error });
                    continue;
                }
                
                preppedFiles.push({
                    text: fullText,
                    fileName: file.name,
                    cost: calculateAppTokens(preAnalysisResult.usage.totalTokens),
                    arrayBuffer: storageBuffer,
                    bankName: preAnalysisResult.bankName,
                    statementType: preAnalysisResult.statementType,
                    statementPeriod: preAnalysisResult.statementPeriod ?? null,
                });

            } catch (error: any) {
                toast({ variant: "destructive", title: `Upload Failed: ${file.name}`, description: error.message });
            }
        }
        
        if (preppedFiles.length > 0) {
            setFilesToConfirm(preppedFiles);
            setIsConfirming(true);
        } else {
             setIsUploading(false);
        }
        
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleConfirmUpload = async (confirmedFiles: UploadFile[]) => {
        setIsConfirming(false);
        if (confirmedFiles.length === 0) {
            setIsUploading(false);
            return;
        }
        
        // This keeps the loader active during AI processing
        setIsUploading(true);
        toast({ title: "Sending to AI...", description: "Extracting transactions. This may take a moment." });

        const allFinalUploads: PendingUpload[] = [];
        let totalUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        let allProcessedText = "";
        let allJsonOutput = "";

        for (const file of confirmedFiles) {
            const finalResult = await preAnalyzeTransactions(file.text, file.fileName, false);
            if (finalResult.error || !finalResult.data || !finalResult.bankName || !finalResult.statementType || !finalResult.usage || !finalResult.processedText) {
                toast({ variant: "destructive", title: `Upload Failed: ${file.fileName}`, description: finalResult.error });
                continue;
            }
            totalUsage.totalTokens += finalResult.usage.totalTokens;
            allFinalUploads.push({
                data: finalResult.data,
                fileName: file.fileName,
                bankName: finalResult.bankName,
                statementType: finalResult.statementType,
                statementPeriod: finalResult.statementPeriod,
            });
            allProcessedText += `--- START ${file.fileName} ---\n${finalResult.processedText}\n--- END ${file.fileName} ---\n\n`;
            allJsonOutput += `// ${file.fileName}\n${JSON.stringify(finalResult.data, null, 2)}\n\n`;
        }
        
        if (allFinalUploads.length > 0) {
            if (consumeTokens(totalUsage.totalTokens)) {
                setDebugInfo({
                    processedText: allProcessedText,
                    jsonOutput: allJsonOutput,
                    finalUploads: allFinalUploads,
                });
            } else {
                 setIsUploading(false);
            }
        } else {
             setIsUploading(false);
        }
    }

    const handleContinueFromDebug = () => {
        if (debugInfo) {
            addUploadedTransactions(debugInfo.finalUploads);
        }
        setDebugInfo(null);
        setIsUploading(false);
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
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn-gradient-base btn-hover-fade"
                >
                    {isUploading ? (
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

        {isClient && (
            <UploadConfirmationDialog
                isOpen={isConfirming}
                onClose={() => {
                    setIsConfirming(false);
                    setIsUploading(false);
                }}
                onConfirm={handleConfirmUpload}
                filesToConfirm={filesToConfirm}
            />
        )}
        {isClient && debugInfo && (
            <RawJsonDialog
                isOpen={!!debugInfo}
                onClose={() => {
                    setDebugInfo(null);
                    setIsUploading(false);
                }}
                onContinue={handleContinueFromDebug}
                processedText={debugInfo.processedText}
                jsonOutput={debugInfo.jsonOutput}
            />
        )}
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
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 gap-4">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex-1 flex justify-end">
              <NavContent />
            </div>
          </div>
        </header>
    );
}
