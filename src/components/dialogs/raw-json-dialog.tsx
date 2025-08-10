
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import type { RawTransaction } from "@/ai/flows/categorize-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jsonData: RawTransaction[] | null;
  rawText: string | null;
};

export function RawJsonDialog({ isOpen, onClose, onConfirm, jsonData, rawText }: Props) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Confirm Extracted Data</DialogTitle>
          <DialogDescription>
            We've processed your PDF. Review the extracted text and the structured transactions below, then click "Continue" to have the AI categorize them.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 border rounded-md flex-grow min-h-0">
           <Tabs defaultValue="json" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json">Structured JSON ({jsonData?.length || 0} transactions)</TabsTrigger>
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>
            <TabsContent value="json" className="flex-grow min-h-0">
                <ScrollArea className="h-full">
                    <pre className="p-4 text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
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
