
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, UploadCloud, Loader2, PartyPopper } from "lucide-react";

export default function UploadPreviewPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowDialog(true);
      }, 10000); // 10-second fake loading
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col justify-center items-center p-4">
        <div className="absolute top-8 left-8">
          <Button asChild variant="link" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <main className="w-full max-w-2xl mx-auto text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <h1 className="text-3xl font-bold">Analyzing your statement...</h1>
              <p className="text-muted-foreground">
                Our AI is extracting transactions and categorizing your spending. This may take a moment.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">Upload Your Statement</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Drop your PDF bank or credit card statement below to get started.
              </p>
              <div
                className="relative w-full h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <UploadCloud className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="font-semibold">Click to upload or drag & drop</p>
                <p className="text-sm text-muted-foreground">PDF files only</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            </>
          )}
        </main>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <PartyPopper className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Your Analysis is Ready!</DialogTitle>
            <DialogDescription className="text-center">
              Create an account or sign in to view your personalized spending dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4 flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button onClick={() => router.push('/auth?mode=signup')} className="w-full">
              Create Free Account
            </Button>
            <Button variant="ghost" onClick={() => router.push('/auth')} className="w-full">
              Already have an account? Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
