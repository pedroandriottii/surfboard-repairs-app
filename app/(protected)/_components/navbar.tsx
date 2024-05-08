"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";
import { useCurrentRole } from "@/hooks/use-current-role";

export const Navbar = () => {
    const role = useCurrentRole()
    const pathname = usePathname();

    return (
        <nav className="bg-slate-800 flex p-4 shadow-sm">
            <div className="flex gap-4 items-center ">
                <Button asChild variant={pathname === "/home" ? "secondary" : "outline"}>
                    <Link href="/home">Início</Link>
                </Button>
                <Button asChild variant={pathname === "/services" ? "secondary" : "outline"}>
                    <Link href="/services">Serviços</Link>
                </Button>
                {role === "ADMIN" && (
                    <Button asChild variant={pathname === "/dashboard" ? "secondary" : "outline"}>
                        <Link href="/dashboard">Relatórios</Link>
                    </Button>
                )}
                <UserButton />
            </div>
        </nav>
    )
}