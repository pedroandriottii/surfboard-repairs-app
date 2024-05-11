import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(
        { message: "Email inválido" }
    ),
    password: z.string().min(1, { message: "Insira a Senha!" })
});

export const RegisterSchema = z.object({
    email: z.string().email(
        { message: "Email inválido" }
    ),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres!" }),
    name: z.string().min(1, { message: "Insira o Nome!" }),
    phone: z.string().min(1, { message: "Insira o Telefone!" }),
});

export const ResetSchema = z.object({
    email: z.string().email(
        { message: "Insira o e-mail!" }
    ),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6,
        { message: "A senha deve ter no mínimo 6 caracteres." }
    ),
});

export const ServiceSchema = z.object({
    client_name: z.string().min(1, { message: "Insira o Nome!" }),
    user_mail: z.string().email(
        { message: "Email inválido" }
    ),
    phone: z.string().min(1, { message: "Insira o Telefone!" }),
    value: z.number().min(1, { message: "Insira o Valor!" }),
    max_time: z.date(),
    description: z.string(),
    payment_method: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "FREE"]),
    photo_url: z.union([z.string().url(), z.literal(""), z.null()]),

});

export const SettingsSchema = z.object({
    name: z.optional(z.string().min(1, { message: "Insira o Nome!" })),
})

export const ChangeStatusSchema = z.object({
    newStatus: z.enum(["PENDING", "READY", "DELIVERED"]),
});