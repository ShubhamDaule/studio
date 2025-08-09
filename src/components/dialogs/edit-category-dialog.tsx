
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconPicker } from '../icon-picker';
import type { Category } from '@/lib/types';
import { defaultCategoryIcons } from '../icons';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category, icon: string) => void;
  category?: Category | null;
  icon?: string | null;
};

export function EditCategoryDialog({ isOpen, onClose, onSave, category, icon: initialIcon }: Props) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Smile');

  useEffect(() => {
    if (isOpen) {
      setName(category || '');
      const defaultIcon = category ? (Object.keys(defaultCategoryIcons).includes(category) ? category : 'Package') : 'Package';
      setSelectedIcon(initialIcon || defaultIcon);
    }
  }, [isOpen, category, initialIcon]);
  
  const handleSave = () => {
    if (name) {
      onSave(name, selectedIcon);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit' : 'Create'} Category</DialogTitle>
          <DialogDescription>
            {category ? `Editing the "${category}" category.` : 'Create a new budget category.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">Icon</Label>
            <IconPicker selectedIcon={selectedIcon} onIconChange={setSelectedIcon} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
