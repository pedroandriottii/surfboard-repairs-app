import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});

interface HeaderProps {
    label: string,
    title: string,
};

export const Header = ({ label, title }: HeaderProps) => {
    return (
        <div className={cn(font, "w-full flex flex-col gap-y-4 items-center justify-center")}>
            <h1 className={cn("text-3xl font-semibold", font.className)}>
                {title}
            </h1>
            <p className="text-muted-foreground text-sm text-white">
                {label}
            </p>
        </div>
    )
}