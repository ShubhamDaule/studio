
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=inactive]:text-black dark:data-[state=inactive]:text-white data-[state=active]:text-primary",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName


const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const listRef = React.useRef<HTMLDivElement>(null);

  const updateIndicator = React.useCallback(() => {
    if (listRef.current) {
      const activeButton = listRef.current.querySelector<HTMLButtonElement>(
        '[role="tab"][data-state="active"]'
      );
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, []);

  React.useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);
  
  // This is a bit of a hack to get the indicator to update when the tabs change
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
        for(let mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                updateIndicator();
            }
        }
    });

    if (listRef.current) {
        const tabButtons = listRef.current.querySelectorAll('[role="tab"]');
        tabButtons.forEach(tab => {
             observer.observe(tab, { attributes: true });
        })
    }
    
    return () => observer.disconnect();
  }, [updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      className={cn(
        "relative inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <span
        className="absolute left-0 h-[calc(100%-0.5rem)] rounded-md bg-background shadow-sm transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
      {children}
    </TabsPrimitive.List>
  );
});
AnimatedTabsList.displayName = "AnimatedTabsList";

export { Tabs, AnimatedTabsList as TabsList, TabsTrigger, TabsContent };
