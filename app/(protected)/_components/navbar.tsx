"use client";

import { Button } from "@/components/ui/button";
import  Link  from "next/link"
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-slate-800 flex justify-around items-center p-4 shadow-sm">
            <div className="flex gap-5">
                <Button asChild variant={pathname === "/server" ? "default" : "outline"}>
                    <Link href="/home">Home</Link>
                </Button>
                <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
                    <Link href="/server">Base</Link>
                </Button>
                {/* <Button asChild variant={pathname === "/client" ? "default" : "outline"}>
                    <Link href="/client">Cliente</Link>
                </Button> */}
                <UserButton />
            </div>
        </nav>            
    )
}