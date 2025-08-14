
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import type { ExtractedTransaction } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jsonData: ExtractedTransaction[] | null;
  rawText: string | null;
  processedText: string | null;
};

export function RawJsonDialog({ isOpen, onClose, onConfirm, jsonData, rawText, processedText }: Props) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Confirm Extracted Data</DialogTitle>
          <DialogDescription>
            Review the data below. We show the raw text from the PDF, the cleaned-up version sent to the AI, and the final structured JSON.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 border rounded-md flex-grow min-h-0">
           <Tabs defaultValue="json" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="json">Structured JSON ({jsonData?.length || 0})</TabsTrigger>
              <TabsTrigger value="processed">Processed for AI</TabsTrigger>
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>
            <TabsContent value="json" className="flex-grow min-h-0">
                <ScrollArea className="h-full">
                    <pre className="p-4 text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="processed" className="flex-grow min-h-0">
                 <ScrollArea className="h-full">
                    <pre className="p-4 text-xs whitespace-pre-wrap">{processedText}</pre>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="raw" className="flex-grow min-h-0">
                 <ScrollArea className="h-full">
                    <pre className="p-4 text-xs whitespace-pre-wrap">{rawText}</pre>
                </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} disabled={!jsonData || jsonData.length === 0}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
