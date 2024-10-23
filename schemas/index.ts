import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(
        { message: "Email inválido" }
    ),
    password: z.string().min(1, { message: "Insira a Senha!" })
});

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    name: z.string().min(1, { message: "Insira o Nome!" }),
    phone: z.string().min(1, { message: "Insira o Telefone!" }),
    password: z.string()
        .min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
        .max(18, { message: "A senha deve ter no máximo 18 caracteres!" })
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])/, { message: "A senha deve conter pelo menos uma letra maiúscula, um número e um desses caracteres especiais: !@#$%^&*." }),
    confirmPassword: z.string().min(6, { message: "Confirme a senha!" })
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem!",
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
    value: z.number().min(0, { message: "Insira o Valor!" }),
    max_time: z.union([z.date(), z.string()]).transform((value) => new Date(value)),
    description: z.string(),
    photo_url: z.union([z.string().url(), z.literal(""), z.null()]),

});

export const SettingsSchema = z.object({
    name: z.optional(z.string().min(1, { message: "Insira o Nome!" })),
    email: z.optional(z.string().email(
        { message: "Email inválido" }
    )),
    password: z.optional(z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })),
    newPassword: z.optional(z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })),
}).refine((data) => {
    if (data.password && !data.newPassword) {
        return false;
    }
    return true;
}, {
    message: "Insira a senha antiga e a nova senha!",
    path: ["newPassword"]
})
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }
        return true;
    }, {
        message: "Insira a senha antiga e a nova senha!",
        path: ["password"]
    })

export const ChangeStatusSchema = z.object({
    status: z.enum(['PENDING', 'READY', 'DELIVERED']),
    ready_time: z.date().optional(),
    delivered_time: z.date().optional(),
    payment_method: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PIX', 'FREE']).optional(),
}).refine((data) => {
    if (data.status === 'DELIVERED' && !data.payment_method) {
        return false;
    }
    return true;
}, {
    message: 'Método de pagamento é obrigatório ao entregar',
    path: ['payment_method'],
});

// SURFBOARD SCHEMA

export const SurfboardSchema = z.object({
    title: z.string().min(1, { message: "Insira o Título!" }),
    price: z.number().min(0, { message: "Insira o Preço!" }),
    size: z.string().optional(),
    volume: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
    }, z.number().positive("O volume deve ser um número positivo").optional()),
    model: z.string().optional(),
    description: z.string().optional(),
    category: z.enum([
        "BANDIDA",
        "CORINGA",
        "MR",
        "FISH_70",
        "GOO_FISH",
        "FISH_SUPER",
        "MINI_FUN",
        "MINI_LONG",
        "LONG",
        "KITE_SURF",
        "KITE_FOIL"
    ]).optional(),
    is_new: z.boolean(),
});

export const OtpFormSchema = z.object({
    pin: z.string().min(6, {
        message: "O código deve ter 6 dígitos.",
    }),
    email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
    password: z.string()
        .min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
        .max(18, { message: "A senha deve ter no máximo 18 caracteres." })
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])/, { message: "A senha deve conter pelo menos uma letra maiúscula, um número e um desses caracteres especiais: !@#$%^&*." }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
});