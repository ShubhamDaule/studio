
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Category } from '@/lib/types';
import { mockCategories } from '@/lib/mock-data';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category?: Category | null;
};

export function EditCategoryDialog({ isOpen, onClose, onSave, category }: Props) {
  const [customName, setCustomName] = useState('');
  
  const isEditing = !!category;
  const isPredefined = !!category?.isDefault;

  useEffect(() => {
    if (isOpen && category) {
        setCustomName(category.name);
    }
  }, [isOpen, category]);
  
  const handleSave = () => {
    if(!category) return;
    const finalName = customName.trim();
    if (finalName) {
      onSave({
        ...category,
        name: finalName,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            {`Editing the "${category?.name}" category.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="name" className="text-right pt-2">Name</Label>
            <Input id="name" value={customName} className="col-span-3" disabled={isPredefined} onChange={(e) => setCustomName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPredefined ? false : !customName.trim()}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
