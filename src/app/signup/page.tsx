
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon, FacebookIcon, AppleIcon } from "@/components/icons";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
  const router = useRouter();


  useEffect(() => {
    document.title = "Create account • SpendWise";
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email/password signup
    console.log("Signup attempt");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Marketing panel (matches landing styles) */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 text-primary bg-primary/10 mb-6">
              <span className="text-sm">Get started free</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Create your
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> SpendWise Analyzer</span>
              {" "}account
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Join thousands who track spending, set smarter budgets, and gain AI-powered insights.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">No credit card required</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">Cancel anytime</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">Bank-level security</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/login" className="inline-flex items-center text-primary hover:opacity-90 font-medium">
                Already have an account? Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right - Sign up Card */}
          <div className="w-full">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Create account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 h-11"
                      required
                      aria-label="Email address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-11"
                        required
                        aria-label="Password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-11"
                        required
                        aria-label="Confirm password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90 rounded-full">
                    Create account
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" type="button" onClick={signInWithGoogle}><GoogleIcon className="mr-2" /> Google</Button>
                    <Button variant="outline" type="button" onClick={signInWithFacebook}><FacebookIcon className="mr-2" /> Facebook</Button>
                    <Button variant="outline" type="button" onClick={signInWithApple}><AppleIcon className="mr-2" /> Apple</Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:opacity-90 font-medium">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-primary hover:opacity-90 font-medium">Privacy Policy</Link>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
