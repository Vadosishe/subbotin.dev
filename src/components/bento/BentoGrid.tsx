import { ReactNode } from "react";

export function BentoGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 px-4 md:px-0 auto-rows-min">
            {children}
        </div>
    );
}
