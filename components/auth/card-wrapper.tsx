"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode,
    headerLabel: string,
    backButtonLabel?: string,
    backButtonHref?: string,
    showSocial?: boolean,
    headerTitle: string,
};

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
    headerTitle,
}: CardWrapperProps) => {
    return (
        <Card className="p-4 bg-black">
            <CardHeader className="text-center text-realce">
                <Header label={headerLabel} title={headerTitle} />
            </CardHeader>
            <CardContent className="text-white">
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter className="text-white">
                {backButtonLabel && backButtonHref && (
                    <BackButton label={backButtonLabel} href={backButtonHref} />
                )}
            </CardFooter>
        </Card>
    )
}