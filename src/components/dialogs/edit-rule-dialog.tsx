// Ensure this component is treated as a client-side component
"use client";

// Import necessary React libraries and UI components
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Landmark, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define the props for the EditRuleDialog component
type Props = {
  isOpen: boolean; // Controls whether the dialog is open or closed
  onClose: () => void; // Function to call when the dialog should be closed
};

/**
 * A reusable component to create a section for a rule condition or action.
 * It includes a title, a switch to enable/disable the section, and the content of the section.
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title of the rule section.
 * @param {React.ReactNode} props.children - The content of the rule section.
 * @param {boolean} props.isEnabled - Whether the rule section is currently enabled.
 * @param {(enabled: boolean) => void} props.onToggle - The function to call when the switch is toggled.
 * @returns {JSX.Element} The rendered RuleSection component.
 */
const RuleSection = ({ title, children, isEnabled, onToggle }: { title: string; children: React.ReactNode; isEnabled: boolean; onToggle: (enabled: boolean) => void }) => {
  return (
    <div className="p-4 rounded-lg bg-muted/40 border space-y-4">
        <div className="flex items-center justify-between">
            <Label className="font-semibold">{title}</Label>
            <Switch checked={isEnabled} onCheckedChange={onToggle} />
        </div>
        {/* Only render the children if the section is enabled */}
        {isEnabled && <div className="pt-2">{children}</div>}
    </div>
  )
}

/**
 * A dialog component for creating and editing transaction rules.
 * It allows users to define conditions based on transaction properties
 * and specify actions to be taken when those conditions are met.
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} The rendered EditRuleDialog component.
 */
export function EditRuleDialog({ isOpen, onClose }: Props) {
  // State variables to manage whether each rule condition is enabled
  const [merchantsEnabled, setMerchantsEnabled] = React.useState(true);
  const [amountEnabled, setAmountEnabled] = React.useState(true);
  const [categoriesEnabled, setCategoriesEnabled] = React.useState(false);
  const [accountsEnabled, setAccountsEnabled] = React.useState(false);
  
  // State variables to manage whether each rule action is enabled
  const [renameEnabled, setRenameEnabled] = React.useState(false);
  const [updateCategoryEnabled, setUpdateCategoryEnabled] = React.useState(true);
  const [addTagsEnabled, setAddTagsEnabled] = React.useState(true);
  const [hideEnabled, setHideEnabled] = React.useState(false);
  const [reviewEnabled, setReviewEnabled] = React.useState(false);
  const [goalEnabled, setGoalEnabled] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit rule</DialogTitle>
          {/* Tabs to switch between rule settings and a preview of the changes */}
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-2 max-w-sm">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview changes (0)</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto p-1">
            {/* Conditions Column: Defines the criteria for the rule */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">If transaction matches criteria...</h3>

                {/* Rule section for matching based on merchant name */}
                <RuleSection title="Merchants" isEnabled={merchantsEnabled} onToggle={setMerchantsEnabled}>
                    <div className="grid grid-cols-3 gap-2">
                        <Select defaultValue="name">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="name">Merchant name</SelectItem></SelectContent>
                        </Select>
                        <Select defaultValue="contains">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="contains">Contains</SelectItem></SelectContent>
                        </Select>
                        <Input defaultValue="monarch" />
                    </div>
                </RuleSection>

                 {/* Rule section for matching based on transaction amount */}
                 <RuleSection title="Amount" isEnabled={amountEnabled} onToggle={setAmountEnabled}>
                    <div className="grid grid-cols-3 gap-2">
                        <Select defaultValue="expense">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="expense">Expense</SelectItem></SelectContent>
                        </Select>
                        <Select defaultValue="greater">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="greater">Greater than</SelectItem></SelectContent>
                        </Select>
                        <Input defaultValue="$0.00" />
                    </div>
                </RuleSection>

                 {/* Rule section for matching based on categories */}
                 <RuleSection title="Categories" isEnabled={categoriesEnabled} onToggle={setCategoriesEnabled}>
                    <p className="text-sm text-muted-foreground">Define category criteria here...</p>
                 </RuleSection>
                 
                 {/* Rule section for matching based on accounts */}
                 <RuleSection title="Accounts" isEnabled={accountsEnabled} onToggle={setAccountsEnabled}>
                    <p className="text-sm text-muted-foreground">Define account criteria here...</p>
                 </RuleSection>
            </div>
            {/* Actions Column: Defines what happens when the conditions are met */}
            <div className="space-y-4">
                 <h3 className="font-semibold text-lg">Then apply these updates...</h3>
                 
                 {/* Rule action to rename the merchant */}
                 <RuleSection title="Rename merchant" isEnabled={renameEnabled} onToggle={setRenameEnabled}>
                    <Input placeholder="New merchant name" />
                 </RuleSection>

                  {/* Rule action to update the transaction category */}
                  <RuleSection title="Update category" isEnabled={updateCategoryEnabled} onToggle={setUpdateCategoryEnabled}>
                    <Select>
                        <SelectTrigger>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <Landmark className="h-4 w-4 text-muted-foreground" />
                                    <span>Financial & Legal Services</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent><SelectItem value="financial">Financial & Legal Services</SelectItem></SelectContent>
                    </Select>
                 </RuleSection>

                 {/* Rule action to add tags to the transaction */}
                 <RuleSection title="Add tags" isEnabled={addTagsEnabled} onToggle={setAddTagsEnabled}>
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-background">
                         <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-200/50">
                            <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                            Subscription
                            <button className="ml-1 text-yellow-600 hover:text-yellow-800">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </span>
                        <Input className="flex-1 border-0 shadow-none focus-visible:ring-0 h-auto p-0" placeholder="Add tag..." />
                    </div>
                 </RuleSection>

                 {/* Other rule actions */}
                 <RuleSection title="Hide transaction" isEnabled={hideEnabled} onToggle={setHideEnabled}><></></RuleSection>
                 <RuleSection title="Review status" isEnabled={reviewEnabled} onToggle={setReviewEnabled}><></></RuleSection>
                 <RuleSection title="Link to goal" isEnabled={goalEnabled} onToggle={setGoalEnabled}><></></RuleSection>
                 
                 {/* Separator to indicate an alternative action */}
                 <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-2 text-xs text-muted-foreground">OR</span>
                 </div>
                 
                 {/* Button to split the transaction */}
                 <button className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/40 border hover:bg-muted/80 transition-colors">
                    <span className="font-semibold">Split transaction</span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                 </button>
            </div>
        </div>
        {/* Dialog footer with action buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="destructive">Delete</Button>
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button className="btn-gradient-base btn-hover-fade">Save</Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
