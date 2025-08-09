
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Sign in • SpendWise";
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email/password login
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Marketing panel (matches landing styles) */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 text-primary bg-primary/10 mb-6">
              <span className="text-sm">Welcome back</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Sign in to
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> SpendWise Analyzer</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Continue where you left off. Track spending, set smarter budgets, and get
              AI-powered insights—all in one beautiful dashboard.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">Bank-level security with privacy first</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">Real-time analytics and trends</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">Smart budgets powered by AI</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/signup" className="inline-flex items-center text-primary hover:opacity-90 font-medium">
                New to SpendWise? Create a free account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right - Auth Card */}
          <div className="w-full">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Sign in</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 h-11"
                      required
                      aria-label="Email address"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90 rounded-full">
                    Sign in
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
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-primary hover:opacity-90 font-medium">Sign up</Link>
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
