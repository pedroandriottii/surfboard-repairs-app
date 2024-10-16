"use server";

import * as z from "zod";
import { ServiceSchema } from "@/schemas";

export const editService = async (id: string, values: z.infer<typeof ServiceSchema>, accessToken: string) => {
    const validatedFields = ServiceSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Erro de validação:", validatedFields.error);
        return { error: "Campos Inválidos!" };
    }

    try {
        const { client_name, user_mail, phone, value, max_time, description, photo_url } = validatedFields.data;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                client_name,
                user_mail,
                phone,
                value,
                max_time,
                description,
                photo_url: photo_url || "",
            })
        });

        if (!response.ok) {
            const result = await response.json();
            console.error("Erro ao atualizar serviço:", result);
            throw new Error(result.error || `Erro ao atualizar serviço: ${response.statusText}`);
        }

        return { success: "Serviço atualizado com sucesso" };
    } catch (error) {
        console.error("Erro ao atualizar serviço via API externa:", error);
        return { error: "Erro ao atualizar serviço na API externa." };
    }
};
