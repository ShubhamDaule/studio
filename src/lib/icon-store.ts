import { icons, type LucideIcon } from 'lucide-react';

export const iconList = Object.keys(icons) as (keyof typeof icons)[];

export const defaultIcon = "Smile";

const iconStore: { [category: string]: string } = {};

export function getIcon(category: string): string {
    return iconStore[category] || defaultIcon;
}

export function setIcon(category: string, iconName: string): void {
    if (iconList.includes(iconName as any)) {
        iconStore[category] = iconName;
    } else {
        console.warn(`Icon "${iconName}" not found in lucide-react library.`);
    }
}
