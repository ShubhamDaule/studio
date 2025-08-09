
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
import { mockCategories } from '@/lib/mock-data';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category, icon: string) => void;
  category?: Category | null;
  icon?: string | null;
  availableCategories?: Category[];
};

const CREATE_NEW_VALUE = '__CREATE_NEW__';

export function EditCategoryDialog({ isOpen, onClose, onSave, category, icon: initialIcon, availableCategories = [] }: Props) {
  const [name, setName] = useState<Category | '' | typeof CREATE_NEW_VALUE>('');
  const [customName, setCustomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Smile');
  
  const isEditing = !!category;
  const isPredefined = category ? mockCategories.includes(category) : false;

  useEffect(() => {
    if (isOpen) {
      setName(category || '');
      setCustomName('');
      const defaultIcon = category ? (Object.keys(defaultCategoryIcons).includes(category) ? category : 'Package') : 'Package';
      setSelectedIcon(initialIcon || defaultIcon);
    }
  }, [isOpen, category, initialIcon]);
  
  const handleSave = () => {
    const finalName = name === CREATE_NEW_VALUE ? customName.trim() : name;
    if (finalName) {
      onSave(finalName as Category, selectedIcon);
      onClose();
    }
  };
  
  useEffect(() => {
      if(name && name !== CREATE_NEW_VALUE && defaultCategoryIcons[name as keyof typeof defaultCategoryIcons]) {
          const newIconName = Object.keys(defaultCategoryIcons).find(key => key === name);
          if (newIconName) setSelectedIcon(newIconName);
      }
  }, [name]);

  const renderNameInput = () => {
    if (isEditing) {
        return (
            <Input id="name" value={name} className="col-span-3" disabled />
        )
    }

    return (
        <div className="col-span-3 space-y-2">
            <Select value={name} onValueChange={(value) => setName(value as Category)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    <SelectItem value={CREATE_NEW_VALUE}>Create new category...</SelectItem>
                </SelectContent>
            </Select>
            {name === CREATE_NEW_VALUE && (
                <Input 
                    placeholder="Enter custom category name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                />
            )}
        </div>
    )
  }


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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="name" className="text-right pt-2">Name</Label>
            {renderNameInput()}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">Icon</Label>
            <IconPicker selectedIcon={selectedIcon} onIconChange={setSelectedIcon} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name || (name === CREATE_NEW_VALUE && !customName.trim())}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
