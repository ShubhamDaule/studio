// Ensure this component is treated as a client-side component
"use client";

// Import necessary React libraries and UI components
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
import { Search, ArrowRight, GripVertical, Landmark } from "lucide-react";
import { EditRuleDialog } from "./edit-rule-dialog";

// Define the props for the RulesDialog component
type Props = {
  isOpen: boolean; // Controls whether the dialog is open or closed
  onClose: () => void; // Function to call when the dialog should be closed
};

// The RulesDialog component displays a list of rules and allows creating new ones.
export function RulesDialog({ isOpen, onClose }: Props) {
  // State to manage the visibility of the EditRuleDialog
  const [isEditRuleDialogOpen, setIsEditRuleDialogOpen] = React.useState(false);

  return (
    <>
      {/* Main dialog for displaying rules */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md sm:max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Rules</DialogTitle>
            </div>
            <DialogDescription>
              Create rules to automatically rename merchants, update categories, and more. Rules are applied top-to-bottom.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
              {/* Header section with rule count, search, and create button */}
              <div className="flex items-center justify-between">
                  <p className="font-semibold">1 Rule</p>
                  <div className="flex items-center gap-2">
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search" className="pl-9 w-48" />
                      </div>
                      {/* Button to open the EditRuleDialog for creating a new rule */}
                      <Button className="btn-gradient-base btn-hover-fade" onClick={() => setIsEditRuleDialogOpen(true)}>Create rule</Button>
                  </div>
              </div>

              {/* Container for a single rule, clicking it opens the edit dialog */}
              <div 
                className="border rounded-lg p-4 bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setIsEditRuleDialogOpen(true)}
              >
                  <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      {/* Conditions section of the rule */}
                      <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-medium">If</span>
                              <Badge variant="outline">merchant name</Badge>
                              <Badge variant="secondary">contains</Badge>
                              <Badge variant="secondary">monarch</Badge>
                          </div>
                           <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-medium">If</span>
                              <Badge variant="outline">expense</Badge>
                              <Badge variant="secondary">greater than</Badge>
                              <Badge variant="secondary">$0.00</Badge>
                          </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

                      {/* Actions section of the rule */}
                      <div className="flex-1 space-y-3">
                           <div>
                              <p className="text-sm text-muted-foreground mb-1">Recategorize to</p>
                              <Badge variant="secondary" className="font-medium">
                                  <Landmark className="h-4 w-4 mr-1.5" />
                                  Financial & Legal Services
                              </bage>
                          </div>
                           <div>
                              <p className="text-sm text-muted-foreground mb-1">Add tag</p>
                               <Badge variant="secondary" className="font-medium bg-yellow-100 text-yellow-800 border-yellow-200/50 hover:bg-yellow-100/80">
                                  <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                                  Subscription
                              </bage>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog for editing or creating a rule */}
      <EditRuleDialog isOpen={isEditRuleDialogOpen} onClose={() => setIsEditRuleDialogOpen(false)} />
    </>
  );
}
