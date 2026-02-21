"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-6 px-4 md:px-0 mb-8 border-b border-current/10">
            <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
                vadosishe
            </Link>
            <div className="flex items-center gap-4">
                <nav className="flex gap-6">
                    <Link href="/" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
                        Home
                    </Link>
                    <Link href="/blog" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
                        Blog
                    </Link>
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
}
