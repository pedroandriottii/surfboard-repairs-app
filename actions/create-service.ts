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
        const { client_name, user_mail, phone, value, max_time, description, payment_method, status } = validatedFields.data;
        const now_time = new Date();

        const service = await db.service.create({
            data: {
                client_name,
                user_mail,
                phone,
                value,
                max_time,
                now_time,
                description,
                payment_method,
                status,
            }
        });

        console.log("Serviço criado com sucesso:", service);
        return { success: "Serviço criado com sucesso" };
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        return { error: "Erro ao inserir serviço no banco de dados." };
    }
}