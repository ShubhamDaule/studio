
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Category } from '@/lib/types';

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
    if (isOpen) {
        if(category) {
            setCustomName(category.name);
        } else {
            setCustomName('');
        }
    }
  }, [isOpen, category]);
  
  const handleSave = () => {
    const finalName = customName.trim();
    if (finalName) {
      if (isEditing) {
        onSave({ ...category!, name: finalName });
      } else {
         onSave({ name: finalName, icon: 'Package', isDefault: false });
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Create Custom Category'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Editing the "${category?.name}" category.` : 'Create a new category for your budget.'}
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
