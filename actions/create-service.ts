"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { ServiceSchema } from "@/schemas";

export const createService = async (values: z.infer<typeof ServiceSchema>) => {
    const validatedFields = ServiceSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Erro de validação:", validatedFields.error);
        return { error: "Campos Inválidos!" };
    }

    try {
        const { client_name, user_mail, phone, value, max_time, description } = validatedFields.data;
        const status = "PENDING";
        const now_time = new Date();
        const photo_url = validatedFields.data.photo_url || "";

        const service = await db.service.create({
            data: {
                client_name,
                user_mail,
                phone,
                value,
                max_time,
                now_time,
                description,
                status,
                photo_url,
            }
        });
        return { success: "Serviço criado com sucesso" };
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        return { error: "Erro ao inserir serviço no banco de dados." };
    }
}
