// Regras para Frontend Login

import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(
        {message: "Email inválido"}
    ),
    password: z.string().min(1, {message: "Insira a Senha!"})
});

export const RegisterSchema = z.object({
    email: z.string().email(
        {message: "Email inválido"}
    ),
    password: z.string().min(6, {message: "A senha deve ter no mínimo 6 caracteres!"}),
    name: z.string().min(1, {message: "Insira o Nome!"}),
    phone: z.string().min(1, {message: "Insira o Telefone!"}),
});

export const ResetSchema = z.object({
    email: z.string().email(
        {message: "Insira o e-mail!"}
    ),
});
