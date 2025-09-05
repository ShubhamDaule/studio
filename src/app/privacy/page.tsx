
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Renders the Privacy Policy page.
 * This is a static page containing legal information about data handling.
 */
export default function PrivacyPolicyPage() {
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
                    <CardTitle className="text-3xl">Privacy Policy</CardTitle>
                    <CardDescription>
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
                        <p>
                            Welcome to SpendWise Analyzer. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                        </p>
                    </section>
                     <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
                        <p>
                           We may collect information about you in a variety of ways. The information we may collect via the Application includes:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the Application.</li>
                            <li><strong>Financial Data:</strong> We do not store your financial data. All financial information you upload (such as bank statements) is processed in real-time and is not saved on our servers. The extracted transaction data is stored only in your browser's local session and is deleted when you close the tab.</li>
                        </ul>
                    </section>
                     <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">3. Use of Your Information</h2>
                        <p>
                            Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to create and manage your account and generate personalized financial insights.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">4. Security of Your Information</h2>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>
                    </section>
                     <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
                        <p>
                            If you have questions or comments about this Privacy Policy, please contact us through the <Link href="/contact" className="text-primary hover:underline">contact page</Link>.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
