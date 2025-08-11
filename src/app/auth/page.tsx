
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoogleIcon, FacebookIcon, AppleIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";


const AuthForm = () => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { user, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlMode = searchParams.get('mode');
        if (urlMode === 'signup') {
            setMode('signup');
        } else {
            setMode('signin');
        }
    }, [searchParams]);

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);
    
    useEffect(() => {
        document.title = mode === 'signin' ? "Sign In • SpendWise" : "Sign Up • SpendWise";
    }, [mode]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement email/password auth
        console.log("Auth attempt:", mode);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col justify-center items-center p-4">
            <div className="absolute top-8">
                <Logo />
            </div>

            <main className="w-full max-w-md mx-auto">
                <div className="bg-card/80 backdrop-blur-sm border rounded-lg shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Welcome</h1>
                        <p className="text-muted-foreground">
                            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </div>

                    <div className="bg-muted p-1 rounded-md flex gap-1 mb-6">
                        <button 
                            onClick={() => setMode('signin')}
                            className={cn(
                                "w-full py-2 text-sm font-medium rounded",
                                mode === 'signin' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'
                            )}
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => setMode('signup')}
                             className={cn(
                                "w-full py-2 text-sm font-medium rounded",
                                mode === 'signup' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'
                            )}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" required className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                    </Button>
                                </div>
                            </div>
                            
                            {mode === 'signup' && (
                                <div>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90">
                           {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </Button>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                            <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <Button variant="outline" type="button" onClick={signInWithGoogle}><GoogleIcon className="mr-2" /> Google</Button>
                            <Button variant="outline" type="button" onClick={signInWithFacebook}><FacebookIcon className="mr-2" /> Facebook</Button>
                            <Button variant="outline" type="button" onClick={signInWithApple}><AppleIcon className="mr-2" /> Apple</Button>
                        </div>

                    </form>
                </div>
                 <p className="text-center text-xs text-muted-foreground mt-6">
                    By {mode === 'signin' ? 'signing in' : 'signing up'}, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:opacity-90 font-medium">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-primary hover:opacity-90 font-medium">Privacy Policy</Link>.
                </p>
            </main>
        </div>
    );
};


export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthForm />
        </Suspense>
    )
}
