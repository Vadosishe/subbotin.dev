import { ReactNode } from "react";

export function BentoGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 auto-rows-[minmax(140px,auto)] gap-4 md:gap-6 mt-12 px-4 md:px-0">
            {children}
        </div>
    );
}
