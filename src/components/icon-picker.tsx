
"use client";

import * as React from "react";
import { icons, type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { iconList } from "@/lib/icon-store";

interface IconPickerProps {
  selectedIcon: string;
  onIconChange: (iconName: string) => void;
  className?: string;
}

export function IconPicker({ selectedIcon, onIconChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const SelectedIconComponent = (icons as Record<string, LucideIcon>)[selectedIcon] || icons.Smile;

  const filteredIcons = iconList.filter(iconName => 
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start gap-2 text-left font-normal", className)}
        >
          <SelectedIconComponent className="h-5 w-5" />
          <span>{selectedIcon}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-2">
            <Input 
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
        </div>
        <ScrollArea className="h-64">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = (icons as Record<string, LucideIcon>)[iconName];
              return (
                <Button
                  key={iconName}
                  variant="ghost"
                  size="icon"
                  className={cn("h-10 w-10 rounded-md", selectedIcon === iconName && "bg-primary text-primary-foreground")}
                  onClick={() => {
                    onIconChange(iconName);
                    setIsOpen(false);
                  }}
                >
                  <IconComponent className="h-5 w-5" />
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
