
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UploadFile } from "@/lib/types";
import { FileText, X, Coins, Edit, Banknote, Calendar, Loader2 } from "lucide-react";
import { PdfEditDialog } from "./pdf-edit-dialog";
import { preAnalyzeTransactions } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { calculateAppTokens } from "@/hooks/use-tiers";
import { format, parseISO } from "date-fns";
import { Skeleton } from "../ui/skeleton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (files: UploadFile[]) => void;
  filesToConfirm: UploadFile[];
};

export function UploadConfirmationDialog({ isOpen, onClose, onConfirm, filesToConfirm }: Props) {
  const { toast } = useToast();
  const [pendingFiles, setPendingFiles] = React.useState<UploadFile[]>([]);
  const [editingFile, setEditingFile] = React.useState<UploadFile | null>(null);
  const [recalculatingFile, setRecalculatingFile] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPendingFiles(filesToConfirm);
    }
  }, [isOpen, filesToConfirm]);

  const handleRemoveFile = (fileName: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.fileName !== fileName));
  };

  const handleConfirm = () => {
    onConfirm(pendingFiles);
  };
  
  const handleSaveEdits = async (fileName: string, newText: string, newBuffer: ArrayBuffer) => {
    setRecalculatingFile(fileName);
    try {
        // We already have the text, so just send it for pre-analysis to get new metadata and cost.
        const preAnalysisResult = await preAnalyzeTransactions(newText, fileName, true);
        if (preAnalysisResult.error || !preAnalysisResult.usage) {
            toast({ variant: "destructive", title: `Re-analysis Failed: ${fileName}`, description: preAnalysisResult.error });
            return;
        }

        setPendingFiles(prev => prev.map(f => {
            if (f.fileName === fileName) {
                return {
                    ...f,
                    text: newText, // Use the newly extracted text
                    arrayBuffer: newBuffer, // Use the new, smaller buffer
                    cost: calculateAppTokens(preAnalysisResult.usage.totalTokens),
                    bankName: preAnalysisResult.bankName ?? 'Unknown',
                    statementType: preAnalysisResult.statementType ?? 'Unknown',
                    statementPeriod: preAnalysisResult.statementPeriod ?? null,
                }
            }
            return f;
        }));

        setEditingFile(null);
        toast({
            title: "File Updated",
            description: `Token cost for ${fileName} has been recalculated.`,
        });
    } catch (e: any) {
         toast({ variant: "destructive", title: "Error re-analyzing file", description: e.message });
    } finally {
      setRecalculatingFile(null);
    }
  }
  
  const formatStatementPeriod = (period: { startDate: string, endDate: string } | null) => {
    if (!period) return 'N/A';
    try {
        const start = format(parseISO(period.startDate), 'MMM d, yyyy');
        const end = format(parseISO(period.endDate), 'MMM d, yyyy');
        return `${start} - ${end}`;
    } catch {
        return 'Invalid Date';
    }
  }

  const totalTokenCost = pendingFiles.reduce((acc, file) => acc + file.cost, 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Confirm Upload</DialogTitle>
            <DialogDescription>
              Review files and token costs. Edit to remove pages and save tokens.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-3">
                {pendingFiles.map((file) => (
                  <div key={file.fileName} className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col gap-1.5 overflow-hidden">
                        <span className="text-sm font-medium truncate">{file.fileName}</span>
                        {recalculatingFile === file.fileName ? (
                           <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                           </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Banknote className="h-3 w-3" /> {file.bankName} ({file.statementType})</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatStatementPeriod(file.statementPeriod)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Coins className="h-3 w-3" />
                              Est. {file.cost.toFixed(1)} tokens
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                     <div className="flex items-center flex-shrink-0">
                        {recalculatingFile === file.fileName ? (
                             <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                            <>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingFile(file)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveFile(file.fileName)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="sm:justify-between items-center">
            <div className="text-sm font-medium flex items-center gap-2">
               <Coins className="h-4 w-4 text-primary" />
               Total Estimated Cost: 
               <span className="font-bold text-primary">{totalTokenCost.toFixed(1)} Tokens</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={pendingFiles.length === 0 || !!recalculatingFile}>
                {recalculatingFile ? (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {recalculatingFile ? 'Recalculating...' : `Process ${pendingFiles.length} File(s)`}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {editingFile && (
        <PdfEditDialog
            isOpen={!!editingFile}
            onClose={() => setEditingFile(null)}
            file={editingFile}
            onSave={handleSaveEdits}
        />
      )}
    </>
  );
}
