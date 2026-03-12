import React from "react";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="relative flex items-center justify-center">
                {/* Outer glowing ring (pulse) */}
                <div className="absolute w-16 h-16 rounded-full border border-indigo-500/20 blur-sm animate-pulse"></div>

                {/* Inner spinning ring (CSS-only) */}
                <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500 animate-[spin_1s_linear_infinite]"></div>

                {/* Center element */}
                <div className="absolute w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
        </div>
    );
}
