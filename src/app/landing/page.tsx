
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
  Calendar,
  Target
} from "lucide-react";

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
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90 transition-smooth px-8 py-6 text-lg font-semibold w-full sm:w-auto"
                asChild
              >
                <Link href="/dashboard">Try it yourself <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/20 text-primary hover:bg-primary/5 px-8 py-6 text-lg font-semibold w-full sm:w-auto"
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

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Powerful Financial <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Analytics</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand and optimize your spending habits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-smooth bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Spending Breakdown</CardTitle>
                <CardDescription>
                  Visualize your expenses by category with interactive charts and detailed breakdowns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-smooth bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Track spending patterns over time and identify trends to make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-smooth bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Smart Insights</CardTitle>
                <CardDescription>
                  Get AI-powered recommendations to optimize your spending and reach financial goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-smooth bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Monitor your transactions and spending in real-time with automatic categorization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-smooth bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Bank-level Security</CardTitle>
                <CardDescription>
                  Your financial data is protected with enterprise-grade security and encryption
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-smooth bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Process thousands of transactions instantly with our optimized analytics engine
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Take Control of Your 
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Financial Future</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Stop wondering where your money goes. Our platform gives you the clarity and insights 
                you need to make confident financial decisions.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Identify Money Leaks</h3>
                    <p className="text-muted-foreground">Discover hidden spending patterns and eliminate unnecessary expenses automatically.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Set Smarter Budgets</h3>
                    <p className="text-muted-foreground">Create realistic budgets based on your actual spending history and goals.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Achieve Financial Goals</h3>
                    <p className="text-muted-foreground">Track progress toward your goals and get personalized recommendations to reach them faster.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-card rounded-lg p-4 sm:p-6 shadow-lg">
                    <DollarSign className="w-8 h-8 text-primary mb-3" />
                    <div className="text-2xl font-bold mb-1">$8,847</div>
                    <div className="text-sm text-muted-foreground">Total Spending</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 sm:p-6 shadow-lg">
                    <BarChart3 className="w-8 h-8 text-accent mb-3" />
                    <div className="text-2xl font-bold mb-1">37</div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 sm:p-6 shadow-lg col-span-2">
                    <TrendingUp className="w-8 h-8 text-primary mb-3" />
                    <div className="text-lg font-semibold mb-2">Spending Trend</div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-primary to-accent"></div>
                    </div>
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
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold w-full sm:w-auto"
              asChild
            >
              <Link href="/dashboard">Start Free Trial <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold w-full sm:w-auto"
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
