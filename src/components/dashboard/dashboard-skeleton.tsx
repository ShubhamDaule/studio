"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="h-[350px]">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
