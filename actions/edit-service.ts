"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { ServiceSchema } from "@/schemas";

export const editService = async (id: string, values: z.infer<typeof ServiceSchema>) => {
    const validatedFields = ServiceSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Erro de validação:", validatedFields.error);
        return { error: "Campos Inválidos!" };
    }

    try {
        const { client_name, user_mail, phone, value, max_time, description, payment_method, photo_url } = validatedFields.data;

        const service = await db.service.update({
            where: { id },
            data: {
                client_name,
                user_mail,
                phone,
                value,
                max_time,
                description,
                payment_method,
                photo_url,
            },
        });
        return { success: "Serviço editado com sucesso", service };
    } catch (error) {
        console.error("Erro ao editar serviço:", error);
        return { error: "Erro ao editar serviço no banco de dados." };
    }
};
