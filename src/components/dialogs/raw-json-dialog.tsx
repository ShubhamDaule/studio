
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import type { RawTransaction } from "@/ai/flows/categorize-transactions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jsonData: RawTransaction[] | null;
};

export function RawJsonDialog({ isOpen, onClose, onConfirm, jsonData }: Props) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Extracted Transactions</DialogTitle>
          <DialogDescription>
            We've extracted the following {jsonData?.length || 0} transactions from your PDF. Review the data, then click "Continue" to have the AI categorize them.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 border rounded-md">
           <ScrollArea className="h-72">
                <pre className="p-4 text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
