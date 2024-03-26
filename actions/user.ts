"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const user = async () => {
    const role = await currentRole();

    if(role === UserRole.USER) {
        return { success: "Conexão Estabelcida"}
    }

    return { error: "Credenciais Inválidas"}
}