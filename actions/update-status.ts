"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { ChangeStatusSchema } from "@/schemas";

export const updateStatus = async (serviceId: string, values: z.infer<typeof ChangeStatusSchema>) => {
    const validatedFields = ChangeStatusSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Erro de validação:", validatedFields.error);
        return { error: "Campos Inválidos!" };
    }

    try {
        const { status } = validatedFields.data;
        const currentDate = new Date();

        const dataToUpdate: any = { status };

        if (status === 'READY') {
            dataToUpdate.ready_time = currentDate;
        } else if (status === 'DELIVERED') {
            dataToUpdate.delivered_time = currentDate;
            dataToUpdate.payment_method = values.payment_method;
        }

        const service = await db.service.update({
            where: { id: serviceId },
            data: dataToUpdate,
        });

        return { success: "Status Alterado Com Sucesso!" };
    } catch (error) {
        console.error("Erro ao Alterar Status:", error);
        return { error: "Erro ao inserir serviço no banco de dados." };
    }
}
