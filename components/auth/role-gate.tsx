"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export const RoleGate = ({
    children,
    allowedRoles,
}: RoleGateProps) => {
    const role: UserRole | undefined = useCurrentRole();

    if (!role) {
        return null;
    }

    if (!allowedRoles.includes(role)) {
        return (
            <FormError message="Você não tem permissão para visualizar esse conteúdo! " />
        );
    }

    return (
        <>
            {children}
        </>
    );
};
