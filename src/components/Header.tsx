"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { TimeWidget } from "./bento/TimeWidget";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/data/siteConfig";

export default function Header() {
    const { t } = useLanguage();
    const openCommandPalette = () => {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
    };

    return (
        <header className="flex justify-between items-center py-6 px-4 md:px-0 mb-8 border-b border-current/10">
            <div className="flex items-center gap-6">
                <div className="hidden sm:block">
                    <TimeWidget />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <LanguageToggle />
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
