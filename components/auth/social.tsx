"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
    const onClick = (provider: "google") => {
        signIn(provider, {callbackUrl: DEFAULT_LOGIN_REDIRECT});
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button size="lg" className="w-full gap-2" variant="outline" onClick={()=> onClick("google")}>
                <FcGoogle size="20px"/>
                <p>Entre com Google</p>
            </Button>
        </div>
    )
};