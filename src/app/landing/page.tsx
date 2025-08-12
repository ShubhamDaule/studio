
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  BrainCircuit,
  Eye
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-brand-light/20 to-background">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
              ✨ Level up your financial insights
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              Master Your Spending with
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> AI-Powered </span>
              Analytics
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your financial data into actionable insights. Track spending patterns, 
              identify trends, and make smarter financial decisions with our intelligent analytics platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
               <Button
                className="btn-gradient-base btn-hover-fade w-full sm:w-auto px-8 py-6 text-lg"
                asChild
              >
                <Link href="/dashboard">Try It For Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button
                className="bg-white text-primary border border-primary font-bold px-8 py-6 text-lg transition-smooth hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white hover:border-0 w-full sm:w-auto"
                asChild
              >
                <Link href="/dashboard">Try Mock Data</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SpendWise Section */}
      <section id="why-spendwise" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Why <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SpendWise</span>?
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Go beyond simple tracking. SpendWise gives you the clarity and intelligence to truly master your financial life.
                </p>
            </div>

          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="relative">
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="SpendWise Dashboard Preview"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-2xl"
                    data-ai-hint="financial dashboard"
                />
            </div>
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BrainCircuit className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">AI-Powered Insights</h3>
                    <p className="text-muted-foreground">Get personalized advice from our Financial Coach, ask questions in plain English, and let our Anomaly Detective find unusual spending for you.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Comprehensive Visuals</h3>
                    <p className="text-muted-foreground">From spending breakdowns to trend analysis and budget tracking, our interactive charts make it easy to see where your money is going.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Secure & Real-Time</h3>
                    <p className="text-muted-foreground">Upload your statements with confidence. Your data is processed securely and your dashboard updates in real-time as you add transactions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-16 sm:py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8">
            Join thousands of users who have already taken control of their finances with SpendWise Analyzer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="btn-gradient-base btn-hover-fade px-8 py-6 text-lg w-full sm:w-auto"
              asChild
            >
              <Link href="/auth?mode=signup">Get Started <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button
              className="bg-white text-primary border border-primary font-bold px-8 py-6 text-lg transition-smooth hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white hover:border-0 w-full sm:w-auto"
              asChild
            >
              <Link href="/dashboard">Try Mock Data</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
