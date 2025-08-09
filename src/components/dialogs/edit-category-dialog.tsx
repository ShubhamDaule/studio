
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockCategories } from '@/lib/mock-data';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category?: Category | null;
  availableCategories?: Category[];
};

const CREATE_NEW_VALUE = '__CREATE_NEW__';

export function EditCategoryDialog({ isOpen, onClose, onSave, category, availableCategories = [] }: Props) {
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [customName, setCustomName] = useState('');
  
  const isEditing = !!category;
  const isPredefined = !!category?.isDefault;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setCustomName(category.isDefault ? '' : category.name);
      } else {
        setSelectedCategoryName('');
        setCustomName('');
      }
    }
  }, [isOpen, category]);
  
  const handleSave = () => {
    const finalName = isEditing ? customName.trim() || category.name : (selectedCategoryName === CREATE_NEW_VALUE ? customName.trim() : selectedCategoryName);
    if (finalName) {
      const existingCategory = mockCategories.find(c => c.name === finalName);
      onSave({
        name: finalName,
        icon: isEditing ? category.icon : (existingCategory ? existingCategory.icon : 'Package'),
        isDefault: isEditing ? category.isDefault : (existingCategory?.isDefault || false),
      });
      onClose();
    }
  };
  
  const uniqueAvailableCategories = Array.from(new Map(availableCategories.map(item => [item.name, item])).values());

  const renderNameInput = () => {
    if (isEditing) {
        return <Input id="name" value={customName || category?.name} className="col-span-3" disabled={isPredefined} onChange={(e) => setCustomName(e.target.value)} />;
    }

    return (
        <div className="col-span-3 space-y-2">
            <Select value={selectedCategoryName} onValueChange={setSelectedCategoryName}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueAvailableCategories.map(cat => (
                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                    <SelectItem value={CREATE_NEW_VALUE}>Create new category...</SelectItem>
                </SelectContent>
            </Select>
            {selectedCategoryName === CREATE_NEW_VALUE && (
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
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Category</DialogTitle>
          <DialogDescription>
            {isEditing ? `Editing the "${category?.name}" category.` : 'Add a new category to your budget.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="name" className="text-right pt-2">Name</Label>
            {renderNameInput()}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isEditing ? (isPredefined ? false : !customName.trim()) : (!selectedCategoryName || (selectedCategoryName === CREATE_NEW_VALUE && !customName.trim()))}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
