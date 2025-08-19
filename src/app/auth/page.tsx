
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoogleIcon, AppleIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";


const AuthForm = () => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { user, signInWithGoogle, signInWithApple } = useAuth();
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
            <div className="absolute top-8 left-8 flex items-center gap-8">
                <Logo />
                 <Button asChild variant="link" className="text-muted-foreground">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            <main className="w-full max-w-md mx-auto">
                <div className="bg-card/80 backdrop-blur-sm border rounded-lg shadow-lg p-8 transition-all duration-300 ease-in-out">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Welcome</h1>
                        <p className="text-muted-foreground">
                            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </div>

                    <div className="relative bg-muted p-1 rounded-full flex items-center mb-6">
                        <div 
                            className={cn(
                                "absolute h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] bg-background shadow-sm rounded-full transition-transform duration-300 ease-in-out",
                                mode === 'signin' ? 'transform translate-x-0' : 'transform translate-x-[calc(100%)]'
                            )}
                        />
                        <button 
                            onClick={() => setMode('signin')}
                            className={cn(
                                "relative z-10 w-full py-2 text-sm font-medium rounded-full",
                                mode === 'signin' ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => setMode('signup')}
                            className={cn(
                                "relative z-10 w-full py-2 text-sm font-medium rounded-full",
                                mode === 'signup' ? 'text-primary' : 'text-muted-foreground'
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

                        <Button type="submit" className="w-full btn-gradient-base btn-hover-fade">
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

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" type="button" onClick={signInWithGoogle}><GoogleIcon className="mr-2" /> Google</Button>
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

const AuthPageContent = () => {
    return (
         <Suspense fallback={<div>Loading...</div>}>
            <AuthForm />
        </Suspense>
    )
}

export default function AuthPage() {
    return <AuthPageContent />
}
