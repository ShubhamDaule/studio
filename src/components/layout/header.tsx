
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
import type { ExtractedTransaction, BankName, StatementType, StatementPeriod, TokenUsage, UploadFile } from "@/lib/types";
import { Logo } from "./logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useTiers, calculateAppTokens } from "@/hooks/use-tiers";
import { Progress } from "@/components/ui/progress";
import { UploadConfirmationDialog } from "../dialogs/upload-confirmation-dialog";
import { RawJsonDialog } from "../dialogs/raw-json-dialog";
import { extractTextFromPdf } from "@/lib/pdf-utils";


/**
 * @fileoverview The global header for the application.
 * It contains the logo, navigation, user menu, and the multi-step file upload logic.
 */

/**
 * Defines a type for the data structure that holds the final, processed transactions
 * ready to be added to the dashboard context.
 */
type PendingUpload = {
  data: ExtractedTransaction[];
  fileName: string;
  bankName: BankName;
  statementType: StatementType;
  statementPeriod: StatementPeriod | null;
};

/**
 * Defines a type for the data structure that holds information for the debug dialog,
 * showing what was sent to and received from the AI.
 */
type DebugInfo = {
    processedText: string;
    jsonOutput: string;
    finalUploads: PendingUpload[];
}

/**
 * Renders the user navigation dropdown menu in the header.
 * It displays user info, token balance, and links to settings and sign-out.
 */
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

/**
 * Renders the navigation links for the landing page.
 */
const LandingNavLinks = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-1", className)}>
        <Button variant="link" asChild><Link href="/landing#why-MySpendWise">Why MySpendWise</Link></Button>
        <Button variant="link" asChild><Link href="/pricing">Pricing</Link></Button>
    </div>
);

/**
 * Renders the navigation for the landing page, including auth buttons and a mobile sheet menu.
 */
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


/**
 * Renders the navigation specific to the dashboard, including date/source filters and the upload button.
 * This component contains the core logic for the multi-step file processing pipeline.
 */
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

    // State for managing the multi-step upload process
    const [filesToConfirm, setFilesToConfirm] = React.useState<UploadFile[]>([]);
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [debugInfo, setDebugInfo] = React.useState<DebugInfo | null>(null);


    React.useEffect(() => {
        setIsClient(true);
    }, []);

    /**
     * STEP 1: Handle File Selection (Client-Side)
     * Reads the selected PDF file(s) from the user's machine.
     * Extracts the raw text from each file to prepare for pre-analysis.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
     */
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        toast({ title: "Processing files...", description: "Reading and pre-analyzing your statements." });
        const preppedFiles: UploadFile[] = [];

        for (const file of Array.from(files)) {
            try {
                // Read file into memory as an ArrayBuffer.
                const originalArrayBuffer = await file.arrayBuffer();
                
                // Create a safe copy of the buffer for text extraction.
                // This prevents the original buffer from being "detached" and causing errors later in the PDF editor.
                const bufferForTextExtraction = originalArrayBuffer.slice(0);

                // Extract raw text from the entire PDF using the copied buffer.
                const fullText = await extractTextFromPdf(new Uint8Array(bufferForTextExtraction));
                
                /**
                 * STEP 2: Pre-Analysis (Client & Server)
                 * Send the raw text to a server action for cost estimation and metadata detection (bank, date range).
                 * The `skipAi: true` flag prevents a full AI call, making this step fast and cheap.
                 */
                const preAnalysisResult = await preAnalyzeTransactions(fullText, file.name, true);

                if (preAnalysisResult.error || !preAnalysisResult.usage || !preAnalysisResult.bankName || !preAnalysisResult.statementType) {
                     toast({ variant: "destructive", title: `Analysis Failed: ${file.name}`, description: preAnalysisResult.error });
                    continue;
                }
                
                // Store the prepared file data, ready for the user's confirmation.
                // Crucially, we store the ORIGINAL, untouched arrayBuffer for potential editing.
                preppedFiles.push({
                    text: fullText,
                    fileName: file.name,
                    cost: calculateAppTokens(preAnalysisResult.usage.totalTokens),
                    arrayBuffer: originalArrayBuffer,
                    bankName: preAnalysisResult.bankName,
                    statementType: preAnalysisResult.statementType,
                    statementPeriod: preAnalysisResult.statementPeriod ?? null,
                });

            } catch (error: any) {
                toast({ variant: "destructive", title: `Upload Failed: ${file.name}`, description: error.message });
            }
        }
        
        /**
         * STEP 3: Confirmation Dialog
         * If any files were successfully pre-processed, open the confirmation dialog
         * where the user can review costs and edit pages.
         */
        if (preppedFiles.length > 0) {
            setFilesToConfirm(preppedFiles);
            setIsConfirming(true);
        } else {
             setIsUploading(false);
        }
        
        // Reset the file input to allow uploading the same file again.
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    /**
     * Step 4: Final AI Extraction (Client & Server)
     * After user confirms (and potentially edits pages), send the final text
     * to the server for the full AI extraction.
     * @param {UploadFile[]} confirmedFiles - The list of files the user has confirmed for processing.
     */
    const handleConfirmUpload = async (confirmedFiles: UploadFile[]) => {
        setIsConfirming(false);
        if (confirmedFiles.length === 0) {
            setIsUploading(false);
            return;
        }
        
        // Validate each file before sending to AI to prevent errors with empty text.
        for (const file of confirmedFiles) {
            if (!file.text || file.text.trim().length < 50) {
                toast({
                    variant: "destructive",
                    title: "Processing Canceled",
                    description: `File "${file.fileName}" has insufficient text content (${file.text.trim().length} characters). Please check your page selection.`
                });
                setIsUploading(false);
                return;
            }
        }

        // Keep the loader active during the main AI processing step.
        setIsUploading(true);
        toast({ title: "Sending to AI...", description: "Extracting transactions. This may take a moment." });

        const allFinalUploads: PendingUpload[] = [];
        let totalUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        let allProcessedText = "";
        let allJsonOutput = "";

        for (const file of confirmedFiles) {
            // The `false` flag tells the server action to perform the full AI extraction.
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
            // Aggregate text and JSON for the debug dialog.
            allProcessedText += `--- START ${file.fileName} ---\n${finalResult.processedText}\n--- END ${file.fileName} ---\n\n`;
            allJsonOutput += `// ${file.fileName}\n${JSON.stringify(finalResult.data, null, 2)}\n\n`;
        }
        
        /**
         * STEP 5, Part 1: Debug Dialog & Token Consumption
         * If successful, consume the tokens and show the debug dialog for transparency.
         */
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

    /**
     * STEP 5, Part 2: Add to Dashboard
     * After the user reviews the raw AI output in the debug dialog,
     * this function adds the processed transactions to the main dashboard state.
     */
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

        {/* Render dialogs needed for the upload flow */}
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

/**
 * Determines which navigation component to render based on the current page path.
 */
const NavContent = () => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    if (isDashboard) {
        return <DashboardNav />;
    }
    return <LandingNav />;
}


/**
 * The main header component for the application.
 * It's sticky and contains the logo and the appropriate navigation content.
 */
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
