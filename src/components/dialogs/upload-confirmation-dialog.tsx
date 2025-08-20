
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
import { FileText, X, Coins, Edit } from "lucide-react";
import { PdfEditDialog } from "./pdf-edit-dialog";
import { preAnalyzeTransactions } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { calculateAppTokens } from "@/hooks/use-tiers";

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
  
  const handleSaveEdits = async (fileName: string, newText: string) => {
    const preAnalysisResult = await preAnalyzeTransactions(newText, fileName, true);
    if (preAnalysisResult.error || !preAnalysisResult.usage) {
      toast({ variant: "destructive", title: `Re-analysis Failed: ${fileName}`, description: preAnalysisResult.error });
      return;
    }

    setPendingFiles(prev => prev.map(f => {
      if (f.fileName === fileName) {
        return {
          ...f,
          text: newText,
          cost: calculateAppTokens(preAnalysisResult.usage.totalTokens),
        }
      }
      return f;
    }));

    setEditingFile(null);
     toast({
        title: "File Updated",
        description: `Token cost for ${fileName} has been recalculated.`,
    });
  }

  const totalTokenCost = pendingFiles.reduce((acc, file) => acc + file.cost, 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Upload</DialogTitle>
            <DialogDescription>
              Review the files and their estimated token cost. Edit files to remove unwanted pages.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-3">
                {pendingFiles.map((file) => (
                  <div key={file.fileName} className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{file.fileName}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          Est. {file.cost.toFixed(1)} tokens
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingFile(file)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveFile(file.fileName)}>
                            <X className="h-4 w-4" />
                        </Button>
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
              <Button onClick={handleConfirm} disabled={pendingFiles.length === 0}>
                {`Process ${pendingFiles.length} File(s)`}
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
