"use server";

import { db } from "@/lib/db";

export const deleteService = async (id: string) => {
    try {
        await db.service.delete({
            where: { id },
        });
        return { success: "Serviço deletado com sucesso" };
    } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        return { error: "Erro ao deletar serviço." };
    }
};
