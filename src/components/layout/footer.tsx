
"use client";

import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
    return (
        <footer className="bg-muted/30 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <Logo />
                
                <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
                <Link href="#" className="hover:text-primary transition-smooth">Privacy Policy</Link>
                <Link href="#" className="hover:text-primary transition-smooth">Terms of Service</Link>
                <Link href="#" className="hover:text-primary transition-smooth">Contact</Link>
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} SpendWise Analyzer. All rights reserved.
            </div>
            </div>
        </footer>
    );
}
