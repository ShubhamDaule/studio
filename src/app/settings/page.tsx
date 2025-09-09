
"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useTiers } from "@/hooks/use-tiers";
import { cn } from "@/lib/utils";

// Schema for validating the profile form using Zod.
const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot be longer than 50 characters." }),
});

/**
 * Renders the settings page where users can manage their profile and account information.
 */
export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const router = useRouter();
  const { isPro, isPremium, setIsPro, setIsPremium } = useTiers();

  // Initialize react-hook-form with the validation schema and default values.
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });

  /**
   * Handles the submission of the profile form.
   * Calls the updateUserProfile function from the auth context.
   * @param {object} values - The form values.
   */
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    await updateUserProfile(values.displayName);
  };

  // If there's no user, don't render the component.
  // This can happen briefly during initial load or after sign-out.
  if (!user) {
    return null; 
  }

  const currentTier = isPremium ? "Premium" : isPro ? "Pro" : "Free";

  const handleSetTier = (tier: 'Free' | 'Pro' | 'Premium') => {
    if (tier === 'Free') {
        setIsPremium(false);
        setIsPro(false);
    } else if (tier === 'Pro') {
        setIsPremium(false);
        setIsPro(true);
    } else { // Premium
        setIsPremium(true);
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and personal information.</p>
        </div>
        <Button asChild variant="outline">
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
      </div>
      <div className="space-y-8">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="flex justify-start">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email || ''} disabled className="mt-1" />
             </div>
              <p className="text-sm text-muted-foreground">
                Email cannot be changed. Contact support if you need to update your email address.
              </p>
          </CardContent>
        </Card>

         {/* Tier Management Card */}
        <Card>
            <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>
                    For testing purposes, you can switch your subscription tier here.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm">
                    Your current tier is: <span className="font-bold text-primary">{currentTier}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    {(['Free', 'Pro', 'Premium'] as const).map(tier => (
                         <Button
                            key={tier}
                            variant={currentTier === tier ? 'secondary' : 'outline'}
                            onClick={() => handleSetTier(tier)}
                            className={cn("w-full sm:w-auto", currentTier === tier && "font-bold border-primary/50 text-primary")}
                        >
                            {currentTier === tier && <CheckCircle className="mr-2 h-4 w-4" />}
                            Set to {tier}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
