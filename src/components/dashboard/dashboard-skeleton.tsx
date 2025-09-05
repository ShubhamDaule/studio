
"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a skeleton loading state for the dashboard.
 * This provides a visual placeholder while data is being fetched or processed,
 * improving the user experience by indicating that content is on its way.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Skeleton for the tab controls */}
      <div className="grid grid-cols-4 gap-2 rounded-lg bg-muted p-1">
        <Skeleton className="h-8 rounded-md bg-background/80" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
      </div>

      {/* Skeleton for the four main stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="mt-2 h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for the chart section */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-4 px-10">
            <Skeleton className="h-[80%] w-8" />
            <Skeleton className="h-[60%] w-8" />
            <Skeleton className="h-[90%] w-8" />
            <Skeleton className="h-[50%] w-8" />
            <Skeleton className="h-[75%] w-8" />
            <Skeleton className="h-[40%] w-8" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
