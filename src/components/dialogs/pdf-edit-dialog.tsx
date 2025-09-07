
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
import { Loader2 } from "lucide-react";
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { extractTextFromPdf } from "@/lib/pdf-utils";


/**
 * A dialog for editing which pages of a PDF to include for analysis.
 * It generates thumbnails for each page, allows the user to select/deselect pages,
 * and then rebuilds the PDF in memory with only the selected pages before re-running
 * text extraction.
 */

type Page = {
  pageNumber: number; // 1-based for display
  pageIndex: number;  // 0-based for logic
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
  const [selectedPages, setSelectedPages] = React.useState<Set<number>>(new Set()); // Uses 0-based index
  const [isLoading, setIsLoading] = React.useState(true);
  const [pdfJsDoc, setPdfJsDoc] = React.useState<pdfjsLib.PDFDocumentProxy | null>(null);

  /**
   * Effect to load the PDF and generate page thumbnails when the dialog is opened.
   */
  React.useEffect(() => {
    if (!isOpen || !file) return;

    const setupPdfEditor = async () => {
      setIsLoading(true);
      try {
        // Configure the worker for pdfjs-dist
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

        const bufferCopy = file.arrayBuffer.slice(0);
        
        // Load with pdfjs-dist for thumbnails and text extraction
        const pdfDocProxy = await pdfjsLib.getDocument({ data: bufferCopy }).promise;
        setPdfJsDoc(pdfDocProxy);
        
        const pageThumbnails: Page[] = [];
        const initialSelected = new Set<number>();

        for (let i = 0; i < pdfDocProxy.numPages; i++) {
          const page = await pdfDocProxy.getPage(i + 1); // pdfjs is 1-based for getPage
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            pageThumbnails.push({
              pageNumber: i + 1,
              pageIndex: i,
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

    setupPdfEditor();
  }, [isOpen, file, toast, onClose]);
  
  /**
   * Toggles the selection state of a single page using its 0-based index.
   * @param {number} pageIndex - The 0-based index of the page to toggle.
   */
  const handleTogglePage = (pageIndex: number) => {
    setSelectedPages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(pageIndex)) {
            newSet.delete(pageIndex);
        } else {
            newSet.add(pageIndex);
        }
        return newSet;
    });
  };
  
  /**
   * Selects all pages in the PDF.
   */
  const handleSelectAll = () => {
    setSelectedPages(new Set(pages.map(p => p.pageIndex)));
  }

  /**
   * Deselects all pages in the PDF.
   */
  const handleDeselectAll = () => {
    setSelectedPages(new Set());
  }

  /**
   * Rebuilds the PDF with only the selected pages and re-extracts the text.
   * This is the core logic that ensures the AI only processes the desired content.
   */
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
        if (selectedPages.size === 0) {
          throw new Error("No pages selected. Please select at least one page.");
        }
        if (!pdfJsDoc) {
            throw new Error("Original PDF document not loaded.");
        }

        const sortedPageIndices = Array.from(selectedPages).sort((a, b) => a - b);
        
        // STEP 1: Extract text directly from the original PDF for each selected page.
        // This is more reliable than extracting from a reconstructed PDF.
        let combinedText = '';
        for (const pageIndex of sortedPageIndices) {
            const page = await pdfJsDoc.getPage(pageIndex + 1); // pdf.js is 1-based
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .filter(item => 'str' in item)
                .map(item => (item as any).str)
                .join(' ');
            combinedText += pageText + '\n\n';
        }

        // STEP 2: Reconstruct a new, smaller PDF using the original ArrayBuffer.
        // This is still useful for consistency, even if text extraction is decoupled.
        const originalPdfDoc = await PDFDocument.load(file.arrayBuffer.slice(0), { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(originalPdfDoc, sortedPageIndices);
        copiedPages.forEach(page => newDoc.addPage(page));
        const newPdfBytesUint8 = await newDoc.save();

        // STEP 3: Validate that the extracted text is not empty before saving.
        if (combinedText.trim().length < 10) {
            throw new Error(`Selected pages contain no readable text. Please check your selection.`);
        }
        
        // STEP 4: Pass both the directly extracted text and the new, smaller ArrayBuffer back.
        onSave(file.fileName, combinedText, newPdfBytesUint8.buffer);
        onClose();

    } catch (err: any) {
        console.error("PDF re-build failed:", err);
        toast({ variant: "destructive", title: "Apply Changes failed", description: err?.message ?? "Unknown error" });
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
                        <div key={page.pageIndex} className="relative group">
                             <Label htmlFor={`page-${page.pageIndex}`} className="cursor-pointer">
                                <img
                                    src={page.thumbnailUrl}
                                    alt={`Page ${page.pageNumber}`}
                                    className="rounded-md border-2 border-transparent group-hover:border-primary transition-colors data-[checked=true]:border-primary"
                                    data-checked={selectedPages.has(page.pageIndex)}
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 transition-opacity group-hover:opacity-100 data-[checked=false]:opacity-40" data-checked={selectedPages.has(page.pageIndex)} />
                             </Label>
                             <Checkbox
                                id={`page-${page.pageIndex}`}
                                checked={selectedPages.has(page.pageIndex)}
                                onCheckedChange={() => handleTogglePage(page.pageIndex)}
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
