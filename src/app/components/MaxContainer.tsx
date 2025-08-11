
import { ReactNode } from "react";

interface MaxContainerProps {
    children: ReactNode;
    className?: string;
}

export default function MaxContainer({ children, className = "" }: MaxContainerProps) {
    return (
        <div className={`mx-auto max-w-7xl px-4 ${className}`}>
            {children}
        </div>
    );
}