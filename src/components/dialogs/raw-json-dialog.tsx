
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
      <DialogContent className="max-w-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Extracted Data</DialogTitle>
          <DialogDescription>
            We've processed your PDF. Review the extracted text and the structured transactions below, then click "Continue" to have the AI categorize them.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 border rounded-md">
           <Tabs defaultValue="json" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json">Structured JSON ({jsonData?.length || 0} transactions)</TabsTrigger>
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>
            <TabsContent value="json">
                <ScrollArea className="h-72">
                    <pre className="p-4 text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="raw">
                 <ScrollArea className="h-72">
                    <pre className="p-4 text-xs whitespace-pre-wrap">{rawText}</pre>
                </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} disabled={!jsonData || jsonData.length === 0}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
