"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyBlockProps {
    code: string;
    children: React.ReactNode;
}

export function CopyBlock({ code, children }: CopyBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative group">
            {/* The code content */}
            {children}
            
            {/* Copy button */}
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100 border border-white/5 backdrop-blur-sm"
                title="Copy code"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
}
