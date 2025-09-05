
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Renders the Terms of Service page.
 * This is a static page containing legal terms for using the application.
 */
export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
            <Button asChild variant="link" className="mb-4 -ml-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Terms of Service</CardTitle>
                    <CardDescription>
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using SpendWise Analyzer (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you do not have permission to access the Service.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
                        <p>
                            SpendWise Analyzer is a financial analytics tool that helps users upload their bank statements, visualize spending patterns, and gain AI-powered insights into their financial habits. The service is for informational purposes only and does not constitute financial advice.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
                        <p>
                            To access the Service, you must create an account. You are responsible for safeguarding your account and for all activities that occur under it. You agree to provide accurate and complete information and to keep this information up to date.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">4. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. SpendWise Analyzer makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
                        <p>
                            In no event shall SpendWise Analyzer or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SpendWise Analyzer's website.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">6. Changes to Terms</h2>
                        <p>
                           We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
