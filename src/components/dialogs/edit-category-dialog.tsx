

"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconPicker } from '../icon-picker';
import type { Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockCategories } from '@/lib/mock-data';
import type { icons } from 'lucide-react';

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
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof icons>('Package');
  
  const isEditing = !!category;
  const isPredefined = category?.isDefault || false;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setSelectedCategoryName(category.name);
        setCustomName(category.isDefault ? '' : category.name);
        setSelectedIcon(category.icon);
      } else {
        setSelectedCategoryName('');
        setCustomName('');
        setSelectedIcon('Package');
      }
    }
  }, [isOpen, category]);
  
  const handleSave = () => {
    const finalName = isEditing ? category.name : (selectedCategoryName === CREATE_NEW_VALUE ? customName.trim() : selectedCategoryName);
    if (finalName) {
      const existingCategory = allCategories.find(c => c.name === finalName);
      onSave({
        name: finalName,
        icon: isEditing ? selectedIcon : (existingCategory ? existingCategory.icon : selectedIcon),
        isDefault: isEditing ? category.isDefault : (existingCategory?.isDefault || false),
      });
      onClose();
    }
  };

  const allCategories = mockCategories.concat(availableCategories.filter(ac => !mockCategories.some(mc => mc.name === ac.name)));
  
  useEffect(() => {
      if(selectedCategoryName && selectedCategoryName !== CREATE_NEW_VALUE) {
          const cat = allCategories.find(c => c.name === selectedCategoryName);
          if (cat) {
            setSelectedIcon(cat.icon);
          }
      }
  }, [selectedCategoryName, allCategories]);

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
                    {availableCategories.map(cat => (
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">Icon</Label>
            <IconPicker selectedIcon={selectedIcon} onIconChange={setSelectedIcon} className="col-span-3" disabled={isPredefined} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isEditing ? false : (!selectedCategoryName || (selectedCategoryName === CREATE_NEW_VALUE && !customName.trim()))}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
