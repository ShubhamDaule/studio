
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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" {...props}><path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.89H8.038v-2.89h2.467v-2.14c0-2.45,1.44-3.8,3.67-3.8 c1.05,0,2.16,0.188,2.16,0.188v2.46h-1.294c-1.21,0-1.59,0.725-1.59,1.536v1.754h2.78l-0.45,2.89h-2.33v7.005 C18.307,21.153,22,17.013,22,12C22,6.477,17.523,2,12,2z" fill="#1877f2"></path></svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C9.28 2 7.15 4.05 7.15 6.69c0 1.49.69 2.81 1.76 3.66-1.52.88-2.58 2.59-2.58 4.51 0 2.94 2.45 5.31 5.46 5.31s5.25-2.28 5.43-5.21h-3.32c-.11.83-.8 1.41-1.9 1.41-1.08 0-1.85-.6-1.9-1.51h6.68c.11-3.23-2.34-5.96-5.59-5.96zm-1.85 5.45c0-1.42 1.29-2.58 2.82-2.58s2.82 1.15 2.82 2.58-.93 2.58-2.82 2.58-2.82-1.16-2.82-2.58z" fillRule="evenodd" clipRule="evenodd" /></svg>
);


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
