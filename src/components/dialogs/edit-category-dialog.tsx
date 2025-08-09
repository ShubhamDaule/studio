
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconPicker } from '../icon-picker';
import type { Category } from '@/lib/types';
import { defaultCategoryIcons } from '../icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category, icon: string) => void;
  category?: Category | null;
  icon?: string | null;
  availableCategories?: Category[];
};

export function EditCategoryDialog({ isOpen, onClose, onSave, category, icon: initialIcon, availableCategories = [] }: Props) {
  const [name, setName] = useState<Category | ''>('');
  const [selectedIcon, setSelectedIcon] = useState('Smile');
  
  const isEditing = !!category;

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
  
  useEffect(() => {
      if(name && defaultCategoryIcons[name as keyof typeof defaultCategoryIcons]) {
          const newIconName = Object.keys(defaultCategoryIcons).find(key => key === name);
          if (newIconName) setSelectedIcon(newIconName);
      }
  }, [name]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit' : 'Add'} Category</DialogTitle>
          <DialogDescription>
            {category ? `Editing the "${category}" category.` : 'Add a new category to your budget.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            {isEditing ? (
                 <Input id="name" value={name} onChange={(e) => setName(e.target.value as Category)} className="col-span-3" />
            ) : (
                <Select value={name} onValueChange={(value) => setName(value as Category)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">Icon</Label>
            <IconPicker selectedIcon={selectedIcon} onIconChange={setSelectedIcon} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
