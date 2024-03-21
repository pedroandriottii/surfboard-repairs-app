"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return { error: "Campos Inválidos!"};
    }

    const { email, password, name, phone } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return { error: "Email já cadastrado!"};
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
        }
    });

    // TODO: SEND VERIFICATION TOKEN EMAIL

    return { success: "Conta criada com Sucesso!!" };
}
