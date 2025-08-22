
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
import { Text, FileJson } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  processedText: string;
  jsonOutput: string;
};

export function RawJsonDialog({ isOpen, onClose, onContinue, processedText, jsonOutput }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>AI Extraction Details</DialogTitle>
          <DialogDescription>
            This is the raw data sent to and received from the AI for processing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 h-full py-4 overflow-hidden">
            <div className="flex flex-col gap-2 h-full">
                <h3 className="font-semibold flex items-center gap-2 text-sm"><Text className="w-4 h-4" /> Processed Text Sent to AI</h3>
                <ScrollArea className="border rounded-md p-2 h-full bg-muted/30">
                    <pre className="text-xs whitespace-pre-wrap break-words">{processedText}</pre>
                </ScrollArea>
            </div>
             <div className="flex flex-col gap-2 h-full">
                <h3 className="font-semibold flex items-center gap-2 text-sm"><FileJson className="w-4 h-4" /> Raw JSON Output from AI</h3>
                <ScrollArea className="border rounded-md p-2 h-full bg-muted/30">
                    <pre className="text-xs whitespace-pre-wrap break-words">{jsonOutput}</pre>
                </ScrollArea>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onContinue}>Continue to Dashboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
