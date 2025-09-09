
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ArrowRight, GripVertical, Landmark, Tag } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function RulesDialog({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Rules</DialogTitle>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Options</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Import Rules</DropdownMenuItem>
                    <DropdownMenuItem>Export Rules</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogDescription>
            Rules allow you to rename, recategorize, split your transactions, and more. If multiple rules apply to the same transaction, they will apply in the order listed here (top to bottom). You can drag and drop to edit the order as needed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-semibold">1 Rule</p>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search" className="pl-9 w-48" />
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">Create rule</Button>
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-4">
                    {/* Conditions */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            <span className="text-sm font-medium">If</span>
                            <Badge variant="outline">merchant name</Badge>
                            <Badge variant="outline">contains</Badge>
                            <Badge variant="outline">monarch</Badge>
                        </div>
                         <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            <span className="text-sm font-medium">If</span>
                            <Badge variant="outline">expense</Badge>
                            <Badge variant="outline">greater than</Badge>
                            <Badge variant="outline">$0.00</Badge>
                        </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground" />

                    {/* Actions */}
                    <div className="flex-1 space-y-3">
                         <div>
                            <p className="text-sm text-muted-foreground mb-1">Recategorize to</p>
                            <Badge variant="secondary" className="font-medium">
                                <Landmark className="h-4 w-4 mr-1.5" />
                                Financial & Legal Services
                            </Badge>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground mb-1">Add tag</p>
                             <Badge variant="secondary" className="font-medium">
                                <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                                Subscription
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
