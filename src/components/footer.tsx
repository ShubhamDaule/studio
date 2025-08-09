"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted/30 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SpendWise Analyzer
                </span>
                </div>
                
                <div className="flex space-x-6 text-sm text-muted-foreground">
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
