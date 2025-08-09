"use client";

import type { FC } from 'react';
import {
  ShoppingCart,
  UtensilsCrossed,
  Plane,
  Shirt,
  Ticket,
  Lightbulb,
  MoreHorizontal,
  CreditCard,
  ShoppingBag,
  Landmark,
  HandCoins,
  AreaChart,
  type LucideIcon,
  icons
} from 'lucide-react';
import type { Category } from '@/lib/types';
import { getIcon } from '@/lib/icon-store';

export const defaultCategoryIcons: Record<string, LucideIcon> = {
  Groceries: ShoppingCart,
  Dining: UtensilsCrossed,
  'Travel & Transport': Plane,
  Shopping: Shirt,
  Entertainment: Ticket,
  Utilities: Lightbulb,
  Rent: Landmark,
  Cash: HandCoins,
  Investment: AreaChart,
  'Payment': CreditCard,
  Other: MoreHorizontal,
};

type CategoryIconProps = {
  category: Category;
  className?: string;
};

export const CategoryIcon: FC<CategoryIconProps> = ({ category, className }) => {
  const customIconName = getIcon(category);
  const IconComponent = (icons as Record<string, LucideIcon>)[customIconName] || defaultCategoryIcons[category as string] || ShoppingBag;
  return <IconComponent className={className} />;
};

export const TopMerchantIcon = ShoppingBag;

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
);

export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" {...props}><path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.89H8.038v-2.89h2.467v-2.14c0-2.45,1.44-3.8,3.67-3.8 c1.05,0,2.16,0.188,2.16,0.188v2.46h-1.294c-1.21,0-1.59,0.725-1.59,1.536v1.754h2.78l-0.45,2.89h-2.33v7.005 C18.307,21.153,22,17.013,22,12C22,6.477,17.523,2,12,2z" fill="#1877f2"></path></svg>
);

export const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C9.28 2 7.15 4.05 7.15 6.69c0 1.49.69 2.81 1.76 3.66-1.52.88-2.58 2.59-2.58 4.51 0 2.94 2.45 5.31 5.46 5.31s5.25-2.28 5.43-5.21h-3.32c-.11.83-.8 1.41-1.9 1.41-1.08 0-1.85-.6-1.9-1.51h6.68c.11-3.23-2.34-5.96-5.59-5.96zm-1.85 5.45c0-1.42 1.29-2.58 2.82-2.58s2.82 1.15 2.82 2.58-.93 2.58-2.82 2.58-2.82-1.16-2.82-2.58z" fillRule="evenodd" clipRule="evenodd" /></svg>
);