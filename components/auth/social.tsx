"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export const Social = () => {
    const onClick = (provider: "google") => {
    }
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button disabled size="lg" className="w-full gap-2 bg-black text-white border-realce rounded-xl hover:bg-realce font-bold hover:text-black" variant="outline" onClick={() => onClick("google")}>
                <FcGoogle size="20px" />
                <p >Entrar com Google</p>
            </Button>
        </div>
    )
};