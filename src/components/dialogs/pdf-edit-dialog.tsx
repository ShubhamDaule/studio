
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { UploadFile } from "@/lib/types";
import * as pdfjsLib from "pdfjs-dist";
import { Loader2 } from "lucide-react";
import type { PDFDocument } from 'pdf-lib';


pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type Page = {
  pageNumber: number;
  thumbnailUrl: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  file: UploadFile;
  onSave: (fileName: string, newText: string, newBuffer: ArrayBuffer) => void;
};

export function PdfEditDialog({ isOpen, onClose, file, onSave }: Props) {
  const { toast } = useToast();
  const [pages, setPages] = React.useState<Page[]>([]);
  const [selectedPages, setSelectedPages] = React.useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const pdfLibRef = React.useRef<{ PDFDocument: typeof PDFDocument } | null>(null);

  React.useEffect(() => {
    import('pdf-lib').then(module => {
      pdfLibRef.current = module;
    });
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const generateThumbnails = async () => {
      setIsLoading(true);
      try {
        const bufferCopy = file.arrayBuffer.slice(0);
        const pdf = await pdfjsLib.getDocument({ data: bufferCopy }).promise;
        const pageThumbnails: Page[] = [];
        const initialSelected = new Set<number>();

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            pageThumbnails.push({
              pageNumber: i,
              thumbnailUrl: canvas.toDataURL(),
            });
            initialSelected.add(i);
          }
        }
        setPages(pageThumbnails);
        setSelectedPages(initialSelected);
      } catch (error) {
        console.error("Failed to process PDF:", error);
        toast({ variant: "destructive", title: "PDF Error", description: "Could not read the pages from this PDF file." });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnails();
  }, [isOpen, file, toast, onClose]);
  
  const handleTogglePage = (pageNumber: number) => {
    setSelectedPages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(pageNumber)) {
            newSet.delete(pageNumber);
        } else {
            newSet.add(pageNumber);
        }
        return newSet;
    });
  };
  
  const handleSelectAll = () => {
    setSelectedPages(new Set(pages.map(p => p.pageNumber)));
  }

  const handleDeselectAll = () => {
    setSelectedPages(new Set());
  }

  const handleSaveChanges = async () => {
    if (!pdfLibRef.current) {
        toast({ variant: "destructive", title: "Error", description: "PDF library not loaded yet." });
        return;
    }
    setIsLoading(true);
    try {
        const { PDFDocument } = pdfLibRef.current;
        
        const originalPdfBytes = file.arrayBuffer.slice(0);
        const pdfDoc = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true });
        const newPdfDoc = await PDFDocument.create();
        
        const sortedSelected = Array.from(selectedPages).sort((a,b) => a - b);
        const pageIndices = sortedSelected.map(p => p - 1);

        const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdfDoc.addPage(page));

        const newPdfBytes = await newPdfDoc.save();
        const newArrayBuffer = newPdfBytes.buffer;

        const newPdfForText = await pdfjsLib.getDocument({ data: newPdfBytes }).promise;
        let newText = "";
        for (let i = 1; i <= newPdfForText.numPages; i++) {
            const page = await newPdfForText.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => (item as any).str).join(" ");
            newText += "\\n" + pageText;
        }
        
        onSave(file.fileName, newText, newArrayBuffer);

    } catch(e) {
        console.error("Error saving PDF changes:", e);
        toast({ variant: "destructive", title: "Error", description: "Could not save changes." });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Pages for {file.fileName}</DialogTitle>
          <DialogDescription>
            Deselect any pages you want to exclude from the analysis to save tokens.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
             <>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{selectedPages.size} of {pages.length} pages selected</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSelectAll}>Select All</Button>
                        <Button variant="outline" size="sm" onClick={handleDeselectAll}>Deselect All</Button>
                    </div>
                </div>
                <ScrollArea className="h-96 border rounded-md p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pages.map((page) => (
                        <div key={page.pageNumber} className="relative group">
                             <Label htmlFor={`page-${page.pageNumber}`} className="cursor-pointer">
                                <img
                                    src={page.thumbnailUrl}
                                    alt={`Page ${page.pageNumber}`}
                                    className="rounded-md border-2 border-transparent group-hover:border-primary transition-colors data-[checked=true]:border-primary"
                                    data-checked={selectedPages.has(page.pageNumber)}
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 transition-opacity group-hover:opacity-100 data-[checked=false]:opacity-40" data-checked={selectedPages.has(page.pageNumber)} />
                             </Label>
                             <Checkbox
                                id={`page-${page.pageNumber}`}
                                checked={selectedPages.has(page.pageNumber)}
                                onCheckedChange={() => handleTogglePage(page.pageNumber)}
                                className="absolute top-2 right-2 h-5 w-5 bg-background"
                            />
                            <div className="absolute bottom-2 left-2 text-white text-xs font-bold bg-black/50 rounded-full px-2 py-0.5">
                                {page.pageNumber}
                            </div>
                        </div>
                    ))}
                  </div>
                </ScrollArea>
             </>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} disabled={isLoading || selectedPages.size === 0}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
